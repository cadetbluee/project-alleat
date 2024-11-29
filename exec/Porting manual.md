# AllEat Porting Manual
이 매뉴얼은 linux 환경에서 AllEat을 clone하여 빌드 및 배포하는 방법에 대한 가이드입니다.

# 0. 요구사항
- Ubuntu 20.04.6 LTS
	- Docker version 27.1.1, build 6312585
	- Docker Compose version v2.29.1
	- openjdk 17.0.12 2024-07-16
		- 상세사항
			- OpenJDK Runtime Environment (build 17.0.12+7-Ubuntu-1ubuntu220.04)
			- OpenJDK 64-Bit Server VM (build 17.0.12+7-Ubuntu-1ubuntu220.04, mixed mode, sharing)
# 1. 빌드
AllEat git repository 를 clone 후, `git_root/backend/AllEat` 로 이동하여 실행:
```bash
chmod +x gradlew
./gradlew build
```
# 2. 환경 변수 file 구성
다음 Template를 모두 채운 뒤 git root 폴더에 `.env` 이름으로 배치하세요.
```bash
# .env file

# General environment variables
SERVICE_DOMAIN=

# Security
JWT_SECRET=
JWT_KEY=
JWT_ALGORITHM=

# Spring container environment variables
DB_DOMAIN=
DB_CONNECTION=
DB_USERNAME=
DB_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# FastAPI container environment variables
OPENAI_API_KEY=
FAST_API=

# CORS 설정을 위한 테스트용 URL
TEST_LOCAL=

#FireBase environments variables
FIREBASE_CONFIG=

# 3. Deploy
git root 에서 실행
```bash
docker compose -f ./docker-compose.yml up down
```
이후 실행
```bash
docker compose -f ./docker-compose.yml up -d
```

#4. App Build
FrontEnd/AllEat directory에서 실행
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```
```bash
npx react-native run-android
```

