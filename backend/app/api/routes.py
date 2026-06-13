import uuid
from sqlalchemy import select, text
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.schemas import LocationUpdate, NearbyProfile, SendRequest, FullProfile
from app.models.models import User, UserLocation, ConnectionRequest, RequestStatus
from app.services.safety import can_send_request, expiry_time
from app.core.config import settings

router = APIRouter()

# MVP auth placeholder.
# Replace this with Firebase/Supabase/JWT auth before production.
async def current_user_id(x_user_id: str = Header(...)):
    return x_user_id

@router.get("/health")
async def health():
    return {"status": "ok"}

@router.post("/location")
async def update_location(
    payload: LocationUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(current_user_id),
):
    point_sql = text("ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography")
    existing = await db.get(UserLocation, user_id)

    if existing:
        existing.latitude = payload.latitude
        existing.longitude = payload.longitude
        existing.point = point_sql.bindparams(lng=payload.longitude, lat=payload.latitude)
    else:
        db.add(UserLocation(
            user_id=user_id,
            latitude=payload.latitude,
            longitude=payload.longitude,
            point=point_sql.bindparams(lng=payload.longitude, lat=payload.latitude)
        ))

    await db.commit()
    return {"message": "location_updated"}

@router.get("/nearby", response_model=list[NearbyProfile])
async def nearby(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(current_user_id),
):
    me = await db.get(UserLocation, user_id)
    if not me:
        raise HTTPException(status_code=400, detail="Update your location first.")

    query = text("""
        SELECT u.id AS user_id, u.profile_photo_url
        FROM users u
        JOIN user_locations ul ON ul.user_id = u.id
        WHERE u.id != :user_id
          AND u.discovery_enabled = true
          AND ST_DWithin(
              ul.point,
              ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
              :radius
          )
          AND NOT EXISTS (
              SELECT 1 FROM blocked_users b
              WHERE (b.blocker_id = :user_id AND b.blocked_id = u.id)
                 OR (b.blocker_id = u.id AND b.blocked_id = :user_id)
          )
        LIMIT 50
    """)
    result = await db.execute(query, {
        "user_id": user_id,
        "lng": me.longitude,
        "lat": me.latitude,
        "radius": settings.LOCATION_RADIUS_METERS,
    })

    return [
        NearbyProfile(user_id=row.user_id, profile_photo_url=row.profile_photo_url)
        for row in result
    ]

@router.post("/requests")
async def send_request(
    payload: SendRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(current_user_id),
):
    allowed, reason = await can_send_request(db, user_id, payload.receiver_id)
    if not allowed:
        raise HTTPException(status_code=403, detail=reason)

    request = ConnectionRequest(
        id=str(uuid.uuid4()),
        sender_id=user_id,
        receiver_id=payload.receiver_id,
        note=payload.note,
        status=RequestStatus.pending,
        expires_at=expiry_time(),
    )
    db.add(request)
    await db.commit()
    return {"message": "request_sent", "expires_in_hours": settings.REQUEST_EXPIRY_HOURS}

@router.get("/requests/incoming")
async def incoming_requests(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(current_user_id),
):
    # Receiver can see complete sender profile before accepting.
    query = select(ConnectionRequest, User).join(
        User, User.id == ConnectionRequest.sender_id
    ).where(
        ConnectionRequest.receiver_id == user_id,
        ConnectionRequest.status == RequestStatus.pending
    )
    result = await db.execute(query)
    data = []
    for req, sender in result.all():
        data.append({
            "request_id": req.id,
            "note": req.note,
            "expires_at": req.expires_at,
            "sender": {
                "user_id": sender.id,
                "full_name": sender.full_name,
                "bio": sender.bio,
                "profile_photo_url": sender.profile_photo_url,
                "verified": sender.verified,
            }
        })
    return data

@router.post("/requests/{request_id}/accept")
async def accept_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(current_user_id),
):
    req = await db.get(ConnectionRequest, request_id)
    if not req or req.receiver_id != user_id:
        raise HTTPException(status_code=404, detail="Request not found.")
    req.status = RequestStatus.accepted
    await db.commit()
    return {"message": "accepted", "chat_unlocked": True}

@router.post("/requests/{request_id}/reject")
async def reject_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(current_user_id),
):
    req = await db.get(ConnectionRequest, request_id)
    if not req or req.receiver_id != user_id:
        raise HTTPException(status_code=404, detail="Request not found.")
    req.status = RequestStatus.rejected
    await db.commit()
    return {"message": "rejected"}