# 프로젝트 소개
이 프로젝트는 RAG 파이프라인 구축을 통한 진로 추천 서비스로, QA 챗봇을 설계하고 구현하여 진로 추천 서비스를 제공합니다. 사용자는 챗봇을 통해 적성과 관심사를 기반으로 진로를 탐색하고, 구체적인 정보를 제공받을 수 있습니다.

## 주요 기능
- RAG 파이프라인 설계 및 구현
- 데이터 최적화 및 벡터 데이터베이스 구축
- Retriever 튜닝
- LLM 기반 답변 생성 및 평가

## **기술 스택**

### **Frontend**
- **Framework**: React
- **Styling**: CSS
- **Build & Deployment**: AWS CloudFront
- **State Management**: React 기본 상태 관리
<hr>

### **Backend**
- **Framework**: FastAPI
- **LLM API**: GPT-4 기반 모델
- **Database**: ChromaDB (Vector Database)
- **Embedding Model**: HuggingFace (all-MiniLM-L6-v2)
- **Prompt Tuning**: LangChain
- **Deployment**: Fly.io
<hr>

# **프로젝트 디렉토리 구조**

### **Frontend**
```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
├── src/
│   ├── components/
│   │   ├── ChatWindow.js
│   │   ├── Home.js
│   │   ├── MessageInput.js
│   │   └── ResultPage.js
│   ├── styles/
│   │   ├── ChatWindow.css
│   │   ├── Home.css
│   │   ├── MessageInput.css
│   │   └── ResultPage.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── package-lock.json
└── .gitignore
```

---

### **Backend**
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── quest_summary.py
│   └── sorted_generalized_questions_korean.csv
├── rag_db/
│   └── __init__.py
├── requirements.txt
└── .gitignore
```

# 사용법
1. 진로 추천 챗봇에 질문을 입력합니다.
2. 챗봇이 데이터를 검색하고 답변을 생성합니다.
3. 생성된 답변을 확인하고 필요한 정보를 활용합니다.

# 배포된 링크
[React APP](https://dawaqadvs8szr.cloudfront.net/)

# 로컬 실행 방법

## 사전 요구사항
- Python 3.9.12
- ChromaDB 및  HuggingFace Embedding 모델 설치
- 

## 실행 단계
1. **리포지토리 클론**
   ```bash
   git clone https://github.com/SSAFY-AI/team7
   ```
2. **의존성 설치**
   ```bash
   pip install -r requirements.txt
   ```
3. **환경 변수 설정**
   - Upstage API 키 및 기타 설정을 `.env` 파일에 저장합니다.
4. **로컬 서버 실행**
   ```bash
   python main.py
   ```
5. **브라우저에서 열기**
   ```
   http://localhost:3000
   ```

# RAG 파이프라인 설계
## 데이터 최적화- Chunk Size: 100

## 벡터 데이터베이스 구축 및 임베딩
- 벡터 DB: ChromaDB
- 임베딩 모델: HuggingFace(all-MiniLM-L6-v2)

## Retriever 구현
- Vector Retrieve 이용
  - 하이퍼 파라미터 튜닝
  - 반환할 문서 수(K): 20

## LLM 프롬프트 설계 및 답변 생성
## 1. **Task 정의**: QA 챗봇
## 2. **프롬프트 설계**:

### 설계 목표
- 사용자의 입력 데이터를 기반으로 직무 유형에 맞는 새로운 전문가 코멘트를 생성
- 기존 전문가 코멘트와 요약 내용을 활용하여 고도화된 답변 제공

### 프롬프트 템플릿 구성
```python
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
```

### 주요 요소
1. **Input Variables**
   - `summary`: 사용자 입력의 요약 내용
   - `reference_comments`: 기존 전문가 코멘트
   - `job_label`: 직무 유형 정보

2. **Template Structure**
   - `요약 내용`: 입력 데이터의 핵심 내용을 요약하여 제공
   - `기존 전문가 코멘트들`: 과거 전문가 코멘트를 참고로 활용
   - `직무 유형`: 답변 생성에 필요한 직무 정보를 명시

3. **Output Objective**
   - 특정 학년 정보를 제거한 새로운 전문가 코멘트를 생성
   - 직무 유형에 특화된 맞춤형 답변 제공


3. **답변 생성 모델**: gpt-4o-mini


# 결론 및 향후 발전 방향
## 결론
본 진로탐색 챗봇 서비스는 고등학생들이 진로를 결정하는 데 있어 겪는 정보 부족, 방향성 결여, 그리고 구체적인 지원 부족 문제를 해결하고자 하는 목표를 가지고 있습니다. 학생들이 자신의 적성과 관심사를 보다 명확히 이해하고, 이를 바탕으로 다양한 진로 선택지를 탐색할 수 있도록 돕는 역할을 합니다. 또한, 학부모와 진로 상담사에게도 중요한 지원 도구로 작용하여 보다 체계적이고 다양한 진로 상담을 제공할 수 있습니다.

## 향후 발전 방향
- **데이터 기반 개선**: 진로 관련 질문과 대화 패턴을 학습하여 보다 정교한 맞춤형 진로 탐색을 지원할 수 있도록 고도화할 필요가 있습니다.
- **학교 및 교육 기관과의 협력**: 교육 현장에서의 활용도를 높이기 위해 학교 및 진로 교육기관과의 협업을 통해 서비스 확장과 적극적인 홍보가 필요합니다. 또한, 학교 커리큘럼과의 통합을 고려하여 학생들이 더 효과적으로 진로 탐색을 할 수 있도록 지원할 수 있습니다.
- **사용자 피드백 시스템 강화**: 사용자가 서비스 사용 후 제공하는 피드백을 적극적으로 반영하여 지속적으로 서비스 품질을 향상시키는 시스템을 마련하는 것이 중요합니다. 이를 통해 챗봇의 성능을 점진적으로 개선하고, 사용자 만족도를 높일 수 있습니다.
