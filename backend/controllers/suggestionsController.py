from fastapi import APIRouter
import requests
import json
import os
from dotenv import load_dotenv
from google import genai
import time

load_dotenv()
SS_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

# 1) SEARCH PAPERS
def search_papers(query, limit=5):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": query,
        "limit": limit,
        "fields": "title,authors,year,abstract,doi,url"
    }
    headers = {"x-api-key": SS_KEY}

    resp = requests.get(url, params=params, headers=headers, timeout=8)
    return resp.json().get("data", [])


# 2) BUILD CORPUS
def build_corpus(papers):
    corpus = []
    for p in papers:
        paper_id = p.get("paperId")
        doi = p.get("doi")

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


# 3) QUERY GEMINI
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
You MUST return ONLY pure JSON.
DO NOT output any prose, explanation, or text before/after the JSON.

Return EXACTLY this structure:

{{
  "immediate_actions": [{{"text": "", "citations": []}}],
  "long_term": [{{"text": "", "citations": []}}],
  "positive_indicators": [{{"text": "", "citations": []}}]
}}

QUESTION: {question}

DOCUMENTS:
{context}
"""

    try:
        resp = client.responses.create(
            model="gemini-2.5-flash",
            input=prompt,
            max_output_tokens=700
        )
    except Exception as e:
        print("Gemini error:", e)
        return json.dumps({
            "immediate_actions": [],
            "long_term": [],
            "positive_indicators": []
        })

    # Extract raw text
    text = resp.output_text.strip()

    # Extract JSON safely
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        return "{}"

    return text[start:end+1]


# 4) FULL PIPELINE
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

    # 1) Get papers
    papers = search_papers(research_query, limit=5)
    corpus = build_corpus(papers)

    # 2) Build question
    question = f"""
Water quality is poor due to {contaminant}.
Based ONLY on these papers, generate suggestions with citations.
"""

    # 3) Ask Gemini
    raw_output = ask_gemini(question, corpus)

    # 4) Try parsing JSON
    try:
        return json.loads(raw_output)
    except Exception as e:
        print("JSON parse error:", e)
        return {
            "immediate_actions": [],
            "long_term": [],
            "positive_indicators": []
        }


# FASTAPI ROUTE
suggestionRouter = APIRouter()

@suggestionRouter.get("/user/analysis/suggestions")
async def suggestions(contaminant: str):
    return await get_suggestions_from_report(contaminant)
