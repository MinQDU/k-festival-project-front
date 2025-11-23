// src/components/job/JobCard.tsx
import { BriefcaseIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { JobResponse } from "../../types/festivalJob";

interface Props {
  job: JobResponse;
  isMine: boolean;
  status: "APPLIED" | "ACCEPTED" | "REJECTED" | "NONE";
  onClickApplyOrEdit: () => void; // 지원하기 / 지원 수정 열기
  onClickManageApplicants?: () => void; // 내 공고일 때 지원자 관리
}

export default function JobCard({
  job,
  isMine,
  status,
  onClickApplyOrEdit,
  onClickManageApplicants,
}: Props) {
  const statusLabel = !job.isOpen ? "모집 종료" : job.alreadyApplied ? "지원 완료" : "모집중";

  const statusColor = !job.isOpen
    ? "bg-gray-200 text-gray-600"
    : job.alreadyApplied
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  /** ===============================
   *  🔥 버튼 UI 결정
   * ================================ */
  let buttonLabel = "";
  let buttonClass = "";
  let isDisabled = false;
  let onClick: (() => void) | undefined = onClickApplyOrEdit;
  if (isMine) {
    // 고용주
    buttonLabel = "지원자 관리";
    buttonClass = "bg-[#0F079F] text-white hover:bg-[#0D0680]";
    onClick = onClickManageApplicants;
  } else {
    // 일반 사용자 (지원자)
    if (status === "ACCEPTED") {
      buttonLabel = "채용 성공";
      buttonClass = "bg-green-600 text-white opacity-90 cursor-not-allowed";
      isDisabled = true;
      onClick = undefined;
    } else if (status === "APPLIED") {
      buttonLabel = "지원 내용 수정";
      buttonClass = "bg-yellow-500 text-white hover:bg-yellow-600";
    } else if (status === "REJECTED") {
      buttonLabel = "미채용";
      buttonClass = "bg-gray-400 text-white opacity-90 cursor-not-allowed";
      isDisabled = true;
      onClick = undefined;
    } else {
      // NONE
      buttonLabel = "지원하기";
      buttonClass = "bg-blue-600 text-white hover:bg-blue-700";
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      {/* 상단 타이틀/뱃지/지원하기 */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className={`font-semibold ${job.title.length > 15 ? "text-sm" : "text-base"}`}>
              {job.title}
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500">축제 ID: {job.festivalId}</p>
        </div>

        {/* ===============================
          🔥 조건에 따른 버튼 스타일 적용
      ================================= */}
        <button
          onClick={onClick}
          disabled={isDisabled}
          className={`rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition ${buttonClass}`}
        >
          {buttonLabel}
        </button>
      </div>

      {/* 시급 */}
      <div className="flex justify-between text-center">
        <div className="mt-3">
          <p className="text-lg font-bold">
            {job.hourlyPay ? `시급 ${job.hourlyPay.toLocaleString()}원` : "시급 협의"}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor}`}>{statusLabel}</span>
          {job.isCertified && (
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
              인증
            </span>
          )}
        </div>
      </div>

      {/* 근무 시간 / 장소 등 */}
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
        {job.workTime && (
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{job.workTime}</span>
          </div>
        )}
        {job.workPeriod && (
          <div className="flex items-center gap-1">
            <BriefcaseIcon className="h-4 w-4" />
            <span>{job.workPeriod}</span>
          </div>
        )}
        {/* 위치 정보가 DTO에 없어서 생략, 나중에 필드 생기면 MapPinIcon 사용 */}
      </div>

      {/* 설명 */}
      {job.shortDesc && <p className="mt-3 text-sm text-gray-700">{job.shortDesc}</p>}

      {/* 우대/태그 */}
      {job.preference.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {job.preference.map((p) => (
            <span key={p} className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
              {p}
            </span>
          ))}
        </div>
      )}

      {/* 하단 정보 */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div>
          <span>지원자 {job.applicantCount}명</span>
          <span className="mx-1">/</span>
          <span>채용 {job.hiredCount}명</span>
        </div>
        {job.deadline && <span>마감: {job.deadline}</span>}
      </div>
    </div>
  );
}
