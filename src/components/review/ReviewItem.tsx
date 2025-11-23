// src/components/review/ReviewItem.tsx

import { useState } from "react";
import { HandThumbUpIcon, StarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import type { FestivalReview } from "../../types/festivalReview";
import CommentList from "./CommentList";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ReviewItemProps {
  review: FestivalReview;
  currentUserName: string | null;
  isMine: boolean;
  isEditing: boolean;
  isCommunityPage?: boolean;
  setIsEditing?: (value: boolean) => void;

  onUpdate?: (rating: number, content: string) => void;
  onDelete?: () => void;
  onToggleLike: (reviewId: number) => void;

  onCreateComment: (reviewId: number, content: string) => void;
  onUpdateComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function ReviewItem({
  review,
  currentUserName,
  isMine,
  isEditing,
  isCommunityPage = false,
  setIsEditing,
  onUpdate,
  onDelete,
  onToggleLike,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}: ReviewItemProps) {
  const navigate = useNavigate();

  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);

  const categoryLabel =
    review.type === "MATE" ? "같이 가요" : review.type === "TIP" ? "팁" : "후기";

  const isCommentOwner = (userName: string) =>
    currentUserName != null && currentUserName === userName;

  /** 🔥 별 렌더링 공용 함수 */
  const renderStars = (count: number, size: "sm" | "md" = "md") =>
    Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={
          i < count
            ? `${size === "md" ? "h-6 w-6" : "h-5 w-5"} text-yellow-400`
            : `${size === "md" ? "h-6 w-6" : "h-5 w-5"} text-gray-300`
        }
      />
    ));

  const handleSaveEdit = () => {
    if (!onUpdate) return;
    onUpdate(editRating, editContent);
  };

  const handleCancelEdit = () => {
    setEditRating(review.rating);
    setEditContent(review.content);
    setIsEditing?.(false);
  };

  return (
    <div className="bg-zwhite rounded-2xl border p-5 shadow-sm">
      {/* ================================
          유저 정보 + 카테고리
      ================================== */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700">
            {review.userName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold">{review.userName}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>

            {/* 🔥 별점 표시 (수정모드 아닐 때) */}
            {!isEditing && (
              <div className="mt-1 flex items-center gap-1">{renderStars(review.rating, "sm")}</div>
            )}
          </div>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {categoryLabel}
        </span>
      </div>

      {/* ================================
          제목
      ================================== */}
      <h3 className="mt-4 text-lg font-bold">{review.festivalName}</h3>

      {/* ================================
          본문 or 수정 모드
      ================================== */}
      {!isEditing && (
        <p className="mt-2 rounded-xl border border-gray-400 px-2 py-2 whitespace-pre-line text-gray-800">
          {review.content}
        </p>
      )}

      {isEditing && isMine && (
        <div className="mt-3">
          {/* ⭐ 수정 모드 별점 */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`h-7 w-7 cursor-pointer ${
                  i < editRating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setEditRating(i + 1)}
              />
            ))}
          </div>

          {/* 내용 수정 */}
          <textarea
            className="mt-3 w-full rounded-lg border p-2 text-sm"
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white"
            >
              수정 완료
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 rounded-lg bg-gray-300 py-2 text-sm font-semibold"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* ================================
            내 리뷰 수정/삭제 아이콘 버튼
        ================================ */}
      {isMine && !isEditing && (
        <div className="mt-3 flex items-center justify-end gap-3">
          {/* 수정 */}
          <button
            onClick={() => setIsEditing?.(true)}
            className="rounded-full p-2 transition hover:bg-gray-100"
            title="수정하기"
          >
            <PencilSquareIcon className="h-5 w-5 text-[#0F079F]" />
          </button>

          {/* 삭제 */}
          <button
            onClick={onDelete}
            className="rounded-full p-2 transition hover:bg-red-50"
            title="삭제하기"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
          </button>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        {/* ================================
          좋아요 + 댓글 수
      ================================== */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <button onClick={() => onToggleLike(review.id)} className="flex items-center gap-1">
            <HandThumbUpIcon
              className={`h-5 w-5 ${review.liked ? "text-blue-600" : "text-gray-400"}`}
            />
            {review.likeCount}
          </button>

          <div className="flex items-center gap-1">
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            {review.comments.length}
          </div>
        </div>
        <div>
          {/* ================================
          축제 보러가기 (커뮤니티 전용)
      ================================== */}
          {isCommunityPage && (
            <button
              onClick={() => navigate(`/festival/${review.festivalId}`)}
              className="mt-4 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 py-3 text-center text-xs text-white shadow-md hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 md:mt-0"
            >
              축제 보러가기
            </button>
          )}
        </div>
      </div>

      {/* ================================
          댓글 목록 & 작성
      ================================== */}
      <div className="mt-4 border-t pt-4">
        <CommentList
          reviewId={review.id}
          comments={review.comments}
          isCommentOwner={isCommentOwner}
          onCreateComment={onCreateComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      </div>
    </div>
  );
}
