"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useData } from "./useData";

export default function Map() {
  const mapContainerRef = useRef<null | HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const data = useData();

  useEffect(() => {
    // If map container ref is not set, do nothing
    if (!mapContainerRef.current) {
      return;
    }

    // If map is already set, do nothing
    if ("_leaflet_id" in mapContainerRef.current) {
      return;
    }

    // Attach map to map container ref
    setMap(L.map(mapContainerRef.current).setView([60.176, 24.934], 8));
  }, [mapContainerRef]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (data === null) {
      return;
    }

    data.forEach((row) => {
      const newMarker = L.circleMarker(row.latLng, { radius: row.radius });

      newMarker.addTo(map);
    });
  }, [data]);

  useEffect(() => {
    if (!map) {
      return;
    }

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
  });

  return <div ref={mapContainerRef} />;
}
