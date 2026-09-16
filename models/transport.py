from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from db.base import Base
class Transport(Base):
    __tablename__ = "transports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False, default="")
    # draft / published / deleted
    status = Column(String(20), nullable=False, default="draft", index=True)

    image_url = Column(String(500), nullable=False, default="")
    video_url = Column(String(500), nullable=False, default="")

    speed_kmh = Column(Integer, nullable=False, default=0)
    price_per_km = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)

    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    likes = Column(Integer, nullable=False, default=0)