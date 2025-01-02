import React, { useState } from "react";
import { sendMessage } from "../api/chat";
import "../styles/MessageInput.css";

function MessageInput({ addMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage(input, "user");

    try {
      const response = await sendMessage(input);
      addMessage(response.bot_response, "bot");
    } catch (error) {
      addMessage("에러가 발생했습니다. 다시 시도해주세요.", "bot");
    }

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
