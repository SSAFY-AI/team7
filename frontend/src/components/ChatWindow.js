import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageInput from "./MessageInput";
import "../styles/ChatWindow.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingMessage, setTypingMessage] = useState("");
  const [loadingResult, setLoadingResult] = useState(false); // 결과 로딩 상태
  const [showResultButton, setShowResultButton] = useState(false); // 결과받기 버튼 표시 여부
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            if (data.next_question === "모든 질문이 완료되었습니다. 감사합니다!") {
              setShowResultButton(true); // 결과받기 버튼 표시
            }
          });
        } else {
          console.error("Failed to send message", response.status);
        }
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  const handleCheck = async () => {
    setLoadingResult(true); // 로딩 상태 활성화
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
    } finally {
      setLoadingResult(false); // 로딩 상태 비활성화
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
      <MessageInput addMessage={addMessage} />
      {showResultButton && (
        <button onClick={handleCheck} className="check-button" disabled={loadingResult}>
          {loadingResult ? "생성 중.." : "결과받기"}
        </button>
      )}
    </div>
  );
}

export default ChatWindow;
