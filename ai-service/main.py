from fastapi import FastAPI
from models import AnalysisRequest, AnalysisResponse
from nlp_service import CivicForgeNLP

app = FastAPI(title="CivicForge AI Service")
nlp = CivicForgeNLP()

@app.get("/health")
def health():
    return {
        "status": "ok", 
        "model": "loaded" if nlp.model_loaded else "fallback"
    }

@app.post("/api/v1/analyze", response_model=AnalysisResponse)
def analyze_challenge(request: AnalysisRequest):
    result = nlp.analyze(request.title, request.description)
    return result
