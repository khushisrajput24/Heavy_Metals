from fastapi import APIRouter
import requests
import json
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
SS_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

# 1) SEARCH PAPERS USING SEMANTIC SCHOLAR

def search_papers(query, limit=5):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": query,
        "limit": limit,
        "fields": "title,authors,year,abstract,doi,url"
    }
    headers = {"x-api-key": SS_KEY}

    resp = requests.get(url, params=params, headers=headers)
    return resp.json().get("data", [])


# 2) BUILD MINI CORPUS (local RAG dataset)

def build_corpus(papers):
    corpus = []
    for p in papers:
        paper_id = p.get("paperId")
        doi = p.get("doi")

        # Prefer DOI → then fallback to Semantic Scholar page
        url = f"https://doi.org/{doi}" if doi else f"https://www.semanticscholar.org/paper/{paper_id}"

        corpus.append({
            "id": paper_id,
            "title": p.get("title"),
            "abstract": p.get("abstract", ""),
            "year": p.get("year"),
            "doi": doi,
            "url": url
        })
    return corpus


# 3) QUERY GEMINI WITH RESEARCH-CONTEXT

def ask_gemini(question, corpus):
    client = genai.Client(api_key=GEMINI_KEY)

    context = ""
    for d in corpus:
        context += f"""
[DOC:{d['id']}]
Title: {d['title']}
Year: {d['year']}
DOI: {d['doi']}
URL: {d['url']}
Abstract: {d['abstract']}
---
"""

    prompt = f"""
You are an AI assistant that answers ONLY using the provided research documents.

QUESTION:
{question}

DOCUMENTS:
{context}

Your output MUST be JSON in the following structure:
{{
  "answer": "<your research-backed summary>",
  "citations": [
    {{"doc_id": "", "title": "", "doi": "", "url": ""}}
  ]
}}
"""

    resp = client.responses.create(
        model="gemini-2.5-flash",
        input=prompt,
        max_output_tokens=700
    )

    return resp.output_text


# 4) FULL PIPELINE FOR FASTAPI

async def get_suggestions_from_report(contaminant: str):

    query_map = {
        "lead": "lead removal water treatment adsorption remediation heavy metals",
        "cadmium": "cadmium removal wastewater treatment adsorption remediation",
        "arsenic": "arsenic removal drinking water improvement membrane adsorption",
        "mercury": "mercury removal water treatment adsorption detoxification"
    }

    research_query = query_map.get(contaminant.lower())

    if not research_query:
        return {"error": "Unknown contaminant"}

    papers = search_papers(research_query, limit=5)
    corpus = build_corpus(papers)

    # Ask Gemini for categorized suggestions
    question = f"""
Water quality is poor due to {contaminant}.
Based ONLY on the research papers provided, generate:
1. Immediate Actions
2. Long-term Monitoring Steps
3. Positive Indicators

For each point, attach a list of citation objects (doc_id, title, doi, url).

Output JSON:
{{
  "immediate_actions": [
    {{"text": "", "citations": []}}
  ],
  "long_term": [
    {{"text": "", "citations": []}}
  ],
  "positive_indicators": [
    {{"text": "", "citations": []}}
  ]
}}
    """

    raw_output = ask_gemini(question, corpus)

    return json.loads(raw_output)

suggestionRouter = APIRouter()

@suggestionRouter.get("/user/analysis/suggestions")
async def suggestions(contaminant: str):
    return await get_suggestions_from_report(contaminant)
