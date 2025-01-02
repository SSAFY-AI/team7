import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageInput from "./MessageInput";
import "../styles/ChatWindow.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingMessage, setTypingMessage] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // 스크롤을 위해 Ref 생성

  // 타이핑 효과를 구현하는 함수
  const typeEffect = (text, callback) => {
    let index = 0;
    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        callback && callback();
      }
    }, 50);
  };

  // 스크롤을 최신 메시지로 이동하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // FastAPI 서버에서 초기 질문 가져오기
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/init`);
        if (response.ok) {
          const data = await response.json();
          setTypingMessage("");
          typeEffect(data.next_question, () => {
            setMessages([{ text: data.next_question, sender: "bot" }]);
            setTypingMessage("");
            scrollToBottom();
          });
        } else {
          console.error("Failed to fetch initial question", response.status);
        }
      } catch (error) {
        console.error("Error fetching initial question", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialQuestion();
  }, []);

  // 메시지가 추가될 때마다 스크롤 처리
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 사용자 메시지 추가 및 POST 요청 처리
  const addMessage = async (message, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender }]);

    if (sender === "user") {
      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_message: message }),
        });

        if (response.ok) {
          const data = await response.json();
          setTypingMessage("");
          typeEffect(data.next_question, () => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: data.next_question, sender: "bot" },
            ]);
            setTypingMessage("");
          });
        } else {
          console.error("Failed to send message", response.status);
        }
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  // 검사하기 버튼 클릭 핸들러
  const handleCheck = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-comment`);
      if (response.ok) {
        const data = await response.json();
        navigate("/result", { state: { comment: data.new_comment } });
      } else {
        console.error("Failed to fetch comment", response.status);
      }
    } catch (error) {
      console.error("Error fetching comment", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-window">
      <h1>1:1 상담</h1>
      <div className="chat-messages">
        {messages.map((message, index) => (
            <div
                key={index}
                className={`message ${message.sender === "user" ? "user" : "bot"}`}
            >
              {message.sender === "bot" ? (
                  <>
                    <span role="img" aria-label="bot">🤖</span>
                    {message.text}
                  </>
              ) : (
                  <>
                    {message.text}
                    <span role="img" aria-label="user">😊</span>
                  </>
              )}
            </div>
        ))}
        {typingMessage && (
            <div className="message bot typing">
              <span role="img" aria-label="bot">🤖</span> {typingMessage}
            </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <MessageInput addMessage={addMessage}/>
      <button onClick={handleCheck} className="check-button">
          결과받기
      </button>
    </div>
  );
}

export default ChatWindow;
