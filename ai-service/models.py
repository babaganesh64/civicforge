from pydantic import BaseModel
from typing import List, Dict, Any

class AnalysisRequest(BaseModel):
    challenge_id: str
    title: str
    description: str

class AnalysisResponse(BaseModel):
    suggested_category: str
    suggested_priority: str
    summary: str
    tags: List[str]
    similarity_candidates: List[Dict[str, Any]]
    suggested_organizations: List[str]
    explanation: str
    confidence_score: float
    model_id: str
    model_version: str
