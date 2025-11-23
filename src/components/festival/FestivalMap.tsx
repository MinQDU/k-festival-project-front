/* src/pages/festival/FestivalMap.tsx */
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";
import type { FestivalItem } from "../../types/festival";
import FestivalCard from "./FestivalCard";

interface Props {
  festivals: FestivalItem[];
}

export default function FestivalMap({ festivals }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const center = useMemo(() => {
    if (festivals.length === 0) return { lat: 37.5665, lng: 126.978 };
    return { lat: festivals[0].latitude, lng: festivals[0].longitude };
  }, [festivals]);

  const onMarkerClick = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const closePopup = () => setSelectedId(null);

  if (!isLoaded) return <div>Loading map...</div>;

  const selectedFestival = festivals.find((f) => f.id === selectedId) || null;

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="w-full h-[600px] rounded-lg shadow"
      onClick={closePopup}
    >
      {festivals.map((f) => (
        <Marker
          key={f.id}
          position={{ lat: f.latitude, lng: f.longitude }}
          title={f.festivalName}
          onClick={() => onMarkerClick(f.id)}
        />
      ))}

      {selectedFestival && (
        <InfoWindow
          position={{ lat: selectedFestival.latitude, lng: selectedFestival.longitude }}
          onCloseClick={closePopup}
        >
          <div className="w-64">
            <FestivalCard item={selectedFestival} mode="mini" />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
