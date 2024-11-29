from fastapi import Request, HTTPException
from packages.dependencies import decode_jwt

async def jwt_filter(request: Request, call_next):
    auth_header = request.headers.get("Authorization")
    if auth_header is None or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header is missing or invalid")
    
    token = auth_header.split(" ")[1]  # 'Bearer' 부분을 제외하고 토큰만 추출
    try:
        decode_jwt(token=token)  # 토큰 디코딩
    except HTTPException as e:
        raise e
    
    response = await call_next(request)
    return response
