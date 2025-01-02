import axios from "axios";

const API_URL = "http://localhost:8000"; // FastAPI 백엔드 주소

export const sendMessage = async (userInput) => {
  const response = await axios.post(`${API_URL}/chat`, { user_input: userInput });
  console.log(response);
  return response.data;
};
