// src/components/MyTipTapEditor.jsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MenuBar from "./MenuBar";

export default function MyTipTapEditor({ initialContent, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
  });

  if (!editor) return <div>Loading Editor...</div>;

  return (
    <div>
      {/* Our custom toolbar */}
      <MenuBar editor={editor} />

      {/* The main editable area, with a permanent border & padding */}
      <EditorContent
        editor={editor}
        className="border border-gray-300 p-4 min-h-[300px] rounded-b"
      />
    </div>
  );
}
