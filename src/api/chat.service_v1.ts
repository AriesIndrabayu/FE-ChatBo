// src/api/chat.service.ts
import { botApi } from "./axios";
import Constants from "expo-constants";

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

    const res = await botApi.post("bot", formData, {
      headers: {
        "x-api-key": Constants.expoConfig?.extra?.KEY_API,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
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
