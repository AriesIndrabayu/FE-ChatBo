import { useSelector } from "react-redux";
import { sendMessage } from "../api/chat.service";

export const useChat = () => {
  const user = useSelector((state: any) => state.auth.user);

  const sendChat = async (text: string, session_id: string) => {
    const user_id = user?.userid;

    return await sendMessage(session_id, user_id, text);
  };

  return { sendChat };
};
