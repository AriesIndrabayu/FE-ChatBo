// src/components/ChatBubble.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChatMessage } from "../types/chat";

interface Props {
  message: ChatMessage;
}

const ChatBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
        {message.text}
      </Text>
      <Text style={styles.time}>
        {typeof message.createdAt === "string"
          ? new Date(message.createdAt).toLocaleTimeString()
          : (message.createdAt as Date).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 10,
    padding: 10,
    maxWidth: "80%",
    borderRadius: 12,
  },
  userContainer: {
    backgroundColor: "#0b93f6",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  botContainer: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: 15,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#000",
  },
  time: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 6,
    opacity: 0.7,
  },
});
