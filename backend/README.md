### Agent 5: Policy Recommendation Agent 
```
                USER
                  │
                  ▼
        FastAPI Endpoint
                  │
                  ▼
      Receive contaminant
      Receive HMPI
      Receive Risk
                  │
                  ▼
     ┌──────────────────────┐
     │ Local Corpus Search  │
     └──────────────────────┘
                  │
                  ▼
     ┌──────────────────────┐
     │ Tavily Search        │
     └──────────────────────┘
                  │
                  ▼
     ┌──────────────────────┐
     │ arXiv Search         │
     └──────────────────────┘
                  │
                  ▼
      Merge Retrieved Context
                  │
                  ▼
      Add Risk Information
                  │
                  ▼
      Build Gemini Prompt
                  │
                  ▼
       Gemini Flash Lite
                  │
                  ▼
      Structured JSON Output
                  │
                  ▼
            FastAPI Response
```