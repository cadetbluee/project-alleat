
import logging  # 추가된 부분
# from models import GPTRequest, DayDiaryRequest, WeekDiaryRequest, MonthDiaryRequest
from fastapi import APIRouter, HTTPException, File, UploadFile 
from models import FoodInfo
from pydantic import BaseModel
from database import engineconn
import uuid
import os
from packages.food_quantity import quantity
from packages.food_percieve import percieve
import json


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

engine = engineconn()
session = engine.sessionmaker()
 
# 정상작동 확인용 api - DB에 있는 음식 정보반환
@router.get("/test/")
async def test():
    try:

        example = session.query(FoodInfo).all()
        return example
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("")
async def image_percieve(file: UploadFile):
    try:
        if not file:
            return {"message": "No upload file sent"}
        
        upload_dir = "images/upload"  # 이미지를 저장할 경로
        os.makedirs(upload_dir, exist_ok=True)
        content = await file.read()
        filename = f"{str(uuid.uuid4())}.jpg" 
        
        with open(os.path.join(upload_dir, filename), "wb") as fp:
            fp.write(content)  
        
        # 이미지를 yolov모델을 통해 인식하고, 크롭된 이미지들을 인식된 uuid/클래스명.jpg로 저장
        saved_folder = percieve(filename)

        if not saved_folder :
            return {"message" : "음식이 인식되지 않았습니다."}
        
        # uuid 폴더안에 있는 각 음식에 대한 음식모델에 대해 {음식이름-넘버링 : 양추정}
        # 형태의 result를 반환(하게하도록 food_quantity수정)
        quantity_result = quantity(saved_folder)

        # DB에서 음식이름 에 해당하는 어찌구 긁어옴
        
        with open('foodmapping.json', 'r') as f:    
            mapping_dict = json.load(f)

        return_dict = {"foods":[]}
        for ele in quantity_result : 
            if ele in mapping_dict : 
                food_name = mapping_dict[ele]
                return_dict["foods"].append(food_name)
                # food_name이 일치하는 엔티티 DB에서 가져오기 
                food_info = session.query(FoodInfo).filter(FoodInfo.menu_name.like(food_name)).all()
                if len(food_info) > 0 :
                    actual_result = {"menu_weight" : food_info[0].menu_weight * quantity_result[ele],
                                    "menu_calories" : food_info[0].menu_calories * quantity_result[ele],
                                    "menu_carbohydrate" : food_info[0].menu_carbohydrate * quantity_result[ele],
                                    "menu_protein" : food_info[0].menu_protein * quantity_result[ele],
                                    "menu_fat" : food_info[0].menu_fat * quantity_result[ele],
                                 }
                return_dict[food_name] = actual_result     
                if (food_name == "동그랑땡") : 
                    return_dict["foods"].append("케첩")   
                    capt = {"menu_weight" : 50,
                                 "menu_calories" : 111,
                                 "menu_carbohydrate" : 13,
                                 "menu_protein" : 0.65,
                                 "menu_fat" : 0.1,
                                 }
                    return_dict["케첩"] = capt
                    
        return return_dict

        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
