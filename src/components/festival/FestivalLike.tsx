// src/components/festival/FestivalActions.tsx
import { HeartIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { getTokens } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/route";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Props {
  id: number;
  like: boolean;
  likeCount: number;
  onChange: (next: { like: boolean; likeCount: number }) => void;
}

export default function FestivalLike({ id, like, likeCount, onChange }: Props) {
  const navigate = useNavigate();
  const { accessToken } = getTokens();

  /**
   * ❤️ 좋아요 토글
   */
  const handleLike = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return navigate(ROUTES.LOGIN);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/app/festival/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      onChange(res.data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        return navigate(ROUTES.LOGIN);
      }
      alert("좋아요 처리 오류");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* ❤️ 좋아요 */}
      <button
        onClick={handleLike}
        className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-white"
      >
        <HeartIcon className={`h-5 ${like ? "text-red-500" : "text-white"}`} />
        <span>{likeCount}</span>
      </button>
    </div>
  );
}
