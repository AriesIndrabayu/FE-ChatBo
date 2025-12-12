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
  Image,
  Dimensions,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ChatMessage } from "../types/chat";
import ChatBubble from "./ChatBubble";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isSmall = width < 380;

interface Props {
  messages: ChatMessage[];
  onSend: (payload: { text?: string; file?: any }) => void;
  loading?: boolean;
  onLogout?: () => void;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onClearAll?: () => Promise<void>;
  listRef?: React.RefObject<FlatList<ChatMessage>>;
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

  // track jumlah pesan sebelumnya supaya auto-scroll hanya jika pesan baru masuk
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // state untuk floating-button
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showButton = () => {
    if (!showScrollBtn) {
      setShowScrollBtn(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const hideButton = () => {
    if (showScrollBtn) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setShowScrollBtn(false));
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // web & mobile kompatibel
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const file = result.assets ? result.assets[0] : result;
        console.log("picked file:", file);

        onSend({ file }); // kirim ke handleSend
      }
    } catch (err) {
      console.error("pickImage error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        {/* Logo + Title */}
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/sikonda.png")}
            style={styles.headerLogo}
          />
          <Text style={styles.headerTitle}>ChatBOT SIKONDA</Text>
        </View>

        {/* Tombol Hapus Semua & Logout */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.clearBtn} onPress={onClearAll}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={16} color="#fff" />
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
            onDelete={() => onDeleteMessage?.(String(item._id))}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
        // onContentSizeChange={() => {
        //   setTimeout(() => {
        //     listRef.current?.scrollToEnd({ animated: true });
        //   }, 50);
        // }}
        // onLayout={() => listRef?.current?.scrollToEnd({ animated: true })}

        // FIX: auto-scroll hanya jika pesan baru masuk
        onContentSizeChange={() => {
          if (messages.length !== lastMessageCount) {
            setTimeout(() => {
              listRef.current?.scrollToEnd({ animated: true });
            }, 30);

            setLastMessageCount(messages.length);
            hideButton();
          }
        }}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          const contentHeight = e.nativeEvent.contentSize.height;
          const layoutHeight = e.nativeEvent.layoutMeasurement.height;

          const isBottom = offsetY + layoutHeight >= contentHeight - 20;

          if (isBottom) hideButton();
          else showButton();
        }}
        scrollEventThrottle={16}
      />

      {/* FLOATING BUTTON TO SCROLL DOWN */}
      {showScrollBtn && (
        <Animated.View
          style={[styles.scrollBtnContainer, { opacity: fadeAnim }]}
        >
          <TouchableOpacity
            style={styles.scrollBtn}
            onPress={() => {
              listRef.current?.scrollToEnd({ animated: true });
              hideButton();
            }}
          >
            <Ionicons name="arrow-down" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* INPUT AREA */}
      <View style={styles.inputRow}>
        {/* FOTO BUTTON */}
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>

        {/* TEXT INPUT */}
        <TextInput
          placeholder="Tulis pesan..."
          value={text}
          onChangeText={setText}
          editable={!loading}
          style={styles.input}
          multiline
        />

        {/* KIRIM BUTTON */}
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
  headerRight: {
    flexDirection: "row",
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  logoutBtn: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: "#e74c3c",
    borderRadius: 50,
    alignItems: "center",
    gap: 4,
  },
  logoutText: { color: "#fff", fontWeight: "600" },
  clearBtn: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: "#f39c12",
    borderRadius: 50,
    alignItems: "center",
    gap: 4,
  },
  clearText: { color: "#fff", fontWeight: "600" },
  /* Floating button */
  scrollBtnContainer: {
    position: "absolute",
    right: 16,
    bottom: 90,
  },
  scrollBtn: {
    backgroundColor: "#4285F4",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
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
    // justifyContent: "center",
    // alignItems: "center",
  },
  sendBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
    marginLeft: 6,
    // justifyContent: "center",
    // alignItems: "center",
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
