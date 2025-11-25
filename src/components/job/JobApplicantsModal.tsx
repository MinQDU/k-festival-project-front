// src/components/job/JobApplicantsModal.tsx
import { useEffect, useState } from "react";
import { acceptJobApplicant, getApplicantsVisibleToUser } from "../../services/festivalJob";
import type { JobApplyResponse } from "../../types/festivalJob";
import { useAuthStore } from "../../stores/authStore";

interface Props {
  jobId: number;
  employerUid: string;
  onClose: () => void;
}

export default function JobApplicantsModal({ jobId, employerUid, onClose }: Props) {
  const { user } = useAuthStore();
  const currentUid = user?.uid ?? null;

  const [list, setList] = useState<JobApplyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------------------
   * 🔥 지원자 / 내 지원서 불러오기 함수
   * ------------------------------------- */
  const loadApplicants = async () => {
    try {
      const data = await getApplicantsVisibleToUser(jobId, employerUid, currentUid);
      setList(data);
    } catch (err) {
      console.error("지원자 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [jobId, employerUid, currentUid]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="rounded-xl bg-white p-4 shadow">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {currentUid === employerUid ? "지원자 목록" : "내 지원 내역"}
        </h2>

        {list.length === 0 && (
          <p className="py-4 text-center text-gray-500">지원 내역이 없습니다.</p>
        )}

        <div className="space-y-3 overflow-y-auto pb-16">
          {list.map((ap) => (
            <div key={ap.applyId} className="rounded-lg border p-3 shadow-sm">
              <p className="font-semibold">{ap.name}</p>
              <p className="text-sm text-gray-600">
                {ap.gender} / {ap.age}세 / {ap.location}
              </p>

              {ap.introduction && (
                <p className="mt-2 text-sm whitespace-pre-line text-gray-700">{ap.introduction}</p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                {new Date(ap.createdAt ?? "").toLocaleString()}
              </p>

              {/* 채용 상태 뱃지 */}
              <div className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    ap.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : ap.status === "REJECTED"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ap.status === "ACCEPTED"
                    ? "채용완료"
                    : ap.status === "REJECTED"
                      ? "미채용"
                      : "지원중"}
                </span>
              </div>

              {/* 🔥 고용주만 채용 버튼 가능 */}
              {currentUid === employerUid && ap.status !== "ACCEPTED" && (
                <button
                  onClick={async () => {
                    try {
                      await acceptJobApplicant(ap.applyId);
                      await loadApplicants(); // ⭐ 다시 로딩
                    } catch (err) {
                      console.error("채용 실패:", err);
                      alert("채용 처리에 실패했습니다.");
                    }
                  }}
                  className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white"
                >
                  채용하기
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute bottom-0 left-0 w-full rounded-lg bg-gray-300 py-2 font-semibold text-gray-800"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
