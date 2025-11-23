// src/components/festival/CommentList.tsx

import type { FestivalReviewComment } from "../../types/festivalReview";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface CommentListProps {
  reviewId: number;
  comments: FestivalReviewComment[];
  isCommentOwner: (userName: string) => boolean;
  onCreateComment: (reviewId: number, content: string) => void;
  onUpdateComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function CommentList({
  reviewId,
  comments,
  isCommentOwner,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}: CommentListProps) {
  const handleSubmitComment = (content: string) => {
    onCreateComment(reviewId, content);
  };

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-gray-800">댓글 {comments.length}</h4>

      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            isMine={isCommentOwner(comment.userName)}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
          />
        ))}

        {comments.length === 0 && <p className="text-xs text-gray-500">아직 댓글이 없습니다.</p>}
      </div>

      <div className="mt-3">
        <CommentForm onSubmit={handleSubmitComment} />
      </div>
    </div>
  );
}
