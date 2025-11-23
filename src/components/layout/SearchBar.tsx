// src/components/common/SearchBar.tsx
import { useEffect, useRef, useState } from "react";
import { searchFestival } from "../../services/festival";
import FestivalCard from "../festival/FestivalCard";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔥 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔥 입력할 때 debounce + 최소 2자 조건
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setKeyword(v);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      const trimmed = v.trim();

      if (trimmed.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }

      try {
        const data = await searchFestival(trimmed);
        setResults(data);
        setOpen(true);
      } catch (err) {
        console.error("검색 실패:", err);
      }
    }, 300);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        placeholder="축제명, 지역으로 검색"
        className="w-full rounded-xl border border-gray-200 px-4 py-3"
        onChange={handleInput}
        value={keyword}
        onFocus={() => keyword.length >= 2 && setOpen(true)}
      />

      {/* 🔥 검색 결과 드롭다운 */}
      {open && results.length > 0 && (
        <div className="absolute top-[110%] left-0 z-50 w-full rounded-xl border bg-white p-2 shadow-lg">
          {results.map((item: any) => (
            <div key={item.id} className="mb-2 last:mb-0">
              <FestivalCard item={item} mode="micro" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
