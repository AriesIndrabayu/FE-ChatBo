import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../types/chat";

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },

    clearChat: (state) => {
      state.messages = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, clearChat, setLoading } = chatSlice.actions;

// ⬅ WAJIB ADA
export default chatSlice.reducer;
