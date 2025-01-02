import json
from typing import List

# JSON 데이터 로드
def load_data(filepath: str):
    with open(filepath, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

# 데이터 검색
def search_data(query: str, data: List[dict], top_k: int = 3) -> List[dict]:
    # 간단한 키워드 기반 검색
    results = sorted(
        data,
        key=lambda x: query.lower() in x["content"].lower(),
        reverse=True,
    )
    return results[:top_k]

# 공공 데이터 로드
# public_data = load_data("app/data/public_data.json")
