import { useState } from "react";
import type { FestivalItem } from "../../types/festival";
import FestivalActions from "./FestivalActions";
import FestivalLike from "./FestivalLike";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function FestivalCard({
  item,
  mode = "full",
}: {
  item: FestivalItem;
  mode?: "full" | "mini" | "micro";
}) {
  const isMini = mode === "mini";
  const navigate = useNavigate();

  const [state, setState] = useState({
    like: item.like,
    likeCount: item.likeCount,
  });

  /** =======================================
   *  ⭐ MICRO 모드 (검색 리스트 전용)
   * ======================================= */
  if (mode === "micro") {
    return (
      <div
        className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-2 shadow-sm hover:bg-gray-50"
        onClick={() => navigate(`/festival/${item.id}`)}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold">{item.festivalName}</p>
          <p className="mt-1 text-xs text-gray-500">{item.holdPlace}</p>
        </div>
      </div>
    );
  }

  /**
   * ================================
   *  ⭐ MINI 모드 전용 렌더링
   * ================================
   */
  if (isMini) {
    return (
      <div
        className="z-9999 w-64 cursor-pointer rounded-xl border bg-white p-2 shadow-lg transition-transform hover:scale-[1.02]"
        onClick={() => navigate(`/festival/${item.id}`)}
      >
        {/* 이미지 */}
        <img
          src={item.image}
          className="h-24 w-full rounded-lg object-cover"
          alt={item.festivalName}
        />

        {/* 텍스트 */}
        <div className="mt-2 px-1">
          <p className="line-clamp-1 text-sm font-semibold">{item.festivalName}</p>

          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {item.rawContent.replaceAll("+", ", ")}
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            <CalendarIcon className="mr-1 inline-block h-4 w-4 text-gray-400" />
            {item.festivalStartDate}
          </p>

          <p className="text-[11px] text-gray-500">
            <MapPinIcon className="mr-1 inline-block h-4 w-4 text-gray-400" />
            {item.holdPlace}
          </p>
        </div>
      </div>
    );
  }

  /**
   * ================================
   *  ⭐ FULL 모드 렌더링
   * ================================
   */
  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow">
      {/* 축제 이미지 */}
      <img src={item.image} alt={item.festivalName} className="h-48 w-full object-cover" />

      <div className="p-4">
        {/* 제목 */}
        <h2 className="text-lg font-semibold">{item.festivalName}</h2>

        {/* 소개 */}
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {item.rawContent.replaceAll("+", ", ")}
        </p>

        {/* 날짜 */}
        <p className="mt-2 text-sm text-gray-500">
          <CalendarIcon className="mr-1 inline-block h-5 w-5 text-gray-400" />
          {item.festivalStartDate} ~ {item.festivalEndDate}
        </p>

        {/* 위치 */}
        <p className="text-sm text-gray-500">
          <MapPinIcon className="mr-1 inline-block h-5 w-5 text-gray-400" />
          {item.holdPlace}
        </p>

        {/* 카테고리 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {item.category.map((c) => (
            <span key={c} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
              {c}
            </span>
          ))}
        </div>

        {/* 액션 */}
        <div className="mt-4 flex items-center justify-between">
          <FestivalActions
            id={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            onChange={(next) => setState(next)}
          />

          {/* 상세 페이지 이동 */}
          <button
            onClick={() => navigate(`/festival/${item.id}`)}
            className="rounded-lg bg-[#0F079F] px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-[#0D0680]"
          >
            자세히
          </button>
        </div>

        {/* 좋아요 버튼 */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          <FestivalLike
            id={item.id}
            like={state.like}
            likeCount={state.likeCount}
            onChange={(next) => setState(next)}
          />
        </div>
      </div>
    </div>
  );
}
