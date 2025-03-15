import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn UI components
import { useRtk } from "@/lib/rtk/store";
import { useDocumentDetailSocket } from "../DocumentDetail.context";

interface Message {
  text: string;
  sender: string;
  timestamp: number;
}

const useDocumentDetailChat = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const isSocketConnected = useRtk(
    (state) => state.documentDetail.isSocketConnected
  );
  const [username, setUsername] = useState("");
  const users = useRtk((state) => state.documentDetail.users);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const hasJoinedRoom = useRtk((state) => state.documentDetail.hasJoinedRoom);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useDocumentDetailSocket();

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on("chat-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket, isSocketConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !hasJoinedRoom) return;

    socket.emit("chat-message", { roomId: sectionId, message: newMessage });
    setNewMessage("");
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user initials for Avatar
  const getUserInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return {
    username,
    users,
    messages,
    newMessage,
    setNewMessage,
    isSocketConnected,
    handleSendMessage,
    messagesEndRef,
    getUserInitials,
    formatTime,
  };
};

export default useDocumentDetailChat;
