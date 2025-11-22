/* global kakao */
import { useEffect, useRef } from "react";

// TypeScript global declaration for kakao
declare global {
  interface Window {
    kakao: any;
  }
}

export interface Festival {
  festivalName: string;
  latitude: number;
  longitude: number;
  // Add other properties if needed
}

interface FestivalMapProps {
  festivals: Festival[];
}

export default function FestivalMap({ festivals }: FestivalMapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오 스크립트 로딩
    const kakaoScript = document.createElement("script");
    kakaoScript.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=629f8215d649a7297cfeac7795b0f84f&autoload=false";
    kakaoScript.async = true;

    kakaoScript.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };

    document.head.appendChild(kakaoScript);

    return () => {
      // cleanup (optional)
    };
  }, [festivals]);

  const initMap = () => {
    if (!festivals?.length) return;

    const container = mapRef.current;
    const centerLat = festivals[0].latitude;
    const centerLng = festivals[0].longitude;

    const map = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(centerLat, centerLng),
      level: 6,
    });

    festivals.forEach((f) => {
      if (!f.latitude || !f.longitude) return;

      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(f.latitude, f.longitude),
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        alert(f.festivalName);
      });
    });
  };

  return <div ref={mapRef} className="w-full h-[600px] rounded-lg shadow mt-4" />;
}
