import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import TopTab from "./TopTab";
import FestivalList from "./FestivalList";
import FestivalMap from "./FestivalMap";
import type { FestivalItem } from "../../types/festival";

export default function FestivalPage() {
  const [tab, setTab] = useState<"list" | "map">("list");
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);

  useEffect(() => {
    fetch("https://noma.minq.work/app/festival/list?page=1")
      .then((res) => res.json())
      .then((data: FestivalItem[]) => {
        setFestivals(data); // 🔥 API가 배열이므로 그대로 사용
      })
      .catch(() => setFestivals([]));
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <SearchBar />
      <TopTab tab={tab} setTab={setTab} />

      {tab === "list" ? (
        <FestivalList festivals={festivals} />
      ) : (
        <FestivalMap festivals={festivals} />
      )}
    </div>
  );
}
