// src/components/ChatBubble.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import { ChatMessage } from "../types/chat";

interface Props {
  message: ChatMessage;
  onDelete?: () => void; // <-- opsional
}

// Safe cleanMarkdown
const cleanMarkdown = (text?: string) => {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n")
    .trim();
};

const typingTexts = [
  "Bot sedang menganalisis...",
  "Bot sedang memprediksi...",
  "Bot sedang menulis...",
];

const ChatBubble: React.FC<Props> = ({ message, onDelete }) => {
  const isUser = message.role === "user";
  const [typingText, setTypingText] = useState(typingTexts[0]);

  // =========================
  // Dynamic typing messages
  // =========================
  useEffect(() => {
    if (!message.typing) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % typingTexts.length;
      setTypingText(typingTexts[index]);
    }, 5000); // ganti tiap 5 detik

    return () => clearInterval(interval);
  }, [message.typing]);

  // Bubble typing
  if (message.typing) {
    return (
      <View style={[styles.container, styles.botContainer]}>
        <Text style={{ fontStyle: "italic", opacity: 0.6 }}>{typingText}</Text>
      </View>
    );
  }

  const cleanedText = cleanMarkdown(message.text);

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      {/* Render image jika ada */}
      {(message.image || message.file?.uri) && (
        <Image
          source={{ uri: message.image || message.file?.uri }}
          style={styles.image}
        />
      )}

      {isUser ? (
        <Text style={[styles.text, styles.userText]}>{cleanedText}</Text>
      ) : (
        <Markdown
          style={{
            body: { ...styles.text, ...styles.botText },
            strong: { fontWeight: "bold" },
            em: { fontStyle: "italic" },
            strong_em: { fontWeight: "bold", fontStyle: "italic" },
          }}
        >
          {cleanedText}
        </Markdown>
      )}

      <Text style={styles.time}>
        {message.createdAt
          ? new Date(message.createdAt).toLocaleTimeString()
          : ""}
      </Text>

      {/* Tombol delete */}
      {isUser && onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{ position: "absolute", top: 4, right: 4 }}
        >
          <Text style={{ color: "red", fontWeight: "bold" }}>❌</Text>
        </TouchableOpacity>
      )}
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
  image: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 6,
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
  text: { fontSize: 15 },
  userText: { color: "#fff" },
  botText: { color: "#000" },
  time: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 6,
    opacity: 0.7,
  },
});
