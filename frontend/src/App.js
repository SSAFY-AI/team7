import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ChatWindow from "./components/ChatWindow";
import ResultPage from "./components/ResultPage";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />       {/* 시작화면 */}
          <Route path="/chat" element={<ChatWindow />} /> {/* 상담 화면 */}
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;