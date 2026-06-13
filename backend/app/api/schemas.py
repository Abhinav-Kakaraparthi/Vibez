from pydantic import BaseModel, Field
from typing import Optional

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

class NearbyProfile(BaseModel):
    user_id: str
    profile_photo_url: str
    status: str = "nearby_now"

class SendRequest(BaseModel):
    receiver_id: str
    note: Optional[str] = Field(default=None, max_length=100)

class FullProfile(BaseModel):
    user_id: str
    full_name: str
    bio: Optional[str]
    profile_photo_url: str
    verified: bool