// src/pages/festival/FestivalList.tsx
import * as React from "react";
import FestivalCard from "./FestivalCard";
import type { FestivalItem } from "../../types/festival";

interface FestivalListProps {
  festivals: FestivalItem[];
}

const FestivalList: React.FC<FestivalListProps> = ({ festivals }: FestivalListProps) => {
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
