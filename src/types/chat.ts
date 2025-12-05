// FE-ChatBot/src/types/chat.ts
export interface ChatUser {
  _id: string;
  name?: string;
  avatar?: string;
}

export interface ChatMessage {
  _id: string;
  role: "user" | "bot";
  text: string;
  createdAt: string | Date;
  user: ChatUser;
  // tambahan opsional sesuai kebutuhan
  image?: string;
  system?: boolean;
  delivered?: boolean;
  seen?: boolean;
  typing?: boolean;
  file?: any | null;
}
