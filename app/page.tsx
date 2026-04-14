// app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    wimd: true,
    flood: false,
    floodwarn: false,
    lsoa: false,
  });

  const [location, setLocation] = useState(null);
  const [wimdDecile, setWimdDecile] = useState<number | null>(null);

  const handleToggleLayer = (key: string) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = (postcode: string) => {
    console.log('Search:', postcode);
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
      <main className="bg-[var(--bg)]">
        Map coming next
      </main>
    </>
  );
}