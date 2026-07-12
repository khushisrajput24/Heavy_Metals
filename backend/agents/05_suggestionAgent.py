from google import genai
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import os, json, requests
import xml.etree.ElementTree as ET

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
suggestionRouter = APIRouter()

# Load corpus once only
with open("data/metal_remove_corpus.txt", "r", encoding="utf-8") as f:
    METAL_CORPUS = f.read()


def fetch_papers_arxiv_tavily(contaminant: str) -> list:
    papers = []
    
    # 1. Fetch from Tavily (web search, PMC, ScienceDirect)
    tavily_key = os.getenv("TAVILY_API_KEY")
    if tavily_key:
        try:
            url = "https://api.tavily.com/search"
            payload = {
                "api_key": tavily_key,
                "query": f"{contaminant} removal from water",
                "search_depth": "basic",
                "max_results": 3
            }
            res = requests.post(url, json=payload, timeout=4)
            if res.status_code == 200:
                data = res.json()
                for r in data.get("results", []):
                    papers.append({
                        "title": r.get("title"),
                        "url": r.get("url"),
                        "doi": None,
                        "abstract": r.get("content")
                    })
        except Exception:
            pass
            
    # 2. Fetch from arXiv (academic preprints)
    try:
        url = "http://export.arxiv.org/api/query"
        params = {
            "search_query": f"all:{contaminant} removal water",
            "max_results": 2
        }
        res = requests.get(url, params=params, timeout=4)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            ns = {'atom': 'http://www.w3.org/2005/Atom'}
            entries = root.findall('atom:entry', ns)
            for entry in entries:
                title_elem = entry.find('atom:title', ns)
                title = title_elem.text.strip().replace('\n', ' ') if title_elem is not None else "Unknown preprint"
                
                id_elem = entry.find('atom:id', ns)
                id_url = id_elem.text.strip() if id_elem is not None else None
                
                summary_elem = entry.find('atom:summary', ns)
                summary = summary_elem.text.strip().replace('\n', ' ') if summary_elem is not None else ""
                
                # DOI if present in arXiv metadata
                doi = None
                doi_elem = entry.find('{http://arxiv.org/schemas/atom}doi')
                if doi_elem is not None:
                    doi = doi_elem.text.strip()
                    
                papers.append({
                    "title": title,
                    "url": id_url,
                    "doi": doi,
                    "abstract": summary
                })
    except Exception:
        pass
        
    return papers


@suggestionRouter.get("/user/analysis/suggestions")
def api_suggestions(
    contaminant: str,
    risk_level: str = None,
    pollution_status: str = None,
    formula_hmpi: float = None,
    dominant_metals: str = None
):
    contaminant_clean = contaminant.strip().lower()
    
    # Define query dynamically for any searched contaminant
    query = f"Explain {contaminant_clean} removal methods. Classify them into Immediate actions, Long-term methods and Positive indicators. Also extract the research paper citations."

    # Fetch papers from arXiv + Tavily
    papers = fetch_papers_arxiv_tavily(contaminant_clean)

    # Check if this contaminant is present in our local corpus
    corpus_present = contaminant_clean in METAL_CORPUS.lower()
    
    # Construct Risk Context if available from Agents 2, 3, or 4
    risk_context = ""
    if risk_level or pollution_status or formula_hmpi is not None or dominant_metals:
        risk_context = "\nCURRENT RISK PROFILE FROM ANALYZER AGENTS:"
        if risk_level:
            risk_context += f"\n- Risk Level: {risk_level}"
        if pollution_status:
            risk_context += f"\n- Pollution Status: {pollution_status}"
        if formula_hmpi is not None:
            risk_context += f"\n- Calculated HMPI Index: {formula_hmpi}"
        if dominant_metals:
            risk_context += f"\n- Dominant Metals in Area: {dominant_metals}"
        risk_context += "\nAdjust the urgency and focus of your recommendations based on this risk profile (e.g. prioritize immediate containment if Risk Level is high).\n"

    # Base prompt instructions
    base_instructions = """
  You are a strict Environmental Policy and RAG Recommendation Agent (Agent 5).
  Classify your recommendations into Immediate actions, Long-term methods, and Positive indicators.
  Every item in immediate_actions, long_term, and positive_indicators must contain:
      - "text": the recommended method or indicator
      - "citations": list of papers matched from the context resources provided.
        Each citation object in the list must contain:
          - "title": exact title of the paper
          - "doi": DOI if present, or null
          - "url": URL of the paper
        If no verified citation exists, return an empty list [].

  RETURN ONLY THIS EXACT JSON (NO MARKDOWN OR WRAPPING):

  {
    "immediate_actions": [
      {
        "text": "some method",
        "citations": [
          {
            "title": "paper title",
            "doi": "doi if present",
            "url": "url if present"
          }
        ]
      }
    ],
    "long_term": [
      {
        "text": "some long-term method",
        "citations": []
      }
    ],
    "positive_indicators": [
      {
        "text": "indicator text",
        "citations": []
      }
    ]
  }
  """

    # Construct complete prompt
    if papers:
        papers_text = "\n\n".join([
            f"Paper Title: {p['title']}\nDOI: {p['doi']}\nURL: {p['url']}\nAbstract: {p['abstract']}"
            for p in papers
        ])

        if corpus_present:
            prompt = f"""
  {base_instructions}
  
  CONTEXT SOURCE 1 (Local Corpus Guidelines):
  {METAL_CORPUS}

  CONTEXT SOURCE 2 (Verified Scientific Web Resources and Preprints):
  {papers_text}
  
  {risk_context}

  QUESTION:
  {query}
  """
        else:
            prompt = f"""
  {base_instructions}
  
  Note: The contaminant '{contaminant_clean}' is not covered in detail in our local corpus. 
  Extract your recommendations and support them ENTIRELY using the verified Scientific Web Resources and Preprints provided below.

  CONTEXT SOURCE (Verified Scientific Web Resources and Preprints):
  {papers_text}
  
  {risk_context}

  QUESTION:
  {query}
  """
    else:
        # Fall back to corpus guidelines if available
        if corpus_present:
            prompt = f"""
  {base_instructions}

  CONTEXT SOURCE (Local Corpus Guidelines):
  {METAL_CORPUS}
  
  {risk_context}

  QUESTION:
  {query}
  """
        else:
            # If both fail, let Gemini generate general industry standard guidelines
            prompt = f"""
  {base_instructions}
  
  Note: Neither the local corpus nor web search engines returned documents. Please generate standard environmental mitigation recommendations for '{contaminant_clean}' based on international standards (WHO/EPA).
  
  {risk_context}

  QUESTION:
  {query}
  """

    # Using a valid Gemini model
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=[{"text": prompt}]
    )

    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid JSON response. Please try again."
        )

    return parsed
