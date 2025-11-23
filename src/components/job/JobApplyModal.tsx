// src/components/job/JobApplyModal.tsx
import { useState, useEffect } from "react";
import type { JobApplyRequest, JobResponse, JobApplyResponse } from "../../types/festivalJob";
import {
  applyJob,
  updateJobApply,
  cancelJobApply,
  getJobApplicants,
} from "../../services/festivalJob";
import { handleApiError } from "../../services/handleApiError";
import { useNavigate } from "react-router-dom";
import { getTokens } from "../../services/auth";
import { useAuthStore } from "../../stores/authStore";

interface Props {
  job: JobResponse;
  mode: "create" | "edit";
  onClose: () => void;
  onUpdated: () => void;
}

export default function JobApplyModal({ job, mode, onClose, onUpdated }: Props) {
  const navigate = useNavigate();
  const { accessToken } = getTokens();
  const { user } = useAuthStore();
  const currentUid = user?.uid ?? null;

  const [form, setForm] = useState<JobApplyRequest>({
    name: "",
    gender: "",
    age: undefined,
    location: "",
    introduction: "",
    career: "",
  });

  const [loading, setLoading] = useState(false);

  // ----------------------------------
  // 🔥 수정 모드일 때 기존 작성한 지원 내용 불러오기
  // ----------------------------------
  useEffect(() => {
    const loadMyApply = async () => {
      if (mode !== "edit" || !currentUid) return;

      try {
        const applicants: JobApplyResponse[] = await getJobApplicants(job.jobId);

        // 본인 지원 내용 찾기
        const mine = applicants.find((a) => a.applicantUid === currentUid);
        if (!mine) return;

        // 기존 데이터 세팅
        setForm({
          name: mine.name ?? "",
          gender: mine.gender ?? "",
          age: mine.age ?? undefined,
          location: mine.location ?? "",
          introduction: mine.introduction ?? "",
          career: mine.career ?? "",
        });
      } catch (err) {
        console.error("기존 지원 내용 로드 실패:", err);
      }
    };

    loadMyApply();
  }, [mode, job.jobId, currentUid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return navigate("/login");
    }

    if (!form.name) {
      alert("이름은 필수입니다.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        await applyJob(job.jobId, form);
      } else {
        await updateJobApply(job.jobId, form);
      }

      onUpdated();
      onClose();
    } catch (err) {
      handleApiError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApply = async () => {
    if (!window.confirm("지원 내역을 취소하시겠습니까?")) return;

    setLoading(true);
    try {
      await cancelJobApply(job.jobId);
      onUpdated();
      onClose();
    } catch (err) {
      handleApiError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="mb-3 text-xl font-bold">
          {mode === "create" ? "알바 지원하기" : "지원 내용 수정"}
        </h2>
        <p className="mb-4 text-sm text-gray-600">{job.title}</p>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">이름 *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium">성별</label>
              <input
                name="gender"
                value={form.gender ?? ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div className="w-24">
              <label className="text-sm font-medium">나이</label>
              <input
                name="age"
                type="number"
                value={form.age ?? ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">거주지</label>
            <input
              name="location"
              value={form.location ?? ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">자기소개</label>
            <textarea
              name="introduction"
              rows={3}
              value={form.introduction ?? ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">경력사항</label>
            <textarea
              name="career"
              rows={3}
              value={form.career ?? ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-200 py-2 text-sm font-semibold text-gray-800"
            disabled={loading}
          >
            닫기
          </button>

          {mode === "edit" && (
            <button
              onClick={handleCancelApply}
              className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white"
              disabled={loading}
            >
              지원 취소
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-[#0F079F] py-2 text-sm font-semibold text-white"
            disabled={loading}
          >
            {mode === "create" ? "지원하기" : "수정 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
