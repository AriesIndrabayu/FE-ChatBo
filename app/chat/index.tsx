import React, { useCallback, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { sendMessageToBot } from "../../src/api/chat.service";

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));

    const userMessage = newMessages[0].text;

    const botResponse = await sendMessageToBot(userMessage);

    const botMessage: IMessage = {
      _id: Math.random(),
      text: botResponse.reply,
      createdAt: new Date(),
      user: { _id: 2, name: "ChatBot" },
    };

    setMessages((prev) => GiftedChat.append(prev, botMessage));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(msgs) => onSend(msgs)}
      user={{ _id: 1 }}
    />
  );
}
