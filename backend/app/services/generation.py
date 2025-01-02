from typing import List
import openai
import os

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")
# OpenAI API를 사용하여 답변 생성
def generate_response(user_message: str, documents: List[dict]) -> str:
    # 검색된 문서를 프롬프트로 구성
    context = "\n".join([f"{doc['title']}: {doc['content']}" for doc in documents])
    prompt = f"다음 컨텍스트를 기반으로 질문에 답하세요:\n\n{context}\n\n질문: {user_message}\n답변:"

    # OpenAI API 호출
    response = openai.Completion.create(
        engine="text-davinci-003",  # GPT-3.5 또는 GPT-4
        prompt=prompt,
        max_tokens=150,
        temperature=0.7,
    )
    return response.choices[0].text.strip()
