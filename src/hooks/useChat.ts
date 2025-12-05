// src/hooks/useChat.ts
import { useDispatch, useSelector } from "react-redux";
import { sendMessage as sendMessageApi } from "../api/chat.service";
import { addMessage, setLoading, setError } from "../store/chat.slice";
import { ChatMessage } from "../types/chat";

export const useChat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const sendChat = async (text: string, session_id: string) => {
    const user_id = user?.userid ?? user?.id ?? 0;

    // local optimistic message
    const local: ChatMessage = {
      _id: Date.now().toString(),
      role: "user",
      text,
      createdAt: new Date(),
      user: { _id: user_id, name: user?.name ?? "Anda" },
    };
    dispatch(addMessage(local));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const resp = await sendMessageApi(session_id, user_id, text);
      // Harapkan API memberikan reply text, kalau bentuknya lain sesuaikan
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
      dispatch(setError(err?.message ?? "Unknown error"));
      // Anda bisa juga inject message error ke chat sebagai bot reply
      const errMsg: ChatMessage = {
        _id: "err-" + Date.now().toString(),
        role: "bot",
        text: `Terjadi kesalahan: ${err?.message ?? "Unknown"}`,
        createdAt: new Date(),
        user: { _id: "bot", name: "Bot" },
      };
      dispatch(addMessage(errMsg));
      throw err;
    }
  };

  return { sendChat };
};
