import { axios } from "./axios";
import type { FestivalReview, FestivalReviewComment } from "../types/festivalReview";

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
  rating: number,
  content: string,
  type: "REVIEW" | "TIP" | "MATE",
) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/${festivalId}/reviews`, null, {
    params: { rating, content, type },
  });
  return res.data;
};

// ------ 리뷰 수정 ------
export const updateFestivalReview = async (
  reviewId: number,
  rating: number,
  content: string,
  type: "REVIEW" | "TIP" | "MATE",
) => {
  const res = await axios.put(`${API_BASE_URL}/app/festival/reviews/${reviewId}`, null, {
    params: { rating, content, type },
  });
  console.log("리뷰 수정 요청 데이터:", { reviewId, rating, content, type });
  console.log("리뷰 수정 응답:", res.data);
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

export const createReviewComment = async (reviewId: number, content: string) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/reviews/${reviewId}/comments`, {
    content,
  });
  return res.data;
};

// ------ 댓글 수정 ------
export const updateReviewComment = async (commentId: number, content: string) => {
  const res = await axios.put(`${API_BASE_URL}/app/festival/review-comments/${commentId}`, {
    content,
  });
  return res.data;
};

// ------ 댓글 삭제 ------
export const deleteReviewComment = async (commentId: number) => {
  const res = await axios.delete(`${API_BASE_URL}/app/festival/review-comments/${commentId}`);
  return res.data;
};
