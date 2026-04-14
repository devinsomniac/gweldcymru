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

  // Fetch real WIMD data from our API route
  const fetchWimd = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/wimd?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.overallDecile) {
        setWimdDecile(Number(data.overallDecile));
      } else {
        setWimdDecile(null);
      }
    } catch {
      setWimdDecile(null);
    }
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
        await fetchWimd(d.latitude, d.longitude);
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
        await fetchWimd(lat, lng);
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
      <main className="bg-[var(--bg)] overflow-hidden max-md:order-[-1]">
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