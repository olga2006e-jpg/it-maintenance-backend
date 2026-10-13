from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from db.base import Base


class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (
        UniqueConstraint("user_id", "maintenance_id", name="uq_user_maintenance_like"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    maintenance_id = Column(Integer, ForeignKey("maintenances.id"), nullable=False)