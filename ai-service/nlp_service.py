import logging
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

logger = logging.getLogger(__name__)

class CivicForgeNLP:
    def __init__(self):
        self.model_name = 'sentence-transformers/all-MiniLM-L6-v2'
        try:
            self.model = SentenceTransformer(self.model_name)
            self.model_loaded = True
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.model_loaded = False
        
        self.categories = [
            "Infrastructure", "Health", "Education", 
            "Environment", "Safety", "Agriculture", "Transportation"
        ]
        
        if self.model_loaded:
            self.category_embeddings = self.model.encode(self.categories)
        else:
            self.category_embeddings = None

    def analyze(self, title: str, description: str) -> dict:
        text = f"{title}. {description}"
        
        suggested_category = "Unknown"
        confidence_score = 0.0
        
        if self.model_loaded and self.category_embeddings is not None:
            text_embedding = self.model.encode([text])
            similarities = cosine_similarity(text_embedding, self.category_embeddings)[0]
            best_idx = int(np.argmax(similarities))
            suggested_category = self.categories[best_idx]
            confidence_score = float(similarities[best_idx])
            
        lower_text = text.lower()
        urgent_keywords = ["emergency", "death", "severe", "immediate", "urgent", "danger", "hazard"]
        
        suggested_priority = "MEDIUM"
        if any(kw in lower_text for kw in urgent_keywords):
            suggested_priority = "CRITICAL" if "death" in lower_text or "emergency" in lower_text else "HIGH"
            
        sentences = [s.strip() for s in description.split('.') if s.strip()]
        summary = '. '.join(sentences[:2])
        if summary and not summary.endswith('.'):
            summary += '.'
            
        return {
            "suggested_category": suggested_category,
            "suggested_priority": suggested_priority,
            "summary": summary,
            "tags": [],
            "similarity_candidates": [],
            "suggested_organizations": [],
            "explanation": "Category assigned based on cosine similarity to predefined categories. Priority and summary based on simple heuristics.",
            "confidence_score": confidence_score,
            "model_id": self.model_name if self.model_loaded else "rule-based-fallback",
            "model_version": "v1.0"
        }
