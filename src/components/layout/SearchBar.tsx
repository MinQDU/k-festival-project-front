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

  useEffect(() => {
    const handler = (e: any) => {
      const tag = e.detail;
      setKeyword(tag);
      performSearch(tag);
    };

    window.addEventListener("searchTag", handler);
    return () => window.removeEventListener("searchTag", handler);
  }, []);

  // 🔥 외부 클릭 시 검색창 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔥 검색 호출 로직을 함수로 분리
  const performSearch = async (word: string) => {
    try {
      const trimmed = word.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }

      const data = await searchFestival(trimmed);
      setResults(data);
      setOpen(true);
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };

  // 🔥 input 변화 감지 (debounce)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setKeyword(v);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => performSearch(v), 300);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* 입력창 */}
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
        <div className="absolute top-[140%] left-0 z-50 w-full rounded-xl border bg-white p-2 shadow-lg">
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
