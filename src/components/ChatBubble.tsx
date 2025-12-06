// src/components/ChatBubble.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import { ChatMessage } from "../types/chat";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_LOGIN } from "../config/env";

interface Props {
  message: ChatMessage;
  onDelete?: () => void;
}

const typingTexts = [
  "Bot sedang proses machine learning...",
  "Bot sedang menganalisis...",
  "Bot sedang memprediksi...",
  "Bot sedang menulis...",
];

// Safe cleanMarkdown
const cleanMarkdown = (text?: string) => {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n")
    .trim();
};

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
    }, 5000);

    return () => clearInterval(interval);
  }, [message.typing]);

  if (message.typing) {
    return (
      <View style={[styles.container, styles.botContainer]}>
        <Text style={{ fontStyle: "italic", opacity: 0.6 }}>{typingText}</Text>
      </View>
    );
  }

  const cleanedText = cleanMarkdown(message.text);
  const getImageUri = (message: ChatMessage) => {
    // Gunakan message.image jika ada, tambahkan API_BASE_LOGIN
    if (message.image) {
      const path = message.image.startsWith("/")
        ? message.image
        : `/${message.image}`;
      const fullUri = `${API_BASE_LOGIN}${path}`;
      console.log("getImageUri - fullUri from image:", fullUri);
      return fullUri;
    }

    // Jika ada file.uri
    if (message.file?.uri) {
      const path = message.file.uri.startsWith("/")
        ? message.file.uri
        : `/${message.file.uri}`;
      const fullUri = `${API_BASE_LOGIN}${path}`;
      console.log("getImageUri - fullUri from file.uri:", fullUri);
      return fullUri;
    }

    return null;
  };

  // Ambil URI file atau image
  const imageUri = getImageUri(message);
  console.log("imageUri:", imageUri);

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      {/* Render image jika ada */}
      {(message.image || message.file?.uri) && (
        <Image source={{ uri: imageUri }} style={styles.image} />
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
            link: {
              fontWeight: "bold", // tebal
              color: "#007bff", // biru
              textDecorationLine: "none", // hilangkan underline
            },
          }}
        >
          {cleanedText}
        </Markdown>
      )}

      <View style={styles.bottomRow}>
        <Text style={styles.time}>
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString()
            : ""}
        </Text>

        {/* Tombol delete per bubble */}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={{ marginLeft: 6 }}>
            <Ionicons name="trash-outline" size={14} color="#a11111ff" />
          </TouchableOpacity>
        )}
      </View>
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
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 6,
  },
  userContainer: {
    backgroundColor: "#a6becfff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  botContainer: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  text: { fontSize: 15 },
  userText: { color: "#292727ff" },
  botText: { color: "#000" },
  time: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 6,
  },
});
