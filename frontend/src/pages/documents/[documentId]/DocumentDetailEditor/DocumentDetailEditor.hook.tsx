import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Shadcn UI components
import { setEditorContent } from "@/lib/rtk/slices/documentDetailSlice";
import { useRtk } from "@/lib/rtk/store";
import { TabExtension } from "@/lib/tiptap/TabExtension";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDispatch } from "react-redux";
import { useDocumentDetailSocket } from "../DocumentDetail.context";

interface Delta {
  insert?: string;
  delete?: number;
  position?: number;
}

const useDocumentDetailEditor = () => {
  const dispatch = useDispatch();
  const { sectionId } = useParams<{ sectionId: string }>();
  const isSocketConnected = useRtk(
    (state) => state.documentDetail.isSocketConnected
  );
  const users = useRtk((state) => state.documentDetail.users);
  const content = useRtk((state) => state.documentDetail.editorContent);

  const { socket } = useDocumentDetailSocket();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
      TabExtension,
    ],
    autofocus: true,
    content: content,
    onUpdate: ({ editor, transaction }) => {
      const newContent = editor.getHTML();

      // Calculate delta from transaction if possible
      let delta: Delta | undefined = undefined;
      try {
        if (transaction.steps.length > 0) {
          // For now we'll use full content, but in a real implementation
          // you could extract deltas from transaction steps
          // This requires more complex processing
        }
      } catch (error) {
        console.error("Error calculating delta:", error);
      }

      // Send updates to server - prefer delta when possible
      if (content !== newContent && socket) {
        dispatch(setEditorContent(newContent));

        if (delta) {
          // Send delta for efficient updates
          socket.emit("text-change", { delta, roomId: sectionId });
        } else {
          // Fallback to full content
          socket.emit("text-change", {
            content: newContent,
            roomId: sectionId,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on("text-change", onServerTextChanged);

    socket.on("document-state", onServerGetDocument);

    return () => {
      socket.off("text-change");
      socket.off("document-state");
    };
  }, [socket, isSocketConnected]);

  const onServerTextChanged = (data: {
    content?: string;
    delta?: Delta;
    sender: string;
  }) => {
    if (data.sender !== socket?.id) {
      try {
        // Handle receiving full content
        if (data.content) {
          editor?.commands.setContent(data.content, false);
          dispatch(setEditorContent(data.content));
        }
        // Handle receiving delta
        else if (data.delta) {
          const newContent = applyDelta(content, data.delta);
          editor?.commands.setContent(newContent, false);
          dispatch(setEditorContent(newContent));
        }
      } catch (error) {}
    }
  };
  const onServerGetDocument = (data: { content: string }) => {
    if (data.content) {
      editor?.commands.setContent(data.content, false);
      dispatch(setEditorContent(data.content));
    }
  };

  function applyDelta(content: string, delta: Delta): string {
    if (!delta) {
      return content;
    }

    try {
      if (delta.insert !== undefined) {
        // Make sure position is defined, default to 0 if not
        const pos = typeof delta.position === "number" ? delta.position : 0;

        // Ensure pos is within bounds
        const safePos = Math.min(Math.max(0, pos), content.length);

        return (
          content.substring(0, safePos) +
          delta.insert +
          content.substring(safePos)
        );
      } else if (delta.delete !== undefined) {
        // Make sure position is defined, default to end if not
        const pos =
          typeof delta.position === "number" ? delta.position : content.length;

        // Ensure pos and length are within bounds
        const safePos = Math.min(Math.max(0, pos), content.length);
        const safeLength = Math.min(delta.delete, content.length - safePos);

        return (
          content.substring(0, safePos) +
          content.substring(safePos + safeLength)
        );
      } else if (typeof delta === "string") {
        console.warn(
          "Received string delta instead of object, replacing content"
        );
        return delta;
      } else {
        console.warn("Unhandled delta format:", delta);
        return content;
      }
    } catch (error) {
      console.error("Error applying delta:", error, delta);
      return content;
    }
  }

  return {
    editor,
    users,
  };

  return {};
};

export default useDocumentDetailEditor;
