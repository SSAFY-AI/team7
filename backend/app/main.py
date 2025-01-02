from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
import os
from .quest_summary import get_random_questions, generate_summary

# FastAPI 앱 생성
app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (보안 필요 시 도메인 지정 가능)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# Embedding 모델 초기화
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 기존 ChromaDB 로드
persist_directory = "./rag_db"
vectorstore = Chroma(
    collection_name="career_advice",
    embedding_function=embedding_model,
    persist_directory=persist_directory
)

# RAG를 위한 ChatOpenAI 초기화
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
retriever = vectorstore.as_retriever(search_kwargs={"k": 20})

# Prompt Template 생성
prompt_template = PromptTemplate(
    input_variables=["summary", "reference_comments", "job_label"],
    template="""
    요약 내용:
    {summary}

    기존 전문가 코멘트들:
    {reference_comments}

    직무 유형:
    {job_label}

    이 내용을 바탕으로 해당 직무 유형에 맞는 새로운 전문가 코멘트를 작성해주세요(특정 학년 제거):
    """
)

# LLMChain 구성
comment_chain = LLMChain(llm=llm, prompt=prompt_template)


# 전문가 코멘트 생성 함수
def generate_expert_comment(summary):
    # 관련 문서 검색
    documents = retriever.get_relevant_documents(summary)

    # 기존 코멘트 합치기
    if documents:
        reference_comments = "\n".join([doc.metadata["expert_comment_ko"] for doc in documents])
        job_label = documents[0].metadata.get("job_label", "알 수 없음")
    else:
        reference_comments = "해당 요약 내용에 대한 기존 코멘트가 없습니다."
        job_label = "알 수 없음"

    # 새로운 코멘트 생성
    new_comment = comment_chain.invoke({
        "summary": summary,
        "reference_comments": reference_comments,
        "job_label": job_label
    })

    return new_comment


# 요청 데이터 모델 정의
class CommentRequest(BaseModel):
    summary: str


class CommentResponse(BaseModel):
    new_comment: str


responses = []

# 질문 리스트 정의
questions = []


# 요청 데이터 모델 정의
class ChatRequest(BaseModel):
    user_message: str

    # @validator("user_message")
    # def validate_user_message(cls, value):
    #     if not value or not value.strip():
    #         raise ValueError("user_message must not be empty")
    #     return value


# 응답 데이터 모델 정의
class ChatResponse(BaseModel):
    next_question: str


@app.get("/init", response_model=ChatResponse)
def init_chat():
    global questions
    questions = get_random_questions()
    print(questions)
    return ChatResponse(next_question=questions[0])


text = ""


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    print("Received data:", request)
    user_message = request.user_message

    global text, questions

    # 사용자 응답 저장
    responses.append(user_message)
    print("Responses so far:", responses)

    # 질문 순서에 따라 다음 질문 결정
    question_index = len(responses)
    if question_index < len(questions):
        next_question = questions[question_index]
        return ChatResponse(
            next_question=next_question
        )
    else:
        # 모든 질문이 완료되면 응답 리스트 초기화
        text = ""
        for i in responses:
            text += i + "\n"
        sum = generate_summary(text)
        print(sum)
        responses.clear()
        return ChatResponse(
            next_question="모든 질문이 완료되었습니다. 감사합니다!"
        )


@app.get("/generate-comment", response_model=CommentResponse)
def generate_comment_endpoint():
    global text
    try:
        new_comment = generate_expert_comment(text)
        return CommentResponse(
            new_comment=str(str(new_comment.get('text')) + "  \n " + str(new_comment.get('job_label'))))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating comment: {str(e)}")


@app.get("/")
def root():
    return {"message": "API is running"}