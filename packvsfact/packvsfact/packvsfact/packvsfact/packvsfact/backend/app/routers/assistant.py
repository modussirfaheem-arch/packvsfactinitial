"""
Local AI Assistant Router (PACKVSFACT)
Provides multilingual AI food assistance without external paid APIs.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.services.assistant_service import AssistantService

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])

class AssistantQuerySchema(BaseModel):
    query: str
    lang: Optional[str] = "en"
    product_context: Optional[Dict[str, Any]] = None

@router.post("/ask")
def ask_assistant(payload: AssistantQuerySchema):
    if not payload.query or len(payload.query.strip()) < 2:
        return {
            "query": payload.query,
            "answer": "Please enter a valid question regarding food nutrition, Nutri-Score, NOVA groups, or healthier alternatives."
        }

    res = AssistantService.answer_query(
        query=payload.query,
        lang=payload.lang or "en",
        product_context=payload.product_context
    )
    return res

@router.get("/languages")
def get_supported_languages():
    return {"languages": AssistantService.SUPPORTED_LANGUAGES}
