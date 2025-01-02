import React, { useState } from "react";
import "../styles/MessageInput.css";

function MessageInput({ addMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 사용자 메시지 추가
    addMessage(input, "user");
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">전송</button>
    </form>
  );
}

export default MessageInput;