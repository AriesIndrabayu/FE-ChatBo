import React, { useState } from "react";
import { View, TextInput, Button, Text, FlatList } from "react-native";
import { ChatMessage } from "../types/chat";

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

const ChatUI = ({ messages, onSend }: Props) => {
  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 4 }}>
            {item.role === "user" ? "🧑: " : "🤖: "}
            {item.text}
          </Text>
        )}
      />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Ketik pesan..."
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          marginVertical: 8,
        }}
      />

      <Button
        title="Kirim"
        onPress={() => {
          if (text.trim().length === 0) return;
          onSend(text);
          setText("");
        }}
      />
    </View>
  );
};

export default ChatUI;
