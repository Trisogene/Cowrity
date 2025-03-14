import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Code,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import useDocumentDetailEditor from "./DocumentDetailEditor.hook";

const DocumentDetailEditor = () => {
  const { content, handleTextChange, users, socket, sectionId } =
    useDocumentDetailEditor();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (handleTextChange) {
        handleTextChange({
          target: { value: newContent },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      }

      if (socket) {
        // Send change to server
        socket.emit("text-change", {
          content: newContent,
          roomId: sectionId,
        });
      }
    },
  });

  return (
    <div className="col-span-2 flex flex-col">
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-card border rounded">
        <div className="py-3 px-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Document</CardTitle>
            <Badge variant="outline">
              {users?.length} user{users?.length !== 1 ? "s" : ""} online
            </Badge>
          </div>
        </div>

        <div className="border-b p-2 flex flex-wrap gap-1">
          <Button
            size="sm"
            variant={editor?.isActive("bold") ? "default" : "outline"}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4 " />
          </Button>
          <Button
            size="sm"
            variant={editor?.isActive("italic") ? "default" : "outline"}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={
              editor?.isActive("heading", { level: 2 }) ? "default" : "outline"
            }
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={
              editor?.isActive("heading", { level: 3 }) ? "default" : "outline"
            }
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor?.isActive("bulletList") ? "default" : "outline"}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor?.isActive("orderedList") ? "default" : "outline"}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor?.isActive("codeBlock") ? "default" : "outline"}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={editor?.isActive("blockquote") ? "default" : "outline"}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().chain().focus().undo().run()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-0 h-full flex-1 overflow-hidden">
          <EditorContent
            autoFocus
            editor={editor}
            className="h-full min-h-full prose dark:prose-invert max-w-none p-4 focus-visible:outline-none overflow-y-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailEditor;
