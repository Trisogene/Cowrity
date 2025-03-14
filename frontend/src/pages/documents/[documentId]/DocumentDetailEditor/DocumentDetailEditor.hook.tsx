import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn UI components
import { useRtk } from "@/lib/rtk/store";
import { MOCK_DOCUMENTS } from "@/pages/Dashboard/DashboardDocuments/DashboardDocumentsGrid/DashboardDocumentsGrid.mock";
import { useDocumentDetailSocket } from "../DocumentDetail.context";

interface Delta {
  insert?: string;
  delete?: number;
  position?: number;
}

const useDocumentDetailEditor = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const isSocketConnected = useRtk(
    (state) => state.documentDetail.isSocketConnected
  );
  const [username, setUsername] = useState("");
  const users = useRtk((state) => state.documentDetail.users);
  const [content, setContent] = useState("");

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lastSelectionRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const { socket } = useDocumentDetailSocket();

  // Setup event listeners once socket is connected
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

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

    // Clean up event listeners
    return () => {
      socket.off("text-change");
      socket.off("document-state");
    };
  }, [socket, isSocketConnected]);

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

  return {
    sectionId,
    content,
    socket,
    isSocketConnected,
    username,
    setUsername,
    users,
    editorRef,
    handleTextChange,
    formatTime,
    getUserInitials,
    documentName,
  };

  return {};
};

export default useDocumentDetailEditor;
