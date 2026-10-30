"""
Users router: profile management, account operations.
"""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserProfile
from app.utils.auth import get_current_user, get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class UserProfileSchema(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = None
    fitness_goal: Optional[str] = None
    diet_type: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    available_equipment: Optional[str] = None

    model_config = {"from_attributes": True}


class UserUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileSchema] = None

    model_config = {"from_attributes": True}


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return the authenticated user along with their fitness profile."""
    db.refresh(current_user)
    return current_user


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UserUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update name, email, or password for the authenticated user."""
    if payload.name:
        current_user.name = payload.name
    if payload.email:
        # check uniqueness
        conflict = db.query(User).filter(User.email == payload.email, User.id != current_user.id).first()
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use.")
        current_user.email = payload.email
    if payload.password:
        if len(payload.password) < 6:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Password too short.")
        current_user.hashed_password = get_password_hash(payload.password)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/profile", response_model=UserProfileSchema)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return the fitness profile of the authenticated user."""
    if not current_user.profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found. Please create one.")
    return current_user.profile


@router.put("/me/profile", response_model=UserProfileSchema)
def upsert_profile(
    payload: UserProfileSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or update the fitness profile for the authenticated user."""
    profile = current_user.profile
    if profile is None:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    profile.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(profile)
    return profile


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Permanently delete the authenticated user's account and all related data."""
    db.delete(current_user)
    db.commit()
