// app/chat/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

import ChatUI from "../../src/components/ChatUI";
import { ChatMessage } from "../../src/types/chat";
import {
  sendMessage,
  sendFile,
  getChatHistory,
  deleteMessage,
  clearHistory,
} from "../../src/api/chat.service";

const Chat = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const sessionId = user?.KodeChat ?? Date.now().toString();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Ref FlatList
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const refreshChatHistory = async () => {
    try {
      const history = await getChatHistory(sessionId, user.userid);
      const formatted = history.map((msg: any) => ({
        _id: String(msg.id ?? Date.now()),
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
      console.error("Gagal refresh chat history:", err);
    }
  };

  // Load history
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      setLoading(true);
      refreshChatHistory().finally(() => setLoading(false));
    };
    init();
  }, [user]);

  const pushMessage = (msg: ChatMessage) =>
    setMessages((prev) => [...prev, msg]);

  // Hapus 1 bubble
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(String(user.userid), messageId);
      setMessages((prev) => prev.filter((m) => String(m._id) !== messageId));
    } catch (err) {
      console.error(err);
    }
  };

  // Hapus semua history
  const handleClearAll = async () => {
    try {
      await clearHistory(String(user.userid));
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Kirim pesan teks/file
  const handleSend = async (payload: { text?: string; file?: any }) => {
    if (!payload.text && !payload.file) return;

    setLoading(true);

    // Push user message
    const userMsg: ChatMessage = {
      _id: "user-" + Date.now(),
      role: "user",
      text: payload.text ?? "",
      file: payload.file ?? null,
      typing: false,
      createdAt: new Date(),
      user: { _id: "user", name: "You" },
    };
    pushMessage(userMsg);

    // Bubble typing bot
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
      let res;
      if (payload.file) {
        // console.log("sending file:", payload.file); // debug
        res = await sendFile(sessionId, user.userid, payload.file);
        await refreshChatHistory(); // refresh khusus untuk file

        // Scroll ke bawah setelah file sukses dikirim
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        res = await sendMessage(sessionId, user.userid, payload.text ?? "");
        // Scroll ke bawah setelah file sukses dikirim
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }

      const duration = Date.now() - start;
      const remain = Math.max(1000 - duration, 0);
      await new Promise((r) => setTimeout(r, remain));

      // Hapus typing
      setMessages((prev) => prev.filter((m) => !m.typing));

      // Tambah balasan bot
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
        listRef={listRef}
      />
    </View>
  );
};

export default Chat;
