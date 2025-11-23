// src/components/festival/CommentForm.tsx

import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState<string>("");

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    onSubmit(trimmed);
    setContent("");
  };

  return (
    <div className="mt-2 flex gap-2">
      <textarea
        className="flex-1 rounded-lg border p-2 text-xs"
        rows={2}
        placeholder="댓글을 입력해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="h-full rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white"
      >
        등록
      </button>
    </div>
  );
}
