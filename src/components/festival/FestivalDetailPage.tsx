import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FestivalItem } from "../../types/festival";
import FestivalActions from "./FestivalActions";
import FestivalLike from "./FestivalLike";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import FestivalReview from "../review/FestivalReview";
import { addRecentFestival } from "../../utils/recentFestivals";

export default function FestivalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"info" | "location" | "review">("info");
  const [fest, setFest] = useState<FestivalItem | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/app/festival/${id}`)
      .then((r) => r.json())
      .then((data) =>
        setFest({
          ...data,
          category: Array.isArray(data.category) ? data.category : [],
        }),
      );
  }, [id]);

  useEffect(() => {
    if (!fest) return;

    addRecentFestival({
      id: fest.id,
      name: fest.festivalName,
      imageUrl: fest.image,
      region: fest.holdPlace,
    });
  }, [fest]);

  if (!fest) return <div>Loading...</div>;

  return (
    <div className="pb-20">
      {/* ================================
          상단 이미지 + 뒤로가기 + 좋아요
      =================================== */}
      <div className="relative">
        <img src={fest.image} className="h-64 w-full object-cover" />

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>

        {/* 좋아요 버튼 */}
        <div className="absolute top-2 right-2">
          <FestivalLike
            id={fest.id}
            like={fest.like}
            likeCount={fest.likeCount}
            onChange={(next) => setFest((p) => (p ? { ...p, ...next } : p))}
          />
        </div>
      </div>

      {/* ================================
          기본 정보
      =================================== */}
      <div className="p-4">
        <h1 className="text-4xl font-bold">{fest.festivalName}</h1>

        <p className="mt-1 text-xl text-gray-600">
          <CalendarIcon className="mb-1 inline-block h-5 w-5 text-gray-400" />{" "}
          {fest.festivalStartDate} ~ {fest.festivalEndDate}
        </p>

        <p className="mt-1 text-xl text-gray-600">
          <MapPinIcon className="mb-1 inline-block h-5 w-5 text-gray-400" /> {fest.holdPlace}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {fest.category.map((c) => (
            <span key={c} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
              {c}
            </span>
          ))}
        </div>

        {/* 공유 / 길찾기 */}
        <div className="mt-4">
          <FestivalActions
            id={fest.id}
            latitude={fest.latitude}
            longitude={fest.longitude}
            onChange={() => {}}
          />
        </div>

        {/* ================================
            캡슐형 탭 UI
        =================================== */}
        <div className="mt-6 w-full">
          <div className="flex rounded-full bg-[#F4EEFF] p-1">
            {/* 정보 */}
            <button
              onClick={() => setTab("info")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${tab === "info" ? "bg-white text-gray-700 shadow" : "text-gray-500"} `}
            >
              정보 <ChevronRightIcon className="h-4 w-4" />
            </button>

            {/* 위치 */}
            <button
              onClick={() => setTab("location")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${tab === "location" ? "bg-white text-gray-700 shadow" : "text-gray-500"} `}
            >
              위치 <ChevronRightIcon className="h-4 w-4" />
            </button>

            {/* 후기 */}
            <button
              onClick={() => setTab("review")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${tab === "review" ? "bg-white text-gray-700 shadow" : "text-gray-500"} `}
            >
              후기 <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================
            탭 내용
        =================================== */}
        <div className="mt-6">
          {/* 정보 탭 */}
          {tab === "info" && (
            <div className="mt-4 rounded-4xl border border-gray-200 p-4">
              {/* 축제 소개 */}
              <div className="px-3 py-3">
                <h2 className="text-2xl">축제 소개</h2>
                <p className="mt-2 whitespace-pre-line text-gray-700">
                  {fest.rawContent.replaceAll("+", ", ") || "축제 소개 정보 없음"}
                </p>
                <div className="my-4 border-b border-gray-200"></div>
              </div>

              {/* 카테고리 */}
              <div className="px-3 py-3">
                <h2 className="text-2xl">카테고리</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fest.category.length > 0 ? (
                    fest.category.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-700">카테고리 정보 없음</p>
                  )}
                </div>
                <div className="my-4 border-b border-gray-200"></div>
              </div>

              {/* 운영 기관 */}
              <div className="px-3 py-3">
                <h2 className="text-2xl">운영 기관</h2>
                <p className="mt-2 text-gray-700">
                  {fest.operatorInstitution || "운영 기관 정보 없음"}
                </p>
                <div className="my-4 border-b border-gray-200"></div>
              </div>

              {/* 연락처 */}
              <div className="px-3 py-3">
                <h2 className="text-2xl">연락처</h2>
                <p className="mt-2 text-gray-700">{fest.tel || "연락처 정보 없음"}</p>
                <div className="my-4 border-b border-gray-200"></div>
              </div>

              {/* 홈페이지 */}
              <div className="px-3 py-3">
                <h2 className="text-2xl">홈페이지</h2>
                {fest.homepageUrl ? (
                  <a
                    href={fest.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 underline"
                  >
                    {fest.homepageUrl}
                  </a>
                ) : (
                  <p className="mt-2 text-gray-700">홈페이지 정보 없음</p>
                )}
              </div>
            </div>
          )}

          {/* ================================
    위치 탭
=================================== */}
          {tab === "location" && (
            <div className="mt-4 rounded-2xl bg-gray-50 p-4">
              <h2 className="text-xl font-bold">위치 정보</h2>

              <p className="mt-2 text-gray-700">
                {fest.roadAddress || fest.landAddress || "주소 정보 없음"}
              </p>

              {/* Static Google Map 썸네일 */}
              <div
                className="mt-4 cursor-pointer overflow-hidden rounded-xl shadow"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${fest.latitude},${fest.longitude}`,
                    "_blank",
                  )
                }
              >
                <img
                  alt="festival map thumbnail"
                  className="h-60 w-full object-cover"
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${fest.latitude},${fest.longitude}&zoom=12&size=600x400&markers=color:red%7C${fest.latitude},${fest.longitude}&key=${
                    import.meta.env.VITE_GOOGLE_MAPS_KEY
                  }`}
                />
              </div>

              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${fest.latitude},${fest.longitude}`,
                    "_blank",
                  )
                }
                className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white"
              >
                구글 지도에서 보기
              </button>
            </div>
          )}

          {/* 후기 탭 */}
          {tab === "review" && <FestivalReview festivalId={fest.id} />}
        </div>
      </div>
    </div>
  );
}
