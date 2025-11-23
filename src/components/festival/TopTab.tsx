import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function TopTab({
  tab,
  setTab,
}: {
  tab: "list" | "map";
  setTab: (t: "list" | "map") => void;
}) {
  return (
    <div className="mb-4 w-full px-8">
      <div className="flex rounded-full bg-[#F4EEFF] p-1">
        {/* 리스트 버튼 */}
        <button
          onClick={() => setTab("list")}
          className={`ㅔx flex flex-1 items-center justify-center gap-2 rounded-full py-1 transition-all ${tab === "list" ? "bg-white text-gray-700 shadow" : "text-gray-500"} `}
        >
          리스트
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        {/* 지도 버튼 */}
        <button
          onClick={() => setTab("map")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-1 transition-all ${tab === "map" ? "bg-white text-gray-700 shadow" : "text-gray-500"} `}
        >
          지도
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
