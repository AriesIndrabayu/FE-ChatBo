// src/api/chat.service.ts
import { botApi } from "./axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const getChatHistory = async (session_id: string, user_id: string) => {
  try {
    const res = await botApi.get("/bot/history", {
      params: { session_id, user_id },
      headers: {
        "x-api-key": Constants.expoConfig?.extra?.KEY_API,
      },
    });

    return res.data.messages;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Gagal mengambil riwayat chat";
    throw new Error(msg);
  }
};

// Hapus 1 message berdasarkan message_id
export const deleteMessage = async (user_id: string, message_id: string) => {
  try {
    const res = await botApi.delete("/bot/history", {
      params: { user_id, message_id },
      headers: {
        "x-api-key": Constants.expoConfig?.extra?.KEY_API,
      },
    });
    return res.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message || err?.message || "Gagal menghapus pesan";
    throw new Error(msg);
  }
};

// Hapus semua history user
export const clearHistory = async (user_id: string) => {
  try {
    const res = await botApi.delete("/bot/history", {
      params: { user_id },
      headers: {
        "x-api-key": Constants.expoConfig?.extra?.KEY_API,
      },
    });
    return res.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Gagal menghapus semua history";
    throw new Error(msg);
  }
};

export const sendMessage = async (
  session_id: string,
  user_id: number,
  message: string
) => {
  const form = new FormData();
  form.append("session_id", session_id);
  form.append("user_id", String(user_id));
  form.append("message", message);

  try {
    const res = await botApi.post("/bot", form, {
      headers: {
        "x-api-key": Constants.expoConfig?.extra?.KEY_API,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Gagal terhubung ke server";
    throw new Error(msg);
  }
};

export const sendFile = async (
  session_id: string,
  user_id: number,
  file: any
) => {
  try {
    const form = new FormData();
    form.append("session_id", session_id);
    form.append("user_id", String(user_id));

    let fileToUpload: any;

    if (Platform.OS === "web") {
      const blob = await fetch(file.uri).then((r) => r.blob());
      fileToUpload = new File([blob], file.name || `upload_${Date.now()}.jpg`, {
        type: file.type || file.mimeType || "image/jpeg",
      });
    } else {
      fileToUpload = {
        uri:
          Platform.OS === "android"
            ? file.uri.replace("file://", "")
            : file.uri,
        name: file.name || `upload_${Date.now()}.jpg`,
        type: file.type || file.mimeType || "image/jpeg",
      } as any;
    }

    form.append("file", fileToUpload);

    const res = await botApi.post("/bot", form, {
      headers: { "x-api-key": Constants.expoConfig?.extra?.KEY_API },
    });

    console.log("sendFile response:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("sendFile error:", err.response?.data || err.message);
    throw err;
  }
};
