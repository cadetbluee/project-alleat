import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from middlewares import jwt_filter
from routers import report  # report 라우터를 import
from routers import imagepercieve

# .env 파일 로드
load_dotenv()

app = FastAPI()

# CORS 설정
origins = [
    os.getenv("TEST_LOCAL"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# JWT 토큰 검증 미들웨어 적용
app.middleware("http")(jwt_filter)

# report 관련 라우터 등록
app.include_router(report.router, prefix="/fast-api/report")
app.include_router(imagepercieve.router, prefix="/fast-api/image")

# FastAPI 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
