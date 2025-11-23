import { useEffect, useState } from "react";
import TopTab from "../../components/festival/TopTab";
import FestivalList from "../../components/festival/FestivalList";
import FestivalMap from "../../components/festival/FestivalMap";
import type { FestivalItem } from "../../types/festival";
import { getTokens } from "../../services/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function FestivalPage() {
  const [tab, setTab] = useState<"list" | "map">("list");
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);

  const { accessToken } = getTokens(); // 🔥 로그인 O/X 확인

  useEffect(() => {
    fetch(`${API_BASE_URL}/app/festival/list?page=1`, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` } // 🔥 로그인 상태일 때만 전송
        : undefined, // 로그인 안 했으면 헤더 없음
    })
      .then((res) => res.json())
      .then((data: FestivalItem[]) => {
        setFestivals(data);
      })
      .catch(() => setFestivals([]));
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-white p-4">
      <TopTab tab={tab} setTab={setTab} />

      {tab === "list" ? (
        <FestivalList festivals={festivals} />
      ) : (
        <FestivalMap festivals={festivals} />
      )}
    </div>
  );
}
