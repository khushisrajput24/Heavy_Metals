from google import genai
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import os, json

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
suggestionRouter = APIRouter()

# Load corpus once only
with open("dataset/metal_remove_corpus.txt", "r", encoding="utf-8") as f:
    METAL_CORPUS = f.read()

QUERIES = {
    "arsenic": "Explain arsenic removal methods from the corpus only. Classify them into Immediate actions, Long-term methods and Positive indicators. Also extract the research paper citations.",
    "lead": "Explain lead removal methods from the corpus only. Classify them into Immediate actions, Long-term methods and Positive indicators. Also extract the research paper citations.",
    "cadmium": "Explain cadmium removal methods from the corpus only. Classify them into Immediate actions, Long-term methods and Positive indicators. Also extract the research paper citations.",
    "mercury": "Explain mercury removal methods from the corpus only. Classify them into Immediate actions, Long-term methods and Positive indicators. Also extract the research paper citations.",
    "nickel": "Explain nickel removal methods from the corpus only. Classify them into Immediate actions, Long-term methods and Positive indicators. Also extract the research paper citations.",
}


@suggestionRouter.get("/user/analysis/suggestions")
async def api_suggestions(contaminant: str):

    if contaminant not in QUERIES:
        raise HTTPException(status_code=400, detail="Unsupported contaminant")

    query = QUERIES[contaminant]

    prompt = f"""
  You are a strict corpus-based QA system.
  Extract ONLY from the corpus text below. Do NOT create any information that is not present.

  CORPUS:
  {METAL_CORPUS}

  QUESTION:
  {query}

  You MUST follow these rules:
  - Do not hallucinate any citations.
  - If NO citation exists in the corpus for a specific point, return an empty list [] for citations.
  - Every item in immediate_actions, long_term, and positive_indicators must contain:
      - "text": extracted method/indicator
      - "citations": list of papers strictly pulled from corpus (title, doi, url if available)

  RETURN ONLY THIS EXACT JSON (NO MARKDOWN):

  {{
    "immediate_actions": [
      {{
        "text": "some method",
        "citations": [
          {{
            "title": "paper title",
            "doi": "doi if present",
            "url": "url if present"
          }}
        ]
      }}
    ],
    "long_term": [
      {{
        "text": "some long-term method",
        "citations": []
      }}
    ],
    "positive_indicators": [
      {{
        "text": "indicator text",
        "citations": []
      }}
    ]
  }}
  """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[{"text": prompt}]
    )

    raw = response.text.strip()

    # Gemini sometimes adds ```json or other wrapping — clean it.
    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid JSON. Check corpus formatting."
        )

    return parsed
