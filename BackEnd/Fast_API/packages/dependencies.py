import os
import jwt
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
jwt_key = os.environ.get("JWT_KEY")
jwt_algorithm = os.environ.get("JWT_ALGORITHM")

def decode_jwt(token: str):
    try:
        # 토큰을 bytes로 인코딩
        payload = jwt.decode(token, jwt_key, algorithms=[jwt_algorithm])
        user_id: str = payload.get("userid")
        return user_id
    
    except jwt.PyJWTError as e:
        print(e)
        raise HTTPException(status_code=401, detail=f"Error occurred while decoding: {str(e)}")
