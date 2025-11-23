// src/types/festivalJob.ts

export type ApplyStatus = "APPLIED" | "ACCEPTED" | "REJECTED" | "NONE";

export interface JobCreateRequest {
  title: string;
  shortDesc?: string | null;
  detailDesc?: string | null;
  hourlyPay?: number | null;
  workTime?: string | null;
  workPeriod?: string | null;
  preference: string[];
  isCertified: boolean;
  deadline?: string | null; // LocalDate (YYYY-MM-DD)
}

export interface JobApplyRequest {
  name: string;
  gender?: string | null;
  age?: number | null;
  location?: string | null;
  introduction?: string | null;
  career?: string | null;
}

export interface JobResponse {
  jobId: number;
  festivalId: number;
  employerUid: string;
  title: string;
  shortDesc?: string | null;
  detailDesc?: string | null;
  hourlyPay?: number | null;
  workTime?: string | null;
  workPeriod?: string | null;
  preference: string[];
  isCertified: boolean;
  isOpen: boolean;
  status: "APPLIED" | "ACCEPTED" | "REJECTED" | "NONE";
  deadline?: string | null;
  applicantCount: number;
  hiredCount: number;
  alreadyApplied?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface JobApplyResponse {
  applyId: number;
  jobId: number;
  applicantUid: string;
  name?: string | null;
  gender?: string | null;
  age?: number | null;
  location?: string | null;
  introduction?: string | null;
  career?: string | null;
  status: ApplyStatus;
  isRead: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}
