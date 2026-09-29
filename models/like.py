from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from db.base import Base


class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (
        UniqueConstraint("user_id", "transport_id", name="uq_user_transport_like"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transport_id = Column(Integer, ForeignKey("transports.id"), nullable=False)