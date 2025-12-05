// src/components/ChatUI.tsx
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { ChatMessage } from "../types/chat";
import ChatBubble from "./ChatBubble";

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  loading?: boolean;
}

const ChatUI = ({ messages, onSend, loading }: Props) => {
  const [text, setText] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={{ paddingVertical: 12 }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Tulis pesan..."
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
        />
        <Button
          title={loading ? "..." : "Kirim"}
          onPress={() => {
            if (text.trim().length === 0) return;
            onSend(text.trim());
            setText("");
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatUI;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
  },
});
