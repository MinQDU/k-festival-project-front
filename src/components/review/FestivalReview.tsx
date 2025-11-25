// src/components/festival/FestivalReview.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import {
  getFestivalReviews,
  createFestivalReview,
  updateFestivalReview,
  deleteFestivalReview,
  toggleReviewLike,
  createReviewComment,
  updateReviewComment,
  deleteReviewComment,
} from "../../services/festivalReview";

import type { FestivalReview } from "../../types/festivalReview";
import { useAuthStore } from "../../stores/authStore";
import { handleApiError } from "../../services/handleApiError";

import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";

interface Props {
  festivalId: number;
}

// AxiosError 타입 가드
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

export default function FestivalReview({ festivalId }: Props) {
  const navigate = useNavigate();

  const { user, accessToken } = useAuthStore();

  const [reviews, setReviews] = useState<FestivalReview[]>([]);
  const [myReview, setMyReview] = useState<FestivalReview | null>(null);
  const [isEditingMyReview, setIsEditingMyReview] = useState(false);

  const currentUserName = user?.name ?? null;

  // --------------------------
  // 리뷰 전체 로드
  // --------------------------
  const loadReviews = async () => {
    if (!festivalId) return;

    try {
      const list = await getFestivalReviews(festivalId);
      setReviews(list);

      // 내 리뷰 찾기: userName 기준
      const mine =
        currentUserName != null ? (list.find((r) => r.userName === currentUserName) ?? null) : null;
      setMyReview(mine);
      setIsEditingMyReview(false);
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  useEffect(() => {
    void loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [festivalId, currentUserName]);

  // --------------------------
  // 리뷰 작성
  // --------------------------
  const handleCreateReview = async (
    rating: number,
    content: string,
    type: "REVIEW" | "TIP" | "MATE",
  ) => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      await createFestivalReview(festivalId, rating, content, type);
      await loadReviews();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        // 이미 작성한 리뷰가 존재
        alert("이미 작성한 리뷰가 존재합니다.");
        await loadReviews();
      } else {
        handleApiError(err, navigate);
      }
    }
  };

  // --------------------------
  // 내 리뷰 수정
  // --------------------------
  const handleUpdateMyReview = async (
    rating: number,
    content: string,
    type: "REVIEW" | "TIP" | "MATE",
  ) => {
    if (!myReview) return;

    try {
      await updateFestivalReview(myReview.id, rating, content, type);
      await loadReviews();
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  // --------------------------
  // 내 리뷰 삭제
  // --------------------------
  const handleDeleteMyReview = async () => {
    if (!myReview) return;

    const ok = window.confirm("작성한 후기를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteFestivalReview(myReview.id);
      await loadReviews();
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  // --------------------------
  // 리뷰 좋아요
  // --------------------------
  const handleToggleLike = async (reviewId: number) => {
    try {
      await toggleReviewLike(reviewId);
      await loadReviews();
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  // --------------------------
  // 댓글 작성
  // --------------------------
  const handleCreateComment = async (reviewId: number, content: string) => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      await createReviewComment(reviewId, content);
      await loadReviews();
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  // --------------------------
  // 댓글 수정
  // --------------------------
  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await updateReviewComment(commentId, content);
      await loadReviews();
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  // --------------------------
  // 댓글 삭제
  // --------------------------
  const handleDeleteComment = async (commentId: number) => {
    const ok = window.confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteReviewComment(commentId);
      await loadReviews();
    } catch (err) {
      handleApiError(err, navigate);
    }
  };

  const otherReviews = reviews.filter((r) => r.id !== myReview?.id);

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-xl font-semibold">축제 후기</h2>

      {/* 내 리뷰 영역 */}
      {myReview && (
        <ReviewItem
          key={myReview.id}
          review={myReview}
          isMine
          currentUserName={currentUserName}
          isEditing={isEditingMyReview}
          isCommunityPage={false}
          setIsEditing={setIsEditingMyReview}
          onUpdate={handleUpdateMyReview}
          onDelete={handleDeleteMyReview}
          onToggleLike={handleToggleLike}
          onCreateComment={handleCreateComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
        />
      )}

      {/* 내 리뷰 없는 경우: 작성 폼 */}
      {!myReview && accessToken && (
        <div className="mb-6">
          <ReviewForm mode="create" onSubmit={handleCreateReview} />
        </div>
      )}

      {!accessToken && (
        <p className="mt-2 text-sm text-gray-500">로그인 후 후기를 작성할 수 있습니다.</p>
      )}

      {/* 다른 사람 리뷰 리스트 */}
      <div className="mt-6 space-y-4">
        {otherReviews.map((review, idx) => (
          <ReviewItem
            key={idx}
            review={review}
            isMine={false}
            currentUserName={currentUserName}
            isEditing={false}
            isCommunityPage={false}
            onToggleLike={handleToggleLike}
            onCreateComment={handleCreateComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        ))}

        {reviews.length === 0 && <p className="text-gray-500">아직 작성된 후기가 없습니다.</p>}
      </div>
    </div>
  );
}
