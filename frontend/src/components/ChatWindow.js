import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import "../styles/ChatWindow.css";

function ChatWindow() {
  const [messages, setMessages] = useState([
    { text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" },
  ]);

  const messagesEndRef = useRef(null);

  const addMessage = async (message, sender) => {
    if (sender === "user") {
      // 사용자 메시지 즉시 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender },
      ]);
    } else if (sender === "bot") {
      // 봇 메시지 추가 로직
      let currentMessage = "";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "", sender: "bot" }, // 빈 메시지로 봇의 초기 상태 추가
      ]);

      for (let char of message) {
        currentMessage += char;
        await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms 간격
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            text: currentMessage,
            sender: "bot",
          }; // 마지막 메시지만 업데이트
          return updatedMessages;
        });
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <h1>1:1 상담</h1>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "bot"}`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  );
}

export default ChatWindow;
