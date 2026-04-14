// app/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    wimd: true,
    flood: false,
    floodwarn: false,
    lsoa: false,
  });

  const [location, setLocation] = useState(null);
  const [wimdDecile, setWimdDecile] = useState<number | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleLayer = (key: string) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Postcode search
  const handleSearch = async (postcode: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      const json = await res.json();
      if (json.status === 200 && json.result) {
        const d = json.result;
        setLocation(d);
        setMarkerPosition({ lat: d.latitude, lng: d.longitude });
        setFlyTo({ lat: d.latitude, lng: d.longitude });
        // Simulated WIMD decile (Phase 5 replaces this with real WFS data)
        setWimdDecile(simulateDecile(d.lsoa));
      }
    } catch (err) {
      console.error('Postcode lookup failed:', err);
    }
    setLoading(false);
  };

  // Map click → reverse geocode
  const handleMapClick = async (lat: number, lng: number) => {
    setLoading(true);
    setMarkerPosition({ lat, lng });
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`);
      const json = await res.json();
      if (json.status === 200 && json.result?.length) {
        const d = json.result[0];
        setLocation(d);
        setWimdDecile(simulateDecile(d.lsoa));
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    }
    setLoading(false);
  };

  return (
    <>
      <Sidebar
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        location={location}
        onSearch={handleSearch}
        wimdDecile={wimdDecile}
      />
      <main className="bg-[var(--bg)] overflow-hidden">
        <Map
          activeLayers={activeLayers}
          markerPosition={markerPosition}
          flyTo={flyTo}
          onMapClick={handleMapClick}
          loading={loading}
        />
      </main>
    </>
  );
}

// Temporary — replaced by real WFS in Phase 5
function simulateDecile(lsoa: string | null): number {
  if (!lsoa) return 5;
  let h = 0;
  for (let i = 0; i < lsoa.length; i++) h = ((h << 5) - h) + lsoa.charCodeAt(i) | 0;
  return (Math.abs(h) % 10) + 1;
}