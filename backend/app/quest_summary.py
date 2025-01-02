import pandas as pd
import random
import openai
import os
# 현재 파일의 디렉토리 경로
base_dir = os.path.dirname(os.path.abspath(__file__))
print(base_dir)
question_data_file = os.path.join(base_dir, "sorted_generalized_questions_korean.csv")

question_data = pd.read_csv(question_data_file)
# # 데이터 로드
# question_data_file = "sorted_generalized_questions_korean.csv"
# question_data = pd.read_csv(question_data_file)

# 열 이름 확인
print(question_data.columns)

# 카테고리별로 질문을 그룹화 (Category 열을 기준으로)

# 각 카테고리에서 최소 1개 이상의 질문을 랜덤으로 뽑고, 나머지 질문을 랜덤하게 뽑아서 총 8개의 질문을 만들기
def get_random_questions():
    category_order = ['진로 희망', '성격 및 특성', '관심사와 취미', '기술과 강점', '교육과정과 학업', '장애물 및 도전']
    category_questions = {category: question_data[question_data['카테고리'] == category]['질문'].tolist() for category in category_order}

    selected_questions = set()  # 이미 선택된 질문을 추적하는 집합
    selected_category_questions = []  # 최종 선택된 질문과 카테고리 목록
    
    # 첫 번째 질문은 반드시 '진로 희망' 카테고리에서 선택
    first_question = random.choice(category_questions['진로 희망'])
    while first_question in selected_questions:  # 이미 선택된 질문이면 다른 질문을 선택
        first_question = random.choice(category_questions['진로 희망'])
    selected_questions.add(first_question)
    selected_category_questions.append( first_question)
    
    # 각 카테고리에서 최소 1개 이상의 질문을 선택 (진로 희망 제외)
    remaining_categories = [category for category in category_order if category != '진로 희망']
    
    # 각 카테고리에서 최소 1개 이상의 질문을 선택
    for category in remaining_categories:
        question = random.choice(category_questions[category])
        while question in selected_questions:  # 이미 선택된 질문이면 다른 질문을 선택
            question = random.choice(category_questions[category])
        selected_questions.add(question)
        selected_category_questions.append( question)
    
    # 남은 슬롯에 대해서 각 카테고리에서 균등하게 질문을 선택
    remaining_slots = 8 - len(selected_category_questions)
    
    # 균등하게 나머지 질문을 선택
    remaining_categories = category_order.copy()
    remaining_categories.remove('진로 희망')  # '진로 희망' 카테고리는 이미 선택됨
    while remaining_slots > 0:
        random.shuffle(remaining_categories)  # 카테고리 순서 랜덤화
        for category in remaining_categories:
            if remaining_slots == 0:
                break
            available_questions = [q for q in category_questions[category] if q not in selected_questions]
            if available_questions:
                selected_remaining = random.choice(available_questions)
                selected_questions.add(selected_remaining)
                selected_category_questions.append(selected_remaining)
                remaining_slots -= 1
    
    return selected_category_questions[:8]

# 8개의 랜덤 질문 출력 및 답변 입력 받기
# def ask_questions():
#     random_questions = get_random_questions()
#     answers = []  # 사용자의 답변을 저장할 리스트

#     print("선택된 질문들:")
#     for idx, (category, question) in enumerate(random_questions, 1):
#         print(f"{idx}. [{category}] {question}")
#         answer = input(f"답변을 입력하세요 (질문 {idx}): ")  # 답변 입력 받기
#         answers.append(answer)  # 카테고리, 질문, 답변을 튜플로 저장

#     return answers

# 답변 리스트 출력
#answers = ask_questions()


# OpenAI API 키 설정


# 답변들을 하나의 텍스트로 결합
#answers_text = "\n".join(answers)

# GPT-4 모델을 사용하여 summary 생성
def generate_summary(answers_text):
    prompt = f"다음 답변들을 종합하여 하나의 요약을 만들어 주세요. 따옴표와 같은 특수문자는 사용하지 말아주세요. 문체의 예시는 다음 문장과 같이 해주세요. 과학보다 수학에 더 흥미를 느끼는 것 같아 과학 교사가 아닌 수학 교사를 꿈꾸고 있다. 자신의 세부 특기사항을 어떤 식으로 적어야 하는지에 대해 고민하고 있다. 자연 계열 교사의 핵심 능력과 비교했을 때, 본인의 경우 언어와 수리논리 능력은 괜찮다고 생각한다. 다만, 핸드폰을 보는 데 시간을 많이 보낼 때면 자기 통제가 안 되는 것 같아 자기 성찰 능력은 부족하다고 느끼고 있다.:\n{answers_text}\n요약:"
    
    # ChatCompletion 사용
    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # 사용하려는 모델
        messages=[
            {
                "role": "system", "content": "You are a helpful assistant.",
                "role": "user", "content": prompt
            }
        ],
        max_tokens=150,
        temperature=0.7
    )
    response_dict = response.to_dict()
    summary = response_dict['choices'][0]['message']['content'].strip()

    return summary


