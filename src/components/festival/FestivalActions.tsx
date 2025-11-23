// src/components/festival/FestivalActions.tsx
import { ArrowTopRightOnSquareIcon, ShareIcon } from "@heroicons/react/24/solid";

interface Props {
  id: number;
  latitude: number;
  longitude: number;
  onChange: (next: { like: boolean; likeCount: number }) => void;
}

export default function FestivalActions({ id, latitude, longitude }: Props) {
  /**
   * 📌 길찾기 (네이버)
   */
  const openMap = () => {
    const url = `https://map.naver.com/p/directions/-/${longitude},${latitude},,,SIMPLE_POI/-/transit`;
    window.open(url, "_blank");
  };

  /**
   * 🔗 공유
   */
  /**
   * 🔗 공유하기 (Web Share API)
   */
  const share = async () => {
    const shareUrl = `${window.location.origin}/festival/${id}`;
    const title = "축제 정보 공유";
    const text = "이 축제 한번 구경해봐!";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (err) {
        console.log("공유 취소 또는 오류:", err);
      }
    } else {
      // ❌ 공유 API 미지원 → 링크 복사 fallback
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* 길찾기 */}
      <button
        onClick={openMap}
        className="flex items-center gap-2 rounded-lg border px-3 py-1 text-sm"
      >
        <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-600" />
        길찾기
      </button>

      {/* 공유 */}
      <button
        onClick={share}
        className="flex items-center gap-2 rounded-lg border px-3 py-1 text-sm"
      >
        <ShareIcon className="h-4 w-4 text-gray-600" />
        공유
      </button>
    </div>
  );
}
