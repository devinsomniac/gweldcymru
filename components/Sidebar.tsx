// components/Sidebar.tsx
'use client';

import SearchInput from './SearchInput';
import LayerToggle from './LayerToggle';
import ProfilePanel from './ProfilePanel';

interface LocationData {
  postcode: string;
  admin_district: string;
  admin_ward: string;
  parliamentary_constituency: string;
  lsoa: string;
  msoa: string;
  latitude: number;
  longitude: number;
}

const LAYERS = [
  { key: 'wimd', name: 'WIMD Deprivation', source: 'Welsh Index of Multiple Deprivation 2019', color: 'var(--welsh-red)' },
  { key: 'flood', name: 'Flood Risk Zones', source: 'NRW Flood Map for Planning — Zones 2 & 3', color: 'var(--blue)' },
  { key: 'floodwarn', name: 'Flood Warning Areas', source: 'NRW Flood Warning Service', color: 'var(--amber)' },
  { key: 'lsoa', name: 'LSOA Boundaries', source: 'Statistical Geography — Wales LSOAs', color: 'var(--welsh-green)' },
];

interface SidebarProps {
  activeLayers: Record<string, boolean>;
  onToggleLayer: (key: string) => void;
  location: LocationData | null;
  onSearch: (postcode: string) => void;
  wimdDecile: number | null;
}

export default function Sidebar({ activeLayers, onToggleLayer, location, onSearch, wimdDecile }: SidebarProps) {
  return (
    <aside className="bg-[var(--surface)] border-r border-[var(--border)] flex flex-col overflow-y-auto z-[900]">
      <SearchInput onSearch={onSearch} />

      {/* Layers */}
      <div className="p-5 border-b border-[var(--border)]">
        <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-dim)] font-semibold mb-2.5">
          Data Layers
        </p>
        {LAYERS.map((layer) => (
          <LayerToggle
            key={layer.key}
            layerKey={layer.key}
            name={layer.name}
            source={layer.source}
            color={layer.color}
            active={!!activeLayers[layer.key]}
            onToggle={onToggleLayer}
          />
        ))}
      </div>

      {/* Profile */}
      <div className="p-5 flex-1">
        <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-dim)] font-semibold mb-2.5">
          Neighbourhood Profile
        </p>
        <ProfilePanel location={location} wimdDecile={wimdDecile} />
      </div>
    </aside>
  );
}