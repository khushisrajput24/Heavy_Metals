from fastapi import APIRouter
import requests
import time
import json
import re
from typing import List, Dict, Any, Optional
from google import genai
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

# Load Gemini key (use env)
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

suggestionRouter = APIRouter()

# FAST MODE — 6 PAPERS
PAPERS_LIMIT = 6

# JSON CLEANER
def extract_json_from_text(raw: str) -> Optional[str]:
    if not raw:
        return None
    raw = re.sub(r"```.*?```", "", raw, flags=re.DOTALL)
    raw = raw.replace("`", "").strip()
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1:
        return None
    return raw[start:end+1]


# GEMINI CALL (your existing wrapper)
def call_gemini(prompt: str, model: str = "gemini-1.5-flash", max_output_tokens: int = 1000) -> str:
    # create client each call to avoid stale state; GEMINI_KEY loaded from env
    client = genai.Client(api_key=GEMINI_KEY)

    for _ in range(2):  # retry once
        try:
            # your existing working call style
            resp = client.models.generate(
                model=model,
                prompt=prompt,
                max_output_tokens=max_output_tokens,
            )
            text = resp.text
            if text:
                return text
        except Exception as e:
            print("[Gemini Error]", e)
        time.sleep(0.4)

    return ""


# CROSSREF PAPER SEARCH (unchanged)
def search_crossref_papers(query: str):
    print("[CrossRef] Query:", query)

    params = {
        "query": query,
        "select": "title,DOI,author,issued,abstract",
        "rows": PAPERS_LIMIT
    }

    try:
        resp = requests.get("https://api.crossref.org/works", params=params, timeout=10)
        resp.raise_for_status()

        items = resp.json()["message"]["items"]
        papers = []

        for it in items:
            title = it["title"][0] if it.get("title") else ""
            doi = it.get("DOI", "")
            url = f"https://doi.org/{doi}" if doi else ""

            # Authors
            authors = []
            if it.get("author"):
                for a in it["author"]:
                    name = (a.get("given","") + " " + a.get("family","")).strip()
                    if name:
                        authors.append(name)

            # Year
            year = None
            if it.get("issued") and it["issued"].get("date-parts"):
                year = it["issued"]["date-parts"][0][0]

            # Clean abstract
            abstract = it.get("abstract", "")
            abstract = re.sub("<.*?>", "", abstract)

            papers.append({
                "id": doi or title[:15],
                "title": title,
                "abstract": abstract,
                "authors": authors,
                "year": year,
                "doi": doi,
                "url": url
            })

        return papers

    except Exception as e:
        print("[CrossRef Error]", e)
        return []


# SUMMARIZE PAPER
def summarize_paper(p):
    prompt = f"""
Return ONLY JSON like:
{{
 "id": "{p['id']}",
 "title": "{p['title']}",
 "authors": {p['authors']},
 "year": {p['year'] or "null"},
 "doi": "{p['doi']}",
 "short_summary": "",
 "key_findings": [],
 "relevance_tags": []
}}
Paper abstract:
{p['abstract']}
"""
    raw = call_gemini(prompt)
    cleaned = extract_json_from_text(raw)
    if not cleaned:
        return None

    try:
        return json.loads(cleaned)
    except Exception as e:
        print("[Summarize JSON Error]", e)
        return None


# GENERATE SUGGESTIONS (crossref-based) (unchanged)
def generate_suggestions(summaries, contaminant):
    context = ""
    for s in summaries:
        context += f"[PAPER:{s['id']}] {s['title']} ({s['year']})\n"
        context += f"Summary: {s['short_summary']}\n---\n"

    prompt = f"""
Using ONLY this evidence, return JSON:

{{
 "immediate_actions": [{{"id": "", "text": "", "supported_by": []}}],
 "long_term": [{{"id": "", "text": "", "supported_by": []}}],
 "positive_indicators": [{{"id": "", "text": "", "supported_by": []}}]
}}

Rules:
- Use only valid PAPER IDs.
- 2–3 items per category.
- No hallucinated papers.

Contaminant: {contaminant}

Evidence:
{context}
"""

    raw = call_gemini(prompt)
    cleaned = extract_json_from_text(raw)
    if not cleaned:
        return None

    try:
        return json.loads(cleaned)
    except Exception as e:
        print("[Generate JSON Error]", e)
        return None


# INJECT CITATIONS (unchanged)
def inject_citations(suggestions, papers_map):
    def exp(items):
        arr = []
        for it in items:
            citations = []
            for pid in it.get("supported_by", []):
                if pid in papers_map:
                    citations.append(papers_map[pid])

            arr.append({
                "text": it.get("text", ""),
                "citations": citations
            })
        return arr

    return {
        "immediate_actions": exp(suggestions.get("immediate_actions", [])),
        "long_term": exp(suggestions.get("long_term", [])),
        "positive_indicators": exp(suggestions.get("positive_indicators", [])),
    }


# FALLBACK (unchanged)
def fallback(contaminant):
    return {
        "immediate_actions": [{"text": f"Reduce {contaminant} exposure immediately.", "citations": []}],
        "long_term": [{"text": f"Monitor {contaminant} in water regularly.", "citations": []}],
        "positive_indicators": [{"text": f"{contaminant} levels are manageable with proper treatment.", "citations": []}],
    }


# CORPUS-FIRST: Ask Gemini to answer FROM THE CORPUS ONLY
def ask_gemini_with_corpus(corpus_text: str, contaminant: str) -> Optional[Dict[str, Any]]:
    """
    Asks Gemini to return the required JSON using only the provided corpus text.
    If Gemini returns valid JSON, this is returned. Otherwise None.
    """
    # Keep corpus length in mind — if huge, consider truncation or summarization first
    prompt = f"""
You are given the following CORPUS. Use ONLY the corpus to answer. Do NOT hallucinate or invent papers.
Return ONLY JSON with keys: immediate_actions, long_term, positive_indicators.
Each entry should be an object {{ "id": "<optional id>", "text": "<explanation>", "supported_by": [] }}.
Contaminant: {contaminant}

Corpus:
{corpus_text}

Now produce the JSON (no extra commentary).
"""
    raw = call_gemini(prompt, max_output_tokens=1200)
    cleaned = extract_json_from_text(raw)
    if not cleaned:
        return None

    try:
        parsed = json.loads(cleaned)
        # Basic validation of structure
        if any(k in parsed for k in ["immediate_actions", "long_term", "positive_indicators"]):
            return parsed
    except Exception as e:
        print("[Corpus JSON parse error]", e)
    return None


# MERGE: prefer corpus result, fill with crossref
def merge_results(corpus_res: Optional[Dict[str, Any]], crossref_res: Dict[str, Any], papers_map: Dict[str, Any]):
    # If corpus_res exists, use it preferentially; else use crossref_res
    if not corpus_res:
        return crossref_res

    def fill(cat_name):
        out = []
        corpus_items = corpus_res.get(cat_name, []) if corpus_res else []
        cross_items = crossref_res.get(cat_name, []) if crossref_res else []

        # Use items from corpus first
        for it in corpus_items:
            # Attach citations if any id present and found in papers_map
            citations = []
            for pid in it.get("supported_by", []):
                if pid in papers_map:
                    citations.append(papers_map[pid])
            out.append({"text": it.get("text", ""), "citations": citations})

        # Fill up to 3 items using crossref if needed
        while len(out) < 3 and cross_items:
            candidate = cross_items.pop(0)
            # candidate expected to be like {"text": "...", "supported_by":[ids]}
            citations = []
            for pid in candidate.get("supported_by", []):
                if pid in papers_map:
                    citations.append(papers_map[pid])
            out.append({"text": candidate.get("text", ""), "citations": citations})

        # Ensure at least 1 fallback if empty
        if not out:
            out = [{"text": "No specific actions found from corpus or papers.", "citations": []}]

        return out

    return {
        "immediate_actions": fill("immediate_actions"),
        "long_term": fill("long_term"),
        "positive_indicators": fill("positive_indicators"),
    }


# MAIN PIPELINE (new merged flow)
async def get_suggestions(contaminant: str):
    # 1) Attempt corpus-first
    corpus_path = "dataset/metal_remove_corpus.txt"  # adjust if your actual path differs
    corpus_text = None
    try:
        with open(corpus_path, "r", encoding="utf-8") as f:
            corpus_text = f.read()
    except Exception as e:
        print("[Corpus read error]", e)
        corpus_text = None

    corpus_result = None
    if corpus_text:
        try:
            corpus_result = ask_gemini_with_corpus(corpus_text, contaminant)
        except Exception as e:
            print("[Corpus call error]", e)
            corpus_result = None

    # 2) If corpus provided a valid answer, still run CrossRef in background to get citations (but we won't block long)
    # For now run it synchronously to keep things simple and deterministic
    query = f"{contaminant} water contamination removal treatment adsorption remediation"
    papers = search_crossref_papers(query)
    if not papers:
        # If both failed, fallback
        if not corpus_result:
            return fallback(contaminant)
        # If corpus_result exists, return it (without citations)
        # convert corpus_result to desired output shape with empty citations
        def to_no_citations(cat):
            return [{"text": it.get("text",""), "citations": []} for it in corpus_result.get(cat,[])]
        return {
            "immediate_actions": to_no_citations("immediate_actions"),
            "long_term": to_no_citations("long_term"),
            "positive_indicators": to_no_citations("positive_indicators"),
        }

    # 3) Summarize papers
    summaries = []
    for p in papers:
        s = summarize_paper(p)
        if s:
            summaries.append(s)

    if not summaries:
        if not corpus_result:
            return fallback(contaminant)
        # return corpus-only (no citations)
        def to_no_citations(cat):
            return [{"text": it.get("text",""), "citations": []} for it in corpus_result.get(cat,[])]
        return {
            "immediate_actions": to_no_citations("immediate_actions"),
            "long_term": to_no_citations("long_term"),
            "positive_indicators": to_no_citations("positive_indicators"),
        }

    # 4) Generate suggestions from papers (crossref pipeline)
    suggestions = generate_suggestions(summaries, contaminant)
    if not suggestions:
        if not corpus_result:
            return fallback(contaminant)
        def to_no_citations(cat):
            return [{"text": it.get("text",""), "citations": []} for it in corpus_result.get(cat,[])]
        return {
            "immediate_actions": to_no_citations("immediate_actions"),
            "long_term": to_no_citations("long_term"),
            "positive_indicators": to_no_citations("positive_indicators"),
        }

    # 5) Build papers map for citation injection
    pmap = {p["id"]: p for p in papers}

    # 6) Inject citations into suggestions (crossref)
    crossref_with_citations = inject_citations(suggestions, pmap)

    # 7) Merge corpus_result and crossref_with_citations; prefer corpus
    merged = merge_results(corpus_result, crossref_with_citations, pmap)

    return merged


# ROUTE
@suggestionRouter.get("/user/analysis/suggestions")
async def api_suggestions(contaminant: str):
    """
    Returns:
    {
      immediate_actions: [{text, citations: [...]}, ...],
      long_term: [...],
      positive_indicators: [...]
    }
    """
    return await get_suggestions(contaminant)

@suggestionRouter.get("/user/analysis/corpus")
def analyse_contaminant_from_corpus(contaminant: str):
    from google import genai
    from dotenv import load_dotenv
    import os

    load_dotenv()

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    # load corpus
    with open("metal_remove_corpus.txt", "r", encoding="utf-8") as f:
        corpus = f.read()

    query = f"""
    Explain {contaminant} removal methods from the corpus only.
    Classify the methods into Immediate, Long-term, and Positive Indicators.
    Also cite the research paper mentioned in the corpus using citation format.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            {"text": f"Here is the corpus:\n\n{corpus}\n\nNow answer: {query}"}
        ]
    )

    return { "answer": response.text }
