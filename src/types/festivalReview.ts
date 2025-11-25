export interface FestivalReviewCommentRequest {
  content: string;
}

export interface FestivalReviewRequest {
  rating: number;
  content: string;
  type: "REVIEW" | "TIP" | "MATE";
}

export interface FestivalReviewComment {
  commentId: number;
  reviewId: number;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface FestivalReview {
  id: number;
  festivalId: number;
  festivalName: string;
  userName: string;
  rating: number;
  content: string;
  type: "REVIEW" | "TIP" | "MATE"; // 후기, 팁, 같이가요
  likeCount: number;
  liked: boolean;
  createdAt: string;
  comments: FestivalReviewComment[];
}
