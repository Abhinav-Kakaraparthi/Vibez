import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Enum, ForeignKey, Integer, Float, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship
from geoalchemy2 import Geography

Base = declarative_base()

class RequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    expired = "expired"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    phone_or_email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    bio = Column(String, nullable=True)
    profile_photo_url = Column(String, nullable=False)
    verified = Column(Boolean, default=False)
    discovery_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserLocation(Base):
    __tablename__ = "user_locations"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    point = Column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)

class ConnectionRequest(Base):
    __tablename__ = "connection_requests"

    id = Column(String, primary_key=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
    note = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    __table_args__ = (
        UniqueConstraint("sender_id", "receiver_id", name="one_request_per_pair"),
    )

class BlockedUser(Base):
    __tablename__ = "blocked_users"

    id = Column(String, primary_key=True)
    blocker_id = Column(String, ForeignKey("users.id"), nullable=False)
    blocked_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True)
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False)
    reported_id = Column(String, ForeignKey("users.id"), nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)