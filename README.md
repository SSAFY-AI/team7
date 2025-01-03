# **프로젝트 소개**
RAG 파이프라인을 기반으로 구축된 **진로 추천 서비스**입니다. 사용자는 QA 챗봇을 통해 적성과 관심사를 탐색하며, <br>구체적인 진로 정보를 얻을 수 있습니다.

---

## **주요 기능**
- **RAG 파이프라인 설계 및 구현**
- **데이터 최적화 및 벡터 데이터베이스 구축**
- **Retriever 튜닝**
- **LLM 기반 답변 생성 및 평가**

---

## **배포된 링크**
[**진로 탐색 React APP**](https://dawaqadvs8szr.cloudfront.net/)

---

## **기술 스택**

### **Frontend**
- **Framework**: React
- **Styling**: CSS
- **Build & Deployment**: AWS S3, CloudFront
- **State Management**: 기본 React 상태 관리

---

### **Backend**
- **Framework**: FastAPI
- **LLM API**: GPT-4 기반 모델
- **Database**: ChromaDB (Vector Database)
- **Embedding Model**: HuggingFace (all-MiniLM-L6-v2)
- **Prompt Tuning**: LangChain
- **Deployment**: Fly.io

---

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

---

# **사용법**

1. **질문 답변**  
   진로 상담 챗봇에 답변을 입력합니다.
   
2. **데이터 검색 및 답변 생성**  
   챗봇이 관련 데이터를 검색하고 최적화된 답변을 구성합니다.
   
3. **결과 확인 및 활용**  
   생성된 답변을 확인하고 필요에 따라 활용합니다.

---

## **로컬 실행 방법**

### **Frontend**
1. **리포지토리 클론**
   ```bash
   git clone https://github.com/SSAFY-AI/team7
   cd frontend
   ```
2. **의존성 설치**
   ```bash
   npm install
   ```
3. **로컬 서버 실행**
   ```bash
   npm start
   ```
4. **브라우저에서 열기**
   ```plaintext
   http://localhost:3000
   ```

---

### **Backend**
1. **의존성 설치**
   ```bash
   pip install -r requirements.txt
   ```
2. **환경 변수 설정**
   - Upstage API 키 및 기타 설정을 `.env` 파일에 저장합니다.
3. **로컬 서버 실행**
   ```bash
   python main.py
   ```
4. **API 테스트**
   ```plaintext
   기본 URL: http://localhost:8000
   ```

---

# **RAG 파이프라인 설계**

### **1. 데이터 최적화**
- **Chunk Size**: 100

### **2. 벡터 데이터베이스 구축 및 임베딩**
- **Vector DB**: ChromaDB
- **Embedding Model**: HuggingFace (all-MiniLM-L6-v2)

### **3. Retriever 구현**
- **Vector Retrieve**:
  - 하이퍼 파라미터 튜닝
  - 반환할 문서 수(K): 20

### **4. LLM 프롬프트 설계 및 답변 생성**

#### **Task 정의**: QA 챗봇

#### **프롬프트 템플릿**
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

#### **주요 요소**
1. **Input Variables**
   - `summary`: 사용자 입력의 요약 내용
   - `reference_comments`: 기존 전문가 코멘트
   - `job_label`: 직무 유형 정보

2. **Template Structure**
   - 요약 내용을 기반으로 새로운 전문가 코멘트를 생성
   - 기존 코멘트와 직무 유형 정보를 활용해 고도화된 답변 제공

3. **Output Objective**
   - 직무 유형에 특화된 맞춤형 답변 제공
   - 특정 학년 정보 제거

#### **답변 생성 모델**
- GPT-4 기반 **gpt-4o-mini**

---

# **결론 및 향후 발전 방향**

## **결론**
본 진로탐색 챗봇 서비스는 고등학생들이 진로를 결정하는 데 있어 겪는 정보 부족과 방향성 결여 문제를 해결하는 것을 목표로 합니다.  
학생들은 자신의 적성과 관심사를 명확히 이해하며, 학부모와 진로 상담사도 이 도구를 통해 체계적인 상담을 지원할 수 있습니다.

---

## **향후 발전 방향**
1. **데이터 기반 개선**  
   - 진로 관련 질문과 대화 패턴 학습으로 맞춤형 진로 탐색 지원
   
2. **학교 및 교육 기관과의 협력**  
   - 교육 현장에서 활용도를 높이기 위한 협업 및 커리큘럼 통합
   
3. **사용자 피드백 시스템 강화**  
   - 사용자 피드백을 반영하여 지속적인 성능 개선

---
