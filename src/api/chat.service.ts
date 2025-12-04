// src/api/chat.service.ts
import axios from "axios";
import { API_BASE_URL } from "../config/env";

export const sendMessage = async (
  session_id: string,
  user_id: number,
  message: string
) => {
  const formData = new FormData();
  formData.append("session_id", session_id);
  formData.append("user_id", user_id.toString());
  formData.append("message", message);

  const res = await axios.post(`${API_BASE_URL}bot`, formData);
  return res.data;
};
