// FE-ChatBot/app/chat/index.tsx

import React, { useState } from "react";
import { View } from "react-native";
import { useChat } from "../../src/hooks/useChat"; // ⬅ NAMED EXPORT
import ChatUI from "../../src/components/ChatUI"; // ⬅ HARUS ADA FILE-NYA
import { ChatMessage } from "../../src/types/chat";

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendChat } = useChat();

  const [sessionId] = useState(() => Date.now().toString());

  const makeMessage = (role: "user" | "bot", text: string): ChatMessage => ({
    _id: Date.now().toString() + Math.random(),
    role,
    text,
    createdAt: new Date(),
    user: {
      _id: role,
      name: role === "user" ? "User" : "Bot",
    },
  });

  const handleSend = async (text: string) => {
    const res = await sendChat(text, sessionId);

    setMessages((prev) => [
      ...prev,
      makeMessage("user", text),
      makeMessage("bot", res.reply),
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatUI messages={messages} onSend={handleSend} />
    </View>
  );
};

export default Chat;
