// src/services/festivalJob.ts
import { axios } from "./axios";
import type {
  JobResponse,
  JobApplyRequest,
  JobCreateRequest,
  JobApplyResponse,
} from "../types/festivalJob";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 마감 임박 알바 리스트
export const getUrgentJobs = async (page = 1): Promise<JobResponse[]> => {
  const res = await axios.get<JobResponse[]>(`${API_BASE_URL}/app/festival/job/list`, {
    params: { page },
  });
  return res.data;
};

// 알바 공고 생성 (고용주)
export const createJob = async (
  festivalId: number,
  payload: JobCreateRequest,
): Promise<JobResponse> => {
  const res = await axios.post<JobResponse>(
    `${API_BASE_URL}/app/festival/job/${festivalId}/create`,
    payload,
  );
  return res.data;
};

// 공고 수정
export const updateJob = async (jobId: number, payload: JobCreateRequest): Promise<JobResponse> => {
  const res = await axios.put<JobResponse>(`${API_BASE_URL}/app/festival/job/${jobId}`, payload);
  return res.data;
};

// 공고 삭제
export const deleteJob = async (jobId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/app/festival/job/${jobId}`);
};

// ==================== 지원자 측 ====================

// 지원하기
export const applyJob = async (jobId: number, payload: JobApplyRequest) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/job/${jobId}/apply`, payload);
  return res.data;
};

// 지원 내용 수정
export const updateJobApply = async (jobId: number, payload: JobApplyRequest) => {
  const res = await axios.put(`${API_BASE_URL}/app/festival/job/${jobId}/apply`, payload);
  return res.data;
};

// 지원 취소
export const cancelJobApply = async (jobId: number) => {
  await axios.delete(`${API_BASE_URL}/app/festival/job/${jobId}/apply`);
};

// ==================== 고용주 측 ====================

// 지원자 리스트
export const getJobApplicants = async (jobId: number): Promise<JobApplyResponse[]> => {
  const res = await axios.get<JobApplyResponse[]>(
    `${API_BASE_URL}/app/festival/job/${jobId}/applicants`,
  );
  return res.data;
};

// 로그인 유저 정보 기반 분기 처리용
export const getApplicantsVisibleToUser = async (
  jobId: number,
  employerUid: string,
  currentUid: string | null,
): Promise<JobApplyResponse[]> => {
  const list = await getJobApplicants(jobId);

  // 고용주 → 전체 지원자
  if (currentUid && currentUid === employerUid) {
    return list;
  }

  // 지원자 → 본인 정보만
  if (currentUid) {
    return list.filter((x) => x.applicantUid === currentUid);
  }

  // 비로그인 → 아무것도 리턴 X
  return [];
};

// 지원자 수락
export const acceptJobApplicant = async (applyId: number) => {
  const res = await axios.post(`${API_BASE_URL}/app/festival/job/apply/${applyId}/accept`, {
    applyId,
  });
  return res.data;
};
