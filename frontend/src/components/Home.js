import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/chat");
  };

  return (
    <div className="home">
      <h1>진로 상담 챗봇</h1>
      <p>당신의 진로를 돕기 위해 준비된 상담 챗봇입니다.</p>
      <button onClick={handleStart}>상담 시작</button>
    </div>
  );
}

export default Home;
