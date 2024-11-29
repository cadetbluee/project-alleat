import openai
import logging  # 추가된 부분
# from models import GPTRequest, DayDiaryRequest, WeekDiaryRequest, MonthDiaryRequest
from fastapi import APIRouter, HTTPException
from models import DayReportRequest, WeekReportRequest, MonthlyReportRequest
# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/day")
async def get_day_summary(request: DayReportRequest):
    # print(request)
    try:
        # 총 영양소 및 비용 계산
        total_carbohydrates = sum(detail.menu_carbohydrate for detail in request.food_details)
        total_proteins = sum(detail.menu_protein for detail in request.food_details)
        total_fats = sum(detail.menu_fat for detail in request.food_details)
        total_calories = sum(detail.menu_calories for detail in request.food_details)
        total_cost = sum(detail.menu_price for detail in request.food_details)
        
        # 프롬프트 생성
        base_prompt = f"""
        너는 유능한 영양학자이자 재무 분석관이야. 
        내가 제공할 일간 식단과 식비 데이터를 보고, 영양과 비용 효율성을 고려해 100자 이내로 간단한 총평을 작성해줘.
        오늘의 총 섭취한 탄수화물은 {total_carbohydrates}g, 단백질은 {total_proteins}g, 지방은 {total_fats}g이며,
        총 섭취한 칼로리는 {total_calories}kcal이고, 오늘 소비한 총 비용은 {total_cost}원이야.
        목표 체중은 {request.goal_weight}kg이고, 목표 식비는 한 달에 {request.goal_cost}원이며, 현재 체중은 {request.recent_weight}kg이야.
        말투는 ~요로 끝나게끔 해주고 친근한 말투로 부탁해.
        """

        # OpenAI GPT 모델 호출
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": base_prompt},
            ],
        )
        
        return {"response": response.choices[0].message['content']}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/week")
async def get_week_summary(request: WeekReportRequest):
    # print(request)
    try:
        # 프롬프트 생성
        base_prompt = f"""
        너는 유능한 영양학자이자 재무 분석관이야. 
        내가 제공할 주간 식단과 식비 데이터를 보고, 영양과 비용 효율성을 고려해 100자 이내로 간단한 총평을 작성해줘.
        
        이번 주의 목표 체중은 {request.goal_weight}kg이고, 현재 체중은 {request.current_weight}kg이야.
        주간 평균 섭취 칼로리는 {request.kcal_average}kcal, 탄수화물은 {request.carb_avg}g, 단백질은 {request.protein_avg}g, 지방은 {request.fat_avg}g이야.
        총 사용한 식비는 {request.total_cost}원이고, 목표 식비는 {request.goal_cost}원이야.
        
        가장 많이 섭취한 레스토랑 유형은 다음과 같아:
        {', '.join([f'{item.restaurant_type}: {item.count}회' for item in request.cost_where])}.
        
        이 메뉴들은 다음과 같아:
        {', '.join([f"{item.menu_name} (칼로리: {item.calories}kcal, 탄수화물: {item.carbohydrates}g, 단백질: {item.proteins}g, 지방: {item.fats}g)" for item in request.menu_kcal])}
        
        총평을 작성해줘.
        """

        # OpenAI GPT 모델 호출
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": base_prompt},
            ],
        )

        return {"response": response.choices[0].message['content']}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/month")
async def get_month_summary(request: MonthlyReportRequest):
    # print(request)
    try:
        # 가장 많이 사용한 레스토랑 유형 찾기
        most_used_restaurant_type = max(request.restaurant_type_count, key=request.restaurant_type_count.get)
        restaurant_type_translation = {
            "DELIVERY": "배달",
            "RESTAURANTS": "외식",
            "HOME": "집밥",
            "MART": "장보기"
        }
        most_used_type_kor = restaurant_type_translation.get(most_used_restaurant_type, "알 수 없음")

        # 월간 비용 내역 중 가장 많이 사용한 날 찾기
        max_cost = max(request.monthly_cost_records)
        max_cost_day = request.monthly_cost_records.index(max_cost) + 1 if max_cost > 0 else "없음"

        # 체중 변화 추이 분석
        initial_weight = request.monthly_weight_records[0].weight if request.monthly_weight_records else None
        final_weight = request.monthly_weight_records[-1].weight if request.monthly_weight_records else None
        weight_change = None
        if initial_weight is not None and final_weight is not None:
            weight_change = final_weight - initial_weight

        # 프롬프트 생성
        base_prompt = f"""
        너는 유능한 영양학자이자 재무 분석관이야.
        내가 제공할 월간 식단과 식비 데이터를 보고, 영양과 비용 효율성을 고려해 100자 이내로 간단한 총평을 작성해줘.

        이번 달에 가장 많이 이용한 식사 유형은 '{most_used_type_kor}'(으)로, 총 {request.restaurant_type_count[most_used_restaurant_type]}번 이용했어.
        {'배달이나 외식이 너무 많으면 돈을 아껴보자고 조언해줘.' if most_used_type_kor in ['배달', '외식'] else '건강한 식습관을 유지하고 있네, 잘했어!'}

        한 달 동안 가장 많은 비용을 지출한 날은 {max_cost_day}일이며, 총 {int(max_cost)}원을 썼어. 이 날은 지출을 조절할 필요가 있었어.

        체중 변화는 {initial_weight}kg에서 {final_weight}kg로, 총 {weight_change}kg 변화했어.
        {'체중이 늘었으니 조금 더 식단 관리를 해보자!' if weight_change and weight_change > 0 else '체중이 줄었으니 잘 관리하고 있어!'}

        말투는 ~요로 끝나게끔 해주고 친근한 말투로 부탁해.
        """

        # OpenAI GPT 모델 호출
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": base_prompt},
            ],
        )

        return {"response": response.choices[0].message['content']}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))