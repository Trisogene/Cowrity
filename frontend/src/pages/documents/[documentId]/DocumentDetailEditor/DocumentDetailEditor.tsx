import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { EditorContent } from "@tiptap/react";
import { entries } from "lodash";
import { Redo, Undo } from "lucide-react";
import { EDITOR_TOOLBAR_OPTIONS } from "./DocumentDetailEditor.conf";
import useDocumentDetailEditor from "./DocumentDetailEditor.hook";

const DocumentDetailEditor = () => {
  const { editor, users } = useDocumentDetailEditor();

  if (!editor) return null;

  return (
    <div className="md:col-span-2 sm:col-span-1 flex flex-col max-w-full max-h-full overflow-hidden">
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-card border rounded max-w-full">
        <div className="py-3 px-4 border-b max-w-full">
          <div className="flex justify-between items-center">
            <CardTitle>Document</CardTitle>
            <Badge variant="outline">
              {users?.length} user{users?.length !== 1 ? "s" : ""} online
            </Badge>
          </div>
        </div>

        <div className="border-b p-2 flex flex-wrap gap-1 max-w-full">
          {entries(EDITOR_TOOLBAR_OPTIONS).map(([optionId, option]) => (
            <Button
              key={optionId}
              size="sm"
              variant={option.isActive(editor) ? "default" : "outline"}
              onClick={() => option.onClick(editor)}
              disabled={option.disabled(editor)}
              className="h-8 w-8 p-0"
            >
              {option.icon}
            </Button>
          ))}

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

        <div className="p-0 h-full flex-1  max-w-full overflow-auto">
          <EditorContent
            autoFocus
            editor={editor}
            className="h-full min-h-full prose dark:prose-invert max-w-none p-0 focus-visible:outline-none overflow-y-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailEditor;
