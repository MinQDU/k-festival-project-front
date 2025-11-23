// src/components/festival/CommentItem.tsx

import { useState } from "react";
import type { FestivalReviewComment } from "../../types/festivalReview";

interface CommentItemProps {
  comment: FestivalReviewComment;
  isMine: boolean;
  onUpdateComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  isMine,
  onUpdateComment,
  onDeleteComment,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(comment.content);

  const handleSave = () => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      alert("내용을 입력해주세요.");
      return;
    }
    onUpdateComment(comment.commentId, trimmed);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteComment(comment.commentId);
  };

  return (
    <div className="rounded-lg bg-gray-50 p-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-800">{comment.userName}</span>
        <span className="text-[10px] text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {!isEditing && <p className="mt-1 whitespace-pre-line text-gray-800">{comment.content}</p>}

      {isEditing && (
        <textarea
          className="mt-1 w-full rounded border p-1 text-xs"
          rows={2}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      )}

      {isMine && (
        <div className="mt-1 flex gap-2">
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[11px] text-blue-600"
              >
                수정
              </button>
              <button type="button" onClick={handleDelete} className="text-[11px] text-red-500">
                삭제
              </button>
            </>
          )}

          {isEditing && (
            <>
              <button type="button" onClick={handleSave} className="text-[11px] text-blue-600">
                완료
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
                className="text-[11px] text-gray-500"
              >
                취소
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
