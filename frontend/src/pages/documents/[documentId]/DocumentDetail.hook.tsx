import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn UI components
import { useRtk } from "@/lib/rtk/store";
import { MOCK_DOCUMENTS } from "@/pages/Dashboard/DashboardDocuments/DashboardDocumentsGrid/DashboardDocumentsGrid.mock";
import { useDocumentDetailSocket } from "./DocumentDetail.context";
import { useDispatch } from "react-redux";
import { setDocumentDetailUsers } from "@/lib/rtk/slices/documentDetailSlice";

interface Message {
  text: string;
  sender: string;
  timestamp: number;
}

const useDocumentDetail = () => {
  const dispatch = useDispatch();
  const { sectionId } = useParams<{ sectionId: string }>();
  const isSocketConnected = useRtk(
    (state) => state.documentDetail.isSocketConnected
  );
  const [username, setUsername] = useState("");
  const users = useRtk((state) => state.documentDetail.users);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket } = useDocumentDetailSocket();

  // Setup event listeners once socket is connected
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    // Listen for chat messages
    socket.on("chat-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user join/leave events
    socket.on("user-joined", ({ users: roomUsers }) => {
      dispatch(setDocumentDetailUsers(roomUsers));
    });

    socket.on("user-left", ({ users: roomUsers }) => {
      dispatch(setDocumentDetailUsers(roomUsers));
    });

    // Clean up event listeners
    return () => {
      socket.off("chat-message");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket, isSocketConnected]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join room handler
  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !sectionId || !username.trim()) return;

    socket.emit("join-room", { roomId: sectionId, username });
    setIsJoined(true);
  };

  // Send chat message handler
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !isJoined) return;

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

  const documentName = MOCK_DOCUMENTS.find(
    (doc) => doc.id === sectionId
  )?.title;

  return {
    socket,
    isSocketConnected,
    username,
    setUsername,
    users,
    messages,
    newMessage,
    isJoined,
    messagesEndRef,
    handleJoinRoom,
    handleSendMessage,
    formatTime,
    getUserInitials,
    documentName,
    setNewMessage,
  };
};

export default useDocumentDetail;
