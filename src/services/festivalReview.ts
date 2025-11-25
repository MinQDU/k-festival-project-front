import { axios } from "./axios";
import type { FestivalReview, FestivalReviewComment, FestivalReviewRequest, FestivalReviewCommentRequest } from "../types/festivalReview";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getAllFestivalReviews = async (page: number): Promise<FestivalReview[]> => {
  const res = await axios.get(`${API_BASE_URL}/app/festival/reviews?page=${page}`);
  return res.data;
};
// ------ 리뷰 리스트 ------
export const getFestivalReviews = async (festivalId: number): Promise<FestivalReview[]> => {
  const res = await axios.get(`${API_BASE_URL}/app/festival/${festivalId}/reviews`);
  return res.data;
};

// ------ 리뷰 작성 ------
export const createFestivalReview = async (
  festivalId: number,
  festivalReviewRequest: FestivalReviewRequest
) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/${festivalId}/reviews`, festivalReviewRequest);
  return res.data;
};
``
// ------ 리뷰 수정 ------
export const updateFestivalReview = async (
  reviewId: number,
  festivalReviewRequest: FestivalReviewRequest
) => {
  const res = await axios.put(`${API_BASE_URL}/app/festival/reviews/${reviewId}`, festivalReviewRequest);
  return res.data;
};

// ------ 리뷰 삭제 ------
export const deleteFestivalReview = async (reviewId: number) => {
  const res = await axios.delete(`${API_BASE_URL}/app/festival/reviews/${reviewId}`);
  return res.data;
};

// ------ 리뷰 좋아요 ------
export const toggleReviewLike = async (reviewId: number) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/reviews/${reviewId}/like`);
  return res.data;
};

// ------ 댓글 리스트 ------
export const getReviewComments = async (reviewId: number): Promise<FestivalReviewComment[]> => {
  const res = await axios.get(`${API_BASE_URL}/app/festival/reviews/${reviewId}/comments`);
  return res.data;
};

// ------ 댓글 작성 ------
export const createReviewComment = async (reviewId: number, festivalReviewCommentRequest: FestivalReviewCommentRequest) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/reviews/${reviewId}/comments`, festivalReviewCommentRequest);
  return res.data;
};

// ------ 댓글 수정 ------
export const updateReviewComment = async (commentId: number, festivalReviewCommentRequest: FestivalReviewCommentRequest) => {
  const res = await axios.put(`${API_BASE_URL}/app/festival/review-comments/${commentId}`, festivalReviewCommentRequest);
  return res.data;
};

// ------ 댓글 삭제 ------
export const deleteReviewComment = async (commentId: number) => {
  const res = await axios.delete(`${API_BASE_URL}/app/festival/review-comments/${commentId}`);
  return res.data;
};
