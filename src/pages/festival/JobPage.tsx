// src/pages/festival/JobPage.tsx
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { getUrgentJobs } from "../../services/festivalJob";
import type { JobResponse } from "../../types/festivalJob";
import JobCard from "../../components/job/JobCard";
import JobApplyModal from "../../components/job/JobApplyModal";
import JobApplicantsModal from "../../components/job/JobApplicantsModal";

export default function JobPage() {
  const { user } = useAuthStore();
  const currentUid = user?.uid ?? null;

  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [applyMode, setApplyMode] = useState<"create" | "edit">("create");

  const [showApplicantsForJob, setShowApplicantsForJob] = useState<number | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 🚨 중복 호출 방지용 (loading만으로 부족)
  const isFetchingRef = useRef(false);

  const load = async (pageToLoad: number) => {
    if (isFetchingRef.current || loading || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const list = await getUrgentJobs(pageToLoad);

      if (pageToLoad === 1) {
        setJobs(list);
      } else {
        setJobs((prev) => [...prev, ...list]);
      }

      if (list.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("알바 리스트 불러오기 실패:", err);
      setHasMore(false); // ❗ 실패 시 무한 요청 방지
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ==============================
  // Intersection Observer
  // ==============================
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (
          target.isIntersecting &&
          hasMore &&
          !isFetchingRef.current && // 중복 방지
          !loading
        ) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  // ==============================
  // 리스트 새로고침
  // ==============================
  const refreshList = () => {
    setPage(1);
    setHasMore(true);
    setJobs([]);
    // load(page=1)은 page 변경으로 자동 호출됨
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <h1 className="mb-4 text-2xl font-bold">축제 알바</h1>

      <div className="space-y-4">
        {jobs.map((job) => {
          const isMine = currentUid != null && currentUid === job.employerUid;
          const hasApplied = !!job.alreadyApplied;

          return (
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
          );
        })}
      </div>

      <div ref={observerRef} className="h-10" />

      {loading && <p className="mt-4 text-center text-sm text-gray-500">불러오는 중입니다...</p>}

      {!hasMore && !loading && jobs.length > 0 && (
        <p className="mt-4 text-center text-xs text-gray-400">모든 알바를 불러왔습니다.</p>
      )}

      {/* 지원/수정 모달 */}
      {selectedJob && (
        <JobApplyModal
          job={selectedJob}
          mode={applyMode}
          onClose={() => setSelectedJob(null)}
          onUpdated={refreshList}
        />
      )}

      {/* 지원자 관리 모달 */}
      {showApplicantsForJob !== null && (
        <JobApplicantsModal
          jobId={showApplicantsForJob}
          employerUid={jobs.find((x) => x.jobId === showApplicantsForJob)?.employerUid ?? ""}
          onClose={() => setShowApplicantsForJob(null)}
        />
      )}
    </div>
  );
}
