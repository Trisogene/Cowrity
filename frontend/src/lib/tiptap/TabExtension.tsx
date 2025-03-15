import { Extension } from "@tiptap/core";

export const TabExtension = Extension.create({
  name: "tabHandler",

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Insert 4 spaces when Tab is pressed
        editor.commands.insertContent("    ");
        // Return true to prevent the default tab behavior
        return true;
      },
    };
  },
});
