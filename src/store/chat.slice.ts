// src/store/chat.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../types/chat";

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error?: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addMessage, setMessages, clearChat, setLoading, setError } =
  chatSlice.actions;

export default chatSlice.reducer;
