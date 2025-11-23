// src/components/festival/ReviewForm.tsx

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface ReviewFormProps {
  mode: "create";
  onSubmit: (rating: number, content: string) => void;
}

export default function ReviewForm({ mode, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  const handleSubmit = () => {
    if (rating <= 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    onSubmit(rating, content.trim());
    setRating(0);
    setContent("");
  };

  return (
    <div className="rounded-xl bg-gray-100 p-4">
      <h3 className="mb-3 text-lg font-semibold">
        {mode === "create" ? "후기 작성" : "후기 수정"}
      </h3>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-6 w-6 cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => setRating(i + 1)}
          />
        ))}
      </div>

      <textarea
        className="mt-3 w-full rounded-lg border p-2 text-sm"
        rows={4}
        placeholder="후기를 입력해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white"
      >
        {mode === "create" ? "후기 작성하기" : "수정 완료"}
      </button>
    </div>
  );
}
