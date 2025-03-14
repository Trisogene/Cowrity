import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

// Shadcn UI components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_DOCUMENTS } from "@/pages/Dashboard/DashboardDocuments/DashboardDocumentsGrid/DashboardDocumentsGrid.mock";

interface Message {
  text: string;
  sender: string;
  timestamp: number;
}

interface User {
  id: string;
  username: string;
}

interface Delta {
  insert?: string;
  delete?: number;
  position?: number;
}

const DocumentDetail = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [content, setContent] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      setSocket(newSocket);
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Setup event listeners once socket is connected
  useEffect(() => {
    if (!socket || !connected) return;

    // Listen for text changes from other users
    socket.on("text-change", ({ delta, sender }) => {
      if (sender !== socket.id) {
        // Apply changes from others without triggering our own update
        setContent((prevContent) => applyDelta(prevContent, delta));

        // Restore cursor position after content update
        if (editorRef.current) {
          const { start, end } = lastSelectionRef.current;
          setTimeout(() => {
            editorRef.current!.selectionStart = start;
            editorRef.current!.selectionEnd = end;
            editorRef.current!.focus();
          }, 0);
        }
      }
    });

    // Listen for document state when joining
    socket.on("document-state", ({ content: newContent }) => {
      setContent(newContent);
    });

    // Listen for chat messages
    socket.on("chat-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user join/leave events
    socket.on("user-joined", ({ users: roomUsers }) => {
      setUsers(roomUsers);
    });

    socket.on("user-left", ({ users: roomUsers }) => {
      setUsers(roomUsers);
    });

    // Clean up event listeners
    return () => {
      socket.off("text-change");
      socket.off("document-state");
      socket.off("chat-message");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket, connected]);

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

  // Text change handler
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    if (content !== newContent && socket) {
      // Create a simple delta
      const cursorPosition = e.target.selectionStart;
      let delta: Delta;

      if (newContent.length > content.length) {
        // Text was added
        const addedText = newContent.slice(content.length);
        delta = {
          insert: addedText,
          position: cursorPosition - addedText.length,
        };
      } else {
        // Text was deleted
        const deletedCount = content.length - newContent.length;
        delta = { delete: deletedCount, position: cursorPosition };
      }

      // Update content locally
      setContent(newContent);

      // Send change to server
      socket.emit("text-change", { delta, roomId: sectionId });
    }

    // Store current selection for later restoration
    lastSelectionRef.current = {
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    };
  };

  // Send chat message handler
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !isJoined) return;

    socket.emit("chat-message", { roomId: sectionId, message: newMessage });
    setNewMessage("");
  };

  // Helper function to apply text changes
  function applyDelta(content: string, delta: Delta): string {
    if (delta.insert !== undefined) {
      const pos = delta.position || content.length;
      return content.substring(0, pos) + delta.insert + content.substring(pos);
    } else if (delta.delete !== undefined) {
      const pos = delta.position || 0;
      const length = delta.delete;
      return content.substring(0, pos) + content.substring(pos + length);
    }
    return content;
  }

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

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Join Collaboration Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl text-center mb-6">{documentName}</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full"
                variant="default"
                disabled={!connected}
              >
                {connected ? "Join Room" : "Connecting..."}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2  h-screen w-full bg-background p-2">
      {/* Header */}
      <div className=" border rounded p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{documentName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2 flex-1 overflow-hidden">
        {/* Document Editor */}
        <div className="col-span-2 flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden bg-card border rounded">
            <div className="py-3 px-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Document</CardTitle>
                <Badge variant="outline">
                  {users.length} user{users.length !== 1 ? "s" : ""} online
                </Badge>
              </div>
            </div>
            <div className="p-0 flex-1 overflow-hidden">
              <Textarea
                ref={editorRef}
                value={content}
                onChange={handleTextChange}
                placeholder="Start typing here..."
                className="h-full min-h-[500px] rounded-none border-0 resize-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden bg-card rounded border">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Chat</CardTitle>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {users.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="px-2 py-0"
                  >
                    {user.username}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      msg.sender === username ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === username
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender !== username && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(msg.sender)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs font-medium">
                          {msg.sender}
                        </span>
                        <span className="text-xs opacity-70 ml-auto">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            <CardFooter className="border-t p-2">
              <form className="flex w-full gap-2" onSubmit={handleSendMessage}>
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!connected}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!connected}>
                  Send
                </Button>
              </form>
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
