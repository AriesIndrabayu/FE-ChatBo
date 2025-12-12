// src/components/ChatUI.tsx (Responsive Version)
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
  Image,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { ChatMessage } from "../types/chat";
import ChatBubble from "./ChatBubble";

const { width } = Dimensions.get("window");
const isSmall = width < 380;

const ChatUI = ({
  messages,
  onSend,
  loading,
  onLogout,
  onDeleteMessage,
  onClearAll,
}) => {
  const [text, setText] = useState("");
  const listRef = useRef(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      onSend({ file });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/sikonda.png")}
            style={styles.headerLogo}
          />
          <Text style={styles.headerTitle}>ChatBOT SIKONDA</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.clearBtn} onPress={onClearAll}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
            {!isSmall && <Text style={styles.clearText}>Hapus</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={16} color="#fff" />
            {!isSmall && <Text style={styles.logoutText}>Logout</Text>}
          </TouchableOpacity>
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
            onDelete={() => onDeleteMessage(String(item._id))}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
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
    padding: 12,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    gap: 6,
  },
  clearBtn: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f39c12",
    borderRadius: 18,
    alignItems: "center",
    gap: 4,
  },
  clearText: { color: "#fff", fontWeight: "600" },
  logoutBtn: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 18,
    alignItems: "center",
    gap: 4,
  },
  logoutText: { color: "#fff", fontWeight: "600" },

  inputRow: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  photoBtn: {
    backgroundColor: "#6c63ff",
    padding: 10,
    borderRadius: 50,
  },
  sendBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
    marginLeft: 6,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: "#fff",
  },
});
