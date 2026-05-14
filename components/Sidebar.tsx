'use client';

import SearchInput from './SearchInput';
import LayerToggle from './LayerToggle';
import ProfilePanel from './ProfilePanel';
import ConstraintsPanel, { ConstraintResult } from './Constraintspanel';

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

// Two different layer configs — one per mode
const CITIZEN_LAYERS = [
  { key: 'wimd', name: 'WIMD Deprivation', source: 'Welsh Index of Multiple Deprivation 2019', color: 'var(--welsh-red)' },
  { key: 'flood', name: 'Flood Risk Zones', source: 'NRW Flood Map for Planning — Zones 2 & 3', color: 'var(--blue)' },
  { key: 'floodwarn', name: 'Flood Warning Areas', source: 'NRW Flood Warning Service', color: 'var(--amber)' },
  { key: 'lsoa', name: 'LSOA Boundaries', source: 'Statistical Geography — Wales LSOAs', color: 'var(--welsh-green)' },
];

const PLANNER_LAYERS = [
  { key: 'flood', name: 'Flood Risk Zones', source: 'NRW Flood Map for Planning — Zones 2 & 3', color: 'var(--blue)' },
  { key: 'monuments', name: 'Scheduled Monuments', source: 'Cadw — Ancient Monuments Act 1979', color: 'var(--amber)' },
  { key: 'listed', name: 'Listed Buildings', source: 'Cadw — Planning Act 1990', color: 'var(--amber)' },
  { key: 'worldheritage', name: 'World Heritage Sites', source: 'Cadw — UNESCO designations', color: 'var(--welsh-red)' },
  { key: 'sssi', name: 'SSSI', source: 'NRW — Wildlife & Countryside Act 1981', color: 'var(--welsh-green)' },
  { key: 'nationalpark', name: 'National Parks', source: 'NRW — Wales has three', color: 'var(--welsh-green)' },
  { key: 'lsoa', name: 'LSOA Boundaries', source: 'Context — Statistical Geography', color: 'var(--text-dim)' },
];

interface SidebarProps {
  activeLayers: Record<string, boolean>;
  onToggleLayer: (key: string) => void;
  location: LocationData | null;
  onSearch: (postcode: string) => void;
  wimdDecile: number | null;
  plannerMode: boolean;
  constraints: Record<string, ConstraintResult> | null;
  constraintsLoading: boolean;
}

export default function Sidebar({
  activeLayers,
  onToggleLayer,
  location,
  onSearch,
  wimdDecile,
  plannerMode,
  constraints,
  constraintsLoading,
}: SidebarProps) {
  const layers = plannerMode ? PLANNER_LAYERS : CITIZEN_LAYERS;

  return (
    <aside className="bg-[var(--surface)] border-r border-[var(--border)] flex flex-col overflow-y-auto z-[900]">
      <SearchInput onSearch={onSearch} />

      {/* Layers */}
      <div className="p-5 border-b border-[var(--border)]">
        <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-dim)] font-semibold mb-2.5">
          {plannerMode ? 'Data Layers — Planning' : 'Data Layers'}
        </p>
        {layers.map((layer) => (
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

      {plannerMode ? (
        <div className="p-5 flex-1">
          <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-dim)] font-semibold mb-2.5">
            Site Constraints Check
          </p>
          <ConstraintsPanel
            results={constraints}
            loading={constraintsLoading}
            lat={location?.latitude ?? null}
            lng={location?.longitude ?? null}
          />
        </div>
      ) : (
        <div className="p-5 flex-1">
          <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-dim)] font-semibold mb-2.5">
            Neighbourhood Profile
          </p>
          <ProfilePanel location={location} wimdDecile={wimdDecile} />
        </div>
      )}
    </aside>
  );
}