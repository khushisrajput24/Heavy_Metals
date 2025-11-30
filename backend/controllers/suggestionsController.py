from fastapi import APIRouter
import requests
import time
import json
import re
from typing import List, Dict, Any
from google import genai
import os

# Load Gemini key
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

suggestionRouter = APIRouter()

# FAST MODE — 6 PAPERS
PAPERS_LIMIT = 6

# JSON CLEANER

def extract_json_from_text(raw: str):
    if not raw:
        return None
    raw = re.sub(r"```.*?```", "", raw, flags=re.DOTALL)
    raw = raw.replace("`", "").strip()
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1:
        return None
    return raw[start:end+1]

# GEMINI CALL (Correct version)

def call_gemini(prompt: str):
    
    client = genai.Client(api_key=GEMINI_KEY)

    for _ in range(2):  # retry once
        try:
            resp = client.models.generate(
                model="gemini-1.5-flash",
                prompt=prompt,
                max_output_tokens=1000,
            )
            text = resp.text
            if text and "{" in text:
                return text
        except Exception as e:
            print("[Gemini Error]", e)
        time.sleep(0.4)

    return ""

# CROSSREF PAPER SEARCH

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
    except:
        return None

# GENERATE SUGGESTIONS

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
    except:
        return None

# INJECT CITATIONS

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

# FALLBACK

def fallback(contaminant):
    return {
        "immediate_actions": [{"text": f"Reduce {contaminant} exposure immediately.", "citations": []}],
        "long_term": [{"text": f"Monitor {contaminant} in water regularly.", "citations": []}],
        "positive_indicators": [{"text": f"{contaminant} levels are manageable with proper treatment.", "citations": []}],
    }

# MAIN PIPELINE

async def get_suggestions(contaminant: str):
    query = f"{contaminant} water contamination removal treatment adsorption remediation"

    papers = search_crossref_papers(query)
    if not papers:
        return fallback(contaminant)

    summaries = []
    for p in papers:
        s = summarize_paper(p)
        if s:
            summaries.append(s)

    if not summaries:
        return fallback(contaminant)

    suggestions = generate_suggestions(summaries, contaminant)
    if not suggestions:
        return fallback(contaminant)

    pmap = {p["id"]: p for p in papers}

    return inject_citations(suggestions, pmap)

# ROUTE

@suggestionRouter.get("/user/analysis/suggestions")
async def api_suggestions(contaminant: str):
    return await get_suggestions(contaminant)
