// src/pages/festival/ReviewPage.tsx
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import {
  getAllFestivalReviews,
  toggleReviewLike,
  createReviewComment,
  updateReviewComment,
  deleteReviewComment,
  updateFestivalReview,
  deleteFestivalReview,
} from "../../services/festivalReview";
import ReviewItem from "../../components/review/ReviewItem";
import type { FestivalReview } from "../../types/festivalReview";

export default function ReviewPage() {
  const { user } = useAuthStore();

  const [reviews, setReviews] = useState<FestivalReview[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------
  // 🔥 리뷰 목록 불러오기
  // --------------------------------------
  const load = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const list = await getAllFestivalReviews(page);

      if (list.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prev) => [...prev, ...list]);
      }
    } catch (error) {
      console.error("리뷰 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  // --------------------------------------
  // 🔥 스크롤 감지 → 다음 페이지 요청
  // --------------------------------------
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const t = entries[0];
        if (t.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  // --------------------------------------
  // 🔥 좋아요
  // --------------------------------------
  const handleToggleLike = async (reviewId: number) => {
    try {
      await toggleReviewLike(reviewId);

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                liked: !r.liked,
                likeCount: r.liked ? r.likeCount - 1 : r.likeCount + 1,
              }
            : r,
        ),
      );
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  // --------------------------------------
  // 🔥 댓글 작성
  // --------------------------------------
  const handleCreateComment = async (reviewId: number, content: string) => {
    try {
      const newComment = await createReviewComment(reviewId, content);

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, comments: [...r.comments, newComment] } : r)),
      );
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  // --------------------------------------
  // 🔥 댓글 수정
  // --------------------------------------
  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await updateReviewComment(commentId, content);

      setReviews((prev) =>
        prev.map((r) => ({
          ...r,
          comments: r.comments.map((c) => (c.commentId === commentId ? { ...c, content } : c)),
        })),
      );
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  // --------------------------------------
  // 🔥 댓글 삭제
  // --------------------------------------
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteReviewComment(commentId);

      setReviews((prev) =>
        prev.map((r) => ({
          ...r,
          comments: r.comments.filter((c) => c.commentId !== commentId),
        })),
      );
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  // --------------------------------------
  // 🔥 리뷰 수정
  // --------------------------------------
  const handleUpdateReview = async (reviewId: number, rating: number, content: string) => {
    try {
      await updateFestivalReview(reviewId, rating, content);

      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, rating, content } : r)));

      setEditingId(null);
    } catch (error) {
      console.error("리뷰 수정 실패:", error);
    }
  };

  // --------------------------------------
  // 🔥 리뷰 삭제
  // --------------------------------------
  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteFestivalReview(reviewId);

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
    }
  };

  // --------------------------------------
  // 🔥 화면 렌더링
  // --------------------------------------
  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="mb-4 text-2xl font-bold">축제 커뮤니티</h1>

      <div className="space-y-6">
        {reviews.map((rev) => (
          <ReviewItem
            key={rev.id}
            review={rev}
            currentUserName={user?.name ?? null}
            isMine={user?.name === rev.userName}
            isEditing={editingId === rev.id}
            isCommunityPage={true}
            setIsEditing={(v) => setEditingId(v ? rev.id : null)}
            onUpdate={(rating, content) => handleUpdateReview(rev.id, rating, content)}
            onDelete={() => handleDeleteReview(rev.id)}
            onToggleLike={handleToggleLike}
            onCreateComment={handleCreateComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        ))}
      </div>

      <div ref={observerRef} className="h-10"></div>

      {loading && <p className="mt-4 text-center text-gray-500">불러오는 중...</p>}
      {!hasMore && <p className="mt-4 text-center text-gray-400">모든 리뷰를 불러왔습니다.</p>}
    </div>
  );
}
