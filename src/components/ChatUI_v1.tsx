// src/components/ChatUI.tsx
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ChatMessage } from "../types/chat";
import ChatBubble from "./ChatBubble";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  messages: ChatMessage[];
  onSend: (payload: { text?: string; file?: any }) => void;
  loading?: boolean;
  onLogout?: () => void;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onClearAll?: () => Promise<void>;
}

const ChatUI: React.FC<Props> = ({
  messages,
  onSend,
  loading,
  onLogout,
  onDeleteMessage,
  onClearAll,
}) => {
  const [text, setText] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!res.canceled) {
      onSend({ file: res.assets[0] });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatBOT SIKONDA</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {onClearAll && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClearAll}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.logoutText}>Hapus Semua</Text>
            </TouchableOpacity>
          )}

          {onLogout && (
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CHAT LIST */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            onDelete={() => onDeleteMessage?.(item._id)}
          />
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* INPUT AREA */}
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>

        <TextInput
          placeholder="Tulis pesan..."
          value={text}
          onChangeText={setText}
          editable={!loading}
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.5 }]}
          disabled={loading}
          onPress={() => {
            if (!text.trim()) return;
            onSend({ text: text.trim() });
            setText("");
          }}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatUI;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },

  logoutBtn: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },

  clearBtn: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f39c12",
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  photoBtn: {
    backgroundColor: "#6c63ff",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  sendBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
    marginLeft: 6,
    justifyContent: "center",
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
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: "#fff",
  },
});
