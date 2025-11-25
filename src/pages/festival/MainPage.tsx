import { useEffect, useState } from "react";
import { getFestivalList } from "../../services/festival";
import { getUrgentJobs } from "../../services/festivalJob";
import type { FestivalSimple } from "../../types/festival";
import type { JobResponse } from "../../types/festivalJob";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import FestivalCard from "../../components/festival/FestivalCard";
import JobCard from "../../components/job/JobCard";
import { getRecentFestivalsFromCookie } from "../../utils/recentFestivals";
import JobApplyModal from "../../components/job/JobApplyModal";
import JobApplicantsModal from "../../components/job/JobApplicantsModal";

export default function MainPage() {
  const hotTags = ["겨울", "크리스마스", "불꽃", "산타"];

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentUid = user?.uid ?? null;

  const [popular, setPopular] = useState<FestivalSimple[]>([]);
  const [urgentJobs, setUrgentJobs] = useState<JobResponse[]>([]);
  const [recent, setRecent] = useState<FestivalSimple[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [applyMode, setApplyMode] = useState<"create" | "edit">("create");
  const [showApplicantsForJob, setShowApplicantsForJob] = useState<number | null>(null);

  useEffect(() => {
    loadMain();
    setRecent(getRecentFestivalsFromCookie());
  }, []);

  const loadMain = async () => {
    try {
      const festivalsPage1 = await getFestivalList(1); // 20개

      // ⭐ 좋아요 순 정렬 → 상위 5개 뽑기
      const sorted = [...festivalsPage1]
        .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
        .slice(0, 5);

      setPopular(sorted);

      const urgent = await getUrgentJobs(1);
      setUrgentJobs(urgent);
    } catch (e) {
      console.error("메인페이지 로딩 실패:", e);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-20">
      <div className="">
        <div className="flex flex-wrap gap-2">
          {hotTags.map((tag) => (
            <button
              key={tag}
              onClick={() => window.dispatchEvent(new CustomEvent("searchTag", { detail: tag }))}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
      {/* 인기 축제 */}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">인기 축제</h2>
        <button onClick={() => navigate("/festival")} className="text-sm text-gray-500">
          더보기
        </button>
      </div>

      <div className="mt-3 flex gap-4 overflow-x-auto pb-1">
        {popular.map((f) => (
          <div key={f.id} className="w-[260px] shrink-0">
            <FestivalCard item={f as any} mode={"mini"} />
          </div>
        ))}
      </div>

      {/* 급구 알바 */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-bold">급구 알바</h2>

        <button onClick={() => navigate("/job")} className="text-sm text-gray-500">
          더보기
        </button>
      </div>

      <div className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1">
        {urgentJobs.map((job) => {
          const isMine = currentUid != null && currentUid === job.employerUid;
          const hasApplied = !!job.alreadyApplied;
          return (
            <div className="w-full shrink-0 cursor-pointer snap-center" key={job.jobId}>
              <JobCard
                key={job.jobId}
                job={job}
                isMine={isMine}
                status={job.status}
                onClickApplyOrEdit={() => {
                  if (isMine) return;
                  setSelectedJob(job);
                  setApplyMode(hasApplied ? "edit" : "create");
                }}
                onClickManageApplicants={
                  isMine ? () => setShowApplicantsForJob(job.jobId) : undefined
                }
              />
            </div>
          );
        })}
      </div>
      {/* 지원/수정 모달 */}
      {selectedJob && (
        <JobApplyModal
          job={selectedJob}
          mode={applyMode}
          onClose={() => setSelectedJob(null)}
          onUpdated={() => {
            // 지원 후 다시 불러오기
            loadMain();
          }}
        />
      )}
      {/* 지원자 관리 모달 */}
      {showApplicantsForJob !== null && (
        <JobApplicantsModal
          jobId={showApplicantsForJob}
          employerUid={urgentJobs.find((x) => x.jobId === showApplicantsForJob)?.employerUid ?? ""}
          onClose={() => setShowApplicantsForJob(null)}
        />
      )}
      {/* 최근 본 항목 */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-bold">최근 본 항목</h2>
      </div>

      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">최근 본 축제가 없습니다.</p>
      ) : (
        <div className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {recent.map((f) => (
            <div
              key={f.id}
              className="w-40 shrink-0 cursor-pointer snap-center rounded-xl border bg-white p-2 shadow-sm"
              onClick={() => navigate(`/festival/${f.id}`)}
            >
              <img src={f.imageUrl} className="h-24 w-full rounded-lg object-cover" />
              <p className="mt-2 line-clamp-1 text-sm font-semibold">{f.name}</p>
              <p className="text-xs text-gray-500">{f.region}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
