"""
Chat router: AI fitness coaching chat with session history.
"""

import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fitness import ChatHistory
from app.models.user import User
from app.services.ai_service import CHAT_SYSTEM_PROMPT_TEMPLATE, chat_response
from app.utils.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None   # if None, a new session is created


class ChatMessageResponse(BaseModel):
    session_id: str
    user_message: str
    assistant_reply: str
    created_at: datetime


class ChatHistoryResponse(BaseModel):
    session_id: str
    messages: List[Dict[str, str]]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _build_system_prompt(user: Optional[User]) -> str:
    if user and user.profile:
        p = user.profile
        profile_parts = [
            f"Name: {user.name}",
            f"Age: {p.age or 'unknown'}",
            f"Gender: {p.gender or 'unknown'}",
            f"Weight: {p.weight_kg or 'unknown'} kg",
            f"Height: {p.height_cm or 'unknown'} cm",
            f"Goal: {p.fitness_goal or 'unknown'}",
            f"Diet: {p.diet_type or 'unknown'}",
            f"Activity: {p.activity_level or 'unknown'}",
        ]
    elif user:
        profile_parts = [f"Name: {user.name}"]
    else:
        profile_parts = ["Name: Guest Athlete (Guest Mode, full feature access)"]

    profile_str = ", ".join(profile_parts)
    return CHAT_SYSTEM_PROMPT_TEMPLATE.format(profile=profile_str)


def _get_or_create_session(db: Session, user_id: int, session_id: Optional[str]) -> ChatHistory:
    if session_id:
        history = db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id,
            ChatHistory.session_id == session_id,
        ).first()
        if history:
            return history

    # Create a new session
    new_session_id = session_id or str(uuid.uuid4())
    history = ChatHistory(user_id=user_id, session_id=new_session_id, messages_json="[]")
    db.add(history)
    db.flush()
    return history


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/message", response_model=ChatMessageResponse, status_code=status.HTTP_200_OK)
def send_message(
    payload: ChatMessageRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a chat message and receive an AI response.
    Full access supported for both guest visitors and registered users.
    """
    session_id = payload.session_id or str(uuid.uuid4())
    messages: List[Dict[str, str]] = []

    if current_user:
        history = _get_or_create_session(db, current_user.id, session_id)
        messages = json.loads(history.messages_json)
        messages.append({"role": "user", "content": payload.message})
        system_prompt = _build_system_prompt(current_user)
        reply = chat_response(messages, system_prompt)
        messages.append({"role": "assistant", "content": reply})
        history.messages_json = json.dumps(messages[-50:])
        db.commit()
        db.refresh(history)
        created_at = history.created_at
    else:
        # Unrestricted Guest Mode
        messages.append({"role": "user", "content": payload.message})
        system_prompt = _build_system_prompt(None)
        reply = chat_response(messages, system_prompt)
        created_at = datetime.utcnow()

    return ChatMessageResponse(
        session_id=session_id,
        user_message=payload.message,
        assistant_reply=reply,
        created_at=created_at,
    )


@router.get("/history/{session_id}", response_model=ChatHistoryResponse)
def get_history(
    session_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve the full message history for a chat session."""
    if not current_user:
        return ChatHistoryResponse(
            session_id=session_id,
            messages=[],
            created_at=datetime.utcnow(),
        )

    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id,
        ChatHistory.session_id == session_id,
    ).first()
    if not history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found.")

    return ChatHistoryResponse(
        session_id=history.session_id,
        messages=json.loads(history.messages_json),
        created_at=history.created_at,
    )


@router.delete("/history/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(
    session_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Delete all messages in a chat session."""
    if not current_user:
        return

    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id,
        ChatHistory.session_id == session_id,
    ).first()
    if not history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found.")

    db.delete(history)
    db.commit()
