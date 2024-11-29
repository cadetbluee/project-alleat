from ultralytics import YOLO

import cv2
import torch
import uuid
import os

# 양 추정 AI에 보낼 크롭된 이미지 - 변경 필요할수도

def percieve(filename) :
    randomize_uuid = str(uuid.uuid4())
    output_folder = 'images/prediction/'+randomize_uuid
    
    os.makedirs(output_folder, exist_ok=True)

    # wiehgt를 포함한 모델 불러오기(path 수정 필요할수도)
    model = YOLO('weights/best.pt')

    image_path = f"images/upload/{filename}"
    img = cv2.imread(image_path)

    # 객체 탐지
    results = model(img)

    # 탐지된 객체의 좌표 및 클래스 정보 가져오기
    cnt = 0
    
    for i, r in enumerate(results):
        # 객체 탐지 결과를 가져오기
        boxes = r.boxes  # 바운딩 박스 정보
        for box in boxes:
            # box.xyxy는 바운딩 박스 좌표 [x1, y1, x2, y2]
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            
            # confidence score 및 class
            conf = box.conf.item()  # confidence score
            cls = box.cls.item()    # class index
            
            # 바운딩 박스 크롭
            cropped_img = img[y1:y2, x1:x2]

            # 신뢰도가 0.6 이상일 때 크롭된 이미지 저장
            print(conf,cls)
            if conf>0.6 :
                cropped_img_path = f'{output_folder}/{r.names.get(cls)}.jpg'
                cv2.imwrite(cropped_img_path, cropped_img)
                cnt+=1
                
    if cnt > 0 :
        return randomize_uuid 
    else : 
        return False