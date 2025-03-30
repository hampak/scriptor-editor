import React, { useRef, useState } from "react";

interface ScriptorEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const ScriptorEditor: React.FC<ScriptorEditorProps> = ({
  initialContent = "",
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState<string>(initialContent);

  const handleBlur = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onChange?.(newContent);
    }
  };

  const applyFormat = (tag: "b" | "i" | "u") => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const newElement = document.createElement(tag);
    newElement.appendChild(selectedText);
    range.insertNode(newElement);

    // Move selection after the inserted node
    range.setStartAfter(newElement);
    range.setEndAfter(newElement);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update state after applying formatting
    handleBlur();
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => applyFormat("b")}>Bold</button>
        <button onClick={() => applyFormat("i")}>Italic</button>
        <button onClick={() => applyFormat("u")}>Underline</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default ScriptorEditor;
