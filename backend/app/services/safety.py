from datetime import datetime, timedelta
from sqlalchemy import select, func
from app.models.models import ConnectionRequest, RequestStatus
from app.core.config import settings

async def can_send_request(db, sender_id: str, receiver_id: str) -> tuple[bool, str]:
    existing = await db.execute(
        select(ConnectionRequest).where(
            ConnectionRequest.sender_id == sender_id,
            ConnectionRequest.receiver_id == receiver_id
        )
    )
    if existing.scalar_one_or_none():
        return False, "You already sent a request to this person before."

    start_of_day = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    count_result = await db.execute(
        select(func.count(ConnectionRequest.id)).where(
            ConnectionRequest.sender_id == sender_id,
            ConnectionRequest.created_at >= start_of_day
        )
    )
    daily_count = count_result.scalar() or 0
    if daily_count >= settings.DAILY_REQUEST_LIMIT:
        return False, "Daily request limit reached."

    return True, "OK"

def expiry_time():
    return datetime.utcnow() + timedelta(hours=settings.REQUEST_EXPIRY_HOURS)