// app/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import type { ConstraintResult } from '@/components/Constraintspanel';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    wimd: true,
    flood: false,
    floodwarn: false,
    lsoa: false,
    monuments: false,
    listed: false,
    worldheritage: false,
    sssi: false,
    nationalpark: false,
  });

  const [location, setLocation] = useState(null);
  const [wimdDecile, setWimdDecile] = useState<number | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [plannerMode, setPlannerMode] = useState(false);
  const [constraints, setConstraints] = useState<Record<string, ConstraintResult> | null>(null);
  const [constraintsLoading, setConstraintsLoading] = useState(false);

  const handleToggleLayer = (key: string) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleTogglePlanner = (next: boolean) => {
    setPlannerMode(next);
    if (next) {
      setActiveLayers({
        wimd: false,
        flood: true,
        floodwarn: false,
        lsoa: false,
        monuments: true,
        listed: true,
        worldheritage: false,
        sssi: false,
        nationalpark: false,
      });
    } else {
      setActiveLayers({
        wimd: true,
        flood: false,
        floodwarn: false,
        lsoa: false,
        monuments: false,
        listed: false,
        worldheritage: false,
        sssi: false,
        nationalpark: false,
      });
    }
  };

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

  const fetchConstraints = async (lat: number, lng: number) => {
    setConstraintsLoading(true);
    try {
      const res = await fetch(`/api/constraints?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setConstraints(data);
    } catch (err) {
      console.error('Constraint check failed:', err);
      setConstraints(null);
    }
    setConstraintsLoading(false);
  };

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
        if (plannerMode) {
          await fetchConstraints(d.latitude, d.longitude);
        } else {
          await fetchWimd(d.latitude, d.longitude);
        }
      }
    } catch (err) {
      console.error('Postcode lookup failed:', err);
    }
    setLoading(false);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setLoading(true);
    setMarkerPosition({ lat, lng });
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`);
      const json = await res.json();
      if (json.status === 200 && json.result?.length) {
        const d = json.result[0];
        setLocation(d);
        if (plannerMode) {
          await fetchConstraints(lat, lng);
        } else {
          await fetchWimd(lat, lng);
        }
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    }
    setLoading(false);
  };

  return (
    <>
      <Header plannerMode={plannerMode} onTogglePlanner={handleTogglePlanner} />
      <Sidebar
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        location={location}
        onSearch={handleSearch}
        wimdDecile={wimdDecile}
        plannerMode={plannerMode}
        constraints={constraints}
        constraintsLoading={constraintsLoading}
      />
      <main className="bg-[var(--bg)] overflow-hidden max-md:order-[-1] max-md:h-[50vh]">
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