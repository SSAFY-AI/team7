from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from backend.app.services.generation import generate_response
from backend.app.services.retrieval import search_data

app = FastAPI()

# CORS 설정 (React 앱과의 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 사용자 메시지를 받을 데이터 모델
class UserMessage(BaseModel):
    user_input: str


# Chat API 엔드포인트
@app.post("/chat")
async def chat_endpoint(message: UserMessage):
    user_message = message.user_input

    # 간단한 응답 (추후 RAG 통합 가능)
    if user_message.strip() == "":
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # FastAPI가 생성하는 기본 응답
    bot_response = f"Hi, you said: {user_message}"

    # Step 1: 데이터 검색
    # retrieved_docs = search_data(user_message, public_data)

    # Step 2: OpenAI API를 통해 답변 생성
    # bot_response = generate_response(user_message, retrieved_docs)

    return {"bot_response": bot_response}


# 앱 실행 (개발 환경)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
