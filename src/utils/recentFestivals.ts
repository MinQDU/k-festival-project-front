import Cookies from "js-cookie";
import type { FestivalSimple } from "../types/festival";

const COOKIE_KEY = "recentFestivals";
const MAX_ITEMS = 10;

/** 최근 본 축제 가져오기 */
export function getRecentFestivalsFromCookie(): FestivalSimple[] {
  try {
    const raw = Cookies.get(COOKIE_KEY);
    console.log("[쿠키 로드] raw =", raw);

    if (!raw) return [];

    const parsed = JSON.parse(raw);
    console.log("[쿠키 파싱 성공] =", parsed);

    return parsed;
  } catch (err) {
    console.error("[쿠키 파싱 실패] :", err);
    return [];
  }
}

/** 최근본 축제 저장 */
export function addRecentFestival(festival: FestivalSimple) {
  try {
    console.log("[최근본 저장 요청] =", festival);

    const oldList = getRecentFestivalsFromCookie();

    const filtered = oldList.filter((f) => f.id !== festival.id);
    const newList = [festival, ...filtered].slice(0, MAX_ITEMS);

    console.log("[저장될 쿠키 값] =", newList);

    Cookies.set(COOKIE_KEY, JSON.stringify(newList), {
      expires: 7,
      sameSite: "strict", // ← SPA 라우팅에서 필수
      path: "/", // ← 전체 페이지에서 쿠키 읽히게
    });

    console.log("[쿠키 저장 완료]");
  } catch (err) {
    console.error("[쿠키 저장 실패] :", err);
  }
}
