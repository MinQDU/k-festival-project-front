import type { FestivalItem } from "../../types/festival";

export default function FestivalCard({ item }: { item: FestivalItem }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <img src={item.image} alt={item.festivalName} className="h-48 w-full object-cover" />

      <div className="p-4">
        <h2 className="text-lg font-semibold">{item.festivalName}</h2>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.rawContent}</p>

        <div className="mt-2 text-sm text-gray-500">
          <p>
            {item.festivalStartDate} ~ {item.festivalEndDate}
          </p>
          <p>{item.holdPlace}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.category.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="rounded-lg border px-3 py-1">길찾기</button>
          <button className="rounded-lg border px-3 py-1">자세히</button>
        </div>
      </div>
    </div>
  );
}
