export default function SearchBar() {
  return (
    <div className="mb-4 w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="축제명, 지역으로 검색"
          className="flex-1 rounded-xl border px-4 py-3"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {/* {["내 주변", "음악", "오늘 마감", "고궁여", "김밥 축제"].map((v) => (
          <button
            key={v}
            className="px-3 py-2 bg-gray-100 rounded-full text-sm"
          >
            {v}
          </button>
        ))} */}
      </div>
    </div>
  );
}
