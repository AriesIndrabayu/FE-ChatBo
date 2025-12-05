// app/chat/index.tsx
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

import { useChat } from "../../src/hooks/useChat";
import ChatUI from "../../src/components/ChatUI";
import { ChatMessage } from "../../src/types/chat";
import { deleteMessage, clearHistory } from "../../src/api/chat.service";

const Chat = () => {
  const router = useRouter();
  const { sendChat, loadChatHistory } = useChat();
  const user = useSelector((state: any) => state.auth.user);
  const sessionId = user?.KodeChat ?? Date.now().toString();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load chat history saat mount
  useEffect(() => {
    const init = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const history = await loadChatHistory(sessionId);

        const formatted = history.map((msg: any) => ({
          _id: msg.id?.toString() ?? Date.now().toString(),
          role: msg.sender,
          text: msg.message,
          image: msg.file_url,
          typing: false,
          createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
          user: {
            _id: msg.sender === "user" ? "user" : "bot",
            name: msg.sender === "user" ? user?.name ?? "You" : "Bot",
          },
        }));

        setMessages(formatted);
      } catch (err) {
        console.log("Gagal load chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user]);

  const pushMessage = (msg: ChatMessage) =>
    setMessages((prev) => [...prev, msg]);

  // Hapus satu bubble
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(user.userid, messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error(err);
    }
  };

  // Hapus semua history
  const handleClearAll = async () => {
    try {
      await clearHistory(user.userid);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (payload: { text?: string; file?: any }) => {
    if (!payload.text && !payload.file) return;

    setLoading(true);

    const userMsg: ChatMessage = {
      _id: "user-" + Date.now(),
      role: "user",
      text: payload.text || "",
      file: payload.file || null,
      typing: false,
      createdAt: new Date(),
      user: { _id: "user", name: "You" },
    };
    pushMessage(userMsg);

    const typingMsg: ChatMessage = {
      _id: "typing-" + Date.now(),
      role: "bot",
      text: "",
      typing: true,
      createdAt: new Date(),
      user: { _id: "bot", name: "Bot" },
    };
    pushMessage(typingMsg);

    await new Promise((r) => setTimeout(r, 200));

    try {
      const start = Date.now();
      const res = await sendChat(payload, sessionId);

      const duration = Date.now() - start;
      const remain = Math.max(1000 - duration, 0);
      await new Promise((r) => setTimeout(r, remain));

      setMessages((prev) => prev.filter((m) => !m.typing));

      pushMessage({
        _id: "bot-" + Date.now(),
        role: "bot",
        text: res.reply ?? res.message ?? "",
        typing: false,
        createdAt: new Date(),
        user: { _id: "bot", name: "Bot" },
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !m.typing));
      pushMessage({
        _id: "err-" + Date.now(),
        role: "bot",
        text: "⛔ Server error",
        typing: false,
        createdAt: new Date(),
        user: { _id: "bot", name: "Bot" },
      });
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatUI
        messages={messages}
        onSend={handleSend}
        loading={loading}
        onLogout={() => {
          localStorage.removeItem("access_token");
          router.push("/login");
        }}
        onDeleteMessage={handleDeleteMessage}
        onClearAll={handleClearAll}
      />
    </View>
  );
};

export default Chat;
