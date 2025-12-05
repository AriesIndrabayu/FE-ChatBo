// src/api/chat.service.ts
import axios from "axios";
import { API_BASE_URL } from "../config/env";

export const sendMessage = async (
  session_id: string,
  user_id: number,
  message: string
) => {
  try {
    const formData = new FormData();
    formData.append("session_id", session_id);
    formData.append("user_id", String(user_id));
    formData.append("message", message);

    const res = await axios.post(`${API_BASE_URL}bot`, formData); // baseURL sudah API_BASE_URL
    return res.data;
  } catch (err: any) {
    // Normalisasi error
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Gagal terhubung ke server";
    throw new Error(message);
  }
};
