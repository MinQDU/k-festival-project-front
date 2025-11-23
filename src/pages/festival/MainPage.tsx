import { useEffect, useState } from "react";
import { getFestivalList } from "../../services/festival";
import { getUrgentJobs } from "../../services/festivalJob";
import type { FestivalSimple } from "../../types/festival";
import type { JobResponse } from "../../types/festivalJob";

import FestivalCard from "../../components/festival/FestivalCard";
import JobCard from "../../components/job/JobCard";
import { getRecentFestivalsFromCookie } from "../../utils/recentFestivals";

export default function MainPage() {
  const [popular, setPopular] = useState<FestivalSimple[]>([]);
  const [urgentJobs, setUrgentJobs] = useState<JobResponse[]>([]);
  const [recent, setRecent] = useState<FestivalSimple[]>([]);

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
      {/* 인기 축제 */}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">인기 축제</h2>
        <button className="text-sm text-gray-500">더보기</button>
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
        <button className="text-sm text-gray-500">더보기</button>
      </div>
      <div className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1">
        {urgentJobs.map((job) => (
          <div key={job.jobId} className="w-full shrink-0 snap-center">
            <JobCard job={job} isMine={false} status={job.status} onClickApplyOrEdit={() => {}} />
          </div>
        ))}
      </div>

      {/* 최근 본 축제 */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-bold">최근 본 항목</h2>
      </div>

      {recent.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">최근 본 축제가 없습니다.</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-4">
          {recent.map((f) => (
            <div key={f.id} className="rounded-xl border bg-white p-2 shadow-sm">
              <img src={f.imageUrl} className="h-28 w-full rounded-lg object-cover" />
              <p className="mt-2 text-sm font-semibold">{f.name}</p>
              <p className="text-xs text-gray-500">{f.region}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
