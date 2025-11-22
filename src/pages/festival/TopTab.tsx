export default function TopTab({
  tab,
  setTab,
}: {
  tab: "list" | "map";
  setTab: (t: "list" | "map") => void;
}) {
  return (
    <div className="w-full mt-3">
      <div className="flex justify-center gap-10 border-b pb-2 text-sm">
        <button
          className={`pb-1 ${
            tab === "list"
              ? "font-semibold text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("list")}
        >
          리스트
        </button>

        <button
          className={`pb-1 ${
            tab === "map"
              ? "font-semibold text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("map")}
        >
          지도
        </button>
      </div>
    </div>
  );
}
