import { Editor } from "@tiptap/react";
import { Bold, Italic, List } from "lucide-react";

export const EDITOR_TOOLBAR_OPTIONS = {
  bold: {
    icon: <Bold className="h-4 w-4 " />,
    isActive: (editor: Editor) => editor.isActive("bold"),
    onClick: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    disabled: (editor: Editor) =>
      !editor.can().chain().focus().toggleBold().run(),
  },
  italic: {
    icon: <Italic className="h-4 w-4" />,
    isActive: (editor: Editor) => editor.isActive("italic"),
    onClick: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    disabled: (editor: Editor) =>
      !editor.can().chain().focus().toggleItalic().run(),
  },
  bulletList: {
    icon: <List className="h-4 w-4" />,
    isActive: (editor: Editor) => editor.isActive("bulletList"),
    onClick: (editor: Editor) =>
      editor.chain().focus().toggleBulletList().run(),
    disabled: (editor: Editor) =>
      !editor.can().chain().focus().toggleBulletList().run(),
  },
};
