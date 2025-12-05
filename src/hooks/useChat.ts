// src/hooks/useChat.ts
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage as sendMessageApi,
  sendFile as sendFileApi,
  getChatHistory as getChatHistoryApi,
} from "../api/chat.service";
import { addMessage, setLoading, setError } from "../store/chat.slice";
import { ChatMessage } from "../types/chat";

export const useChat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const sendChat = async (
    payload: { text?: string; file?: any },
    session_id: string
  ) => {
    const KodeChat = user?.KodeChat ?? user?.KodeChat ?? 0;
    console.log("Test User Auth:", KodeChat);
    const user_id = user?.userid ?? user?.id ?? 0;

    dispatch(setLoading(true));
    dispatch(setError(null));

    let local: ChatMessage;
    let resp;

    try {
      if (payload.text) {
        local = {
          _id: Date.now().toString(),
          role: "user",
          text: payload.text,
          createdAt: new Date(),
          user: { _id: user_id, name: user?.name ?? "Anda" },
        };
        dispatch(addMessage(local));

        resp = await sendMessageApi(session_id, user_id, payload.text);
      }

      if (payload.file) {
        local = {
          _id: Date.now().toString(),
          role: "user",
          text: "[Foto dikirim]",
          createdAt: new Date(),
          image: payload.file.uri,
          user: { _id: user_id, name: user?.name ?? "Anda" },
        };
        dispatch(addMessage(local));

        resp = await sendFileApi(session_id, user_id, payload.file);
      }

      const botMsg: ChatMessage = {
        _id: "bot-" + Date.now().toString(),
        role: "bot",
        text: resp?.reply ?? resp?.message ?? JSON.stringify(resp),
        createdAt: new Date(),
        user: { _id: "bot", name: "Bot" },
      };

      dispatch(addMessage(botMsg));
      dispatch(setLoading(false));
      return resp;
    } catch (err: any) {
      dispatch(setLoading(false));
      dispatch(setError(err?.message));
      throw err;
    }
  };

  // ===========================
  // Fungsi baru: loadChatHistory
  // ===========================
  const loadChatHistory = async (session_id: string) => {
    const user_id = user?.userid ?? user?.id ?? 0;
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const messages = await getChatHistoryApi(session_id, user_id);
      // masukkan tiap pesan ke store
      messages.forEach((msg: ChatMessage) => dispatch(addMessage(msg)));
      dispatch(setLoading(false));
      return messages;
    } catch (err: any) {
      dispatch(setLoading(false));
      dispatch(setError(err?.message));
      throw err;
    }
  };

  return { sendChat, loadChatHistory };
};
