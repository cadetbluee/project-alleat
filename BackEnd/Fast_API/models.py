from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import date
from sqlalchemy import Column, TEXT, INT, BIGINT, FLOAT
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class WeightRecord(BaseModel):
    date: str
    weight: float


class MenuRanking(BaseModel):
    carbohydrates: Optional[float] = None
    cost: float
    fats: Optional[float] = None
    proteins: Optional[float] = None
    menu_name: str
    restaurant_type: Optional[str] = None
    calories: float

class CostWhere(BaseModel):
    count: int
    restaurant_type: str

class WeekReportRequest(BaseModel):
    fat_ranking: List[MenuRanking]
    protein_ranking: List[MenuRanking]
    carb_ranking: List[MenuRanking]
    menu_kcal: List[MenuRanking]
    cost_ranking: List[MenuRanking]
    cost_where: List[CostWhere]
    protein_avg: float
    total_cost: float
    goal_cost: Optional[float] = None
    carb_avg: float
    goal_weight: Optional[float] = None
    kcal_average: float
    cost_avg: float
    current_weight: Optional[float] = None
    fat_avg: float

class FoodDetail(BaseModel):
    menu_fat: float
    menu_price: float
    menu_carbohydrate: float
    menu_protein: float
    menu_name: str
    restaurant_type: str
    menu_calories: float
    restaurant_name: str

class DayReportRequest(BaseModel):
    food_details: List[FoodDetail]
    goal_weight: Optional[float] = None  # 목표 체중
    goal_cost: Optional[int] = None      # 목표 식비
    recent_weight: Optional[float] = None  # 현재 체중

class MonthlyReportRequest(BaseModel):
    cost_avg: float
    total_cost: float
    restaurant_type_count: Dict[str, int]
    monthly_cost_records: List[float]
    average_calories: float
    monthly_weight_records: List[WeightRecord]
    kcal_ranking: List[MenuRanking]
    cost_ranking: List[MenuRanking]

class FoodInfo(Base):
    __tablename__ = "food_info"

    id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    menu_name = Column(TEXT, nullable=False)
    menu_weight = Column(FLOAT, nullable=False)
    menu_calories = Column(FLOAT, nullable=False)
    menu_carbohydrate = Column(FLOAT, nullable=False)
    menu_protein = Column(FLOAT, nullable=False)
    menu_fat = Column(FLOAT, nullable=False)
    