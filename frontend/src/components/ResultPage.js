import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";

function ResultPage() {
  const location = useLocation(); // 전달된 데이터 가져오기
  const navigate = useNavigate();

  const { comment } = location.state || { comment: "결과를 표시할 수 없습니다." };

  return (
    <div className="result-page">
      <h1>검사 결과</h1>
      <div className="result-comment">
        {comment.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <button onClick={() => navigate("/")} className="back-button">
        돌아가기
      </button>
    </div>
  );
}

export default ResultPage;