// src/components/MenuBar.jsx
import React from "react";

export default function MenuBar({ editor }) {
  if (!editor) return null;

  // A helper to generate Tailwind classes for each button based on active state
  const buttonClass = (isActive) => {
    let base =
      "px-2 py-1 border rounded mr-1 transition-colors duration-200 text-sm";
    if (isActive) {
      // Active format -> highlight
      base += " bg-blue-500 text-white border-blue-500";
    } else {
      // Inactive format -> normal
      base += " bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
    }
    return base;
  };

  return (
    <div className="border-b p-2 flex items-center bg-gray-50">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().toggleBold()}
        className={buttonClass(editor.isActive("bold"))}
      >
        B
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().toggleItalic()}
        className={buttonClass(editor.isActive("italic"))}
      >
        I
      </button>

      {/* Paragraph */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive("paragraph"))}
      >
        P
      </button>

      {/* Heading 2 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>

      {/* Heading 3 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
      >
        H3
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        • Bullet
      </button>

      {/* Numbered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        # Numbered
      </button>
    </div>
  );
}
