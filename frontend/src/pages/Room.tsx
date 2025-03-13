import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "./Room.css";

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

const Room: React.FC = () => {
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

    // This is a simplified approach. In a real app, you'd compute the actual delta
    // by comparing old and new content
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

  // If not joined, show join form
  if (!isJoined) {
    return (
      <div className="join-container">
        <div className="join-card">
          <h1>Join Collaboration Room</h1>
          <h2>Room: {sectionId}</h2>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit" disabled={!connected}>
              {connected ? "Join Room" : "Connecting..."}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main room view
  return (
    <div className="room-container">
      <div className="room-header">
        <h1>Room: {sectionId}</h1>
        <div className="room-status">
          <span
            className={`status-indicator ${connected ? "online" : "offline"}`}
          />
          {connected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div className="room-content">
        <div className="editor-container">
          <div className="editor-header">
            <h2>Document</h2>
            <div className="user-count">{users.length} users online</div>
          </div>
          <textarea
            ref={editorRef}
            className="text-editor"
            value={content}
            onChange={handleTextChange}
            placeholder="Start typing here..."
          />
        </div>

        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat</h2>
            <div className="user-list">
              {users.map((user) => (
                <div key={user.id} className="user-pill">
                  {user.username}
                </div>
              ))}
            </div>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === username ? "my-message" : "other-message"
                }`}
              >
                <div className="message-header">
                  <span className="message-sender">{msg.sender}</span>
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!connected}
            />
            <button type="submit" disabled={!connected}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Room;
