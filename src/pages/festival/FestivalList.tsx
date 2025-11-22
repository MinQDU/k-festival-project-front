// src/pages/festival/FestivalList.tsx
import * as React from "react";
import FestivalCard from "./FestivalCard";
import type { FestivalItem } from "../../types/festival";

interface FestivalListProps {
  festivals: FestivalItem[];
}

const FestivalList: React.FC<FestivalListProps> = ({ festivals }: FestivalListProps) => {
  // 디버깅용: 진짜 배열 들어오는지 확인
  console.log("FestivalList festivals length:", festivals?.length);

  if (!festivals || festivals.length === 0) {
    return <div className="mt-4 text-gray-500">축제 정보가 없습니다.</div>;
  }

  return (
    <div className="mt-4 space-y-6">
      {festivals.map((item) => (
        <FestivalCard key={item.festivalName} item={item} />
      ))}
    </div>
  );
};

export default FestivalList;
