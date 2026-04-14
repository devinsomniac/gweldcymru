// components/ProfilePanel.tsx
'use client';

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

interface ProfilePanelProps {
  location: LocationData | null;
  wimdDecile: number | null;
}

const LABELS = ['', 'Most Deprived', 'Very High', 'High', 'Above Avg', 'Average', 'Average', 'Below Avg', 'Low', 'Very Low', 'Least Deprived'];
const COLORS = ['', '#dc2626', '#e54545', '#ea580c', '#e8a317', '#ca8a04', '#84cc16', '#22c55e', '#16a34a', '#059669', '#047857'];

export default function ProfilePanel({ location, wimdDecile }: ProfilePanelProps) {
  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-5 py-10">
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[var(--welsh-red-subtle)] to-[var(--welsh-green-subtle)] border border-[var(--border)] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--text-muted)]">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-[17px] font-semibold mb-2 text-[var(--text)]">No location selected</h3>
        <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-[240px]">
          Search a Welsh postcode or click on the map to explore neighbourhood data
        </p>
      </div>
    );
  }

  const stats = [
    { label: 'Ward', value: location.admin_ward },
    { label: 'Constituency', value: location.parliamentary_constituency },
    { label: 'LSOA', value: location.lsoa },
    { label: 'MSOA', value: location.msoa },
    { label: 'Latitude', value: location.latitude?.toFixed(5) },
    { label: 'Longitude', value: location.longitude?.toFixed(5) },
  ];

  return (
    <div className="animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--welsh-red)] via-[#8b1525] to-[var(--welsh-green)] p-5 rounded-t-[14px] relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-[120px] h-[120px] bg-white/[0.04] rounded-full" />
        <h2 className="font-[family-name:var(--font-display)] text-[22px] font-extrabold text-white relative">
          {location.postcode || 'Selected Location'}
        </h2>
        <p className="text-[12px] text-white/65 mt-1 relative">{location.admin_district || '—'}</p>
      </div>

      {/* Body */}
      <div className="bg-[var(--surface2)] border-[1.5px] border-[var(--border)] border-t-0 rounded-b-[14px] p-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
              <div className="text-[9px] tracking-[1.2px] uppercase text-[var(--text-dim)] font-semibold mb-0.5">
                {s.label}
              </div>
              <div className="text-[13px] font-semibold text-[var(--text)] leading-tight">
                {s.value || '—'}
              </div>
            </div>
          ))}
        </div>

        {/* Deprivation bar */}
        {wimdDecile && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] tracking-[1.2px] uppercase text-[var(--text-dim)] font-semibold">
                WIMD Deprivation Decile
              </span>
              <span
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: COLORS[wimdDecile] + '22',
                  color: COLORS[wimdDecile],
                }}
              >
                {wimdDecile}/10 — {LABELS[wimdDecile]}
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-1000"
                style={{
                  width: `${wimdDecile * 10}%`,
                  background: `linear-gradient(90deg, ${COLORS[1]}, ${COLORS[wimdDecile]})`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[var(--text-dim)]">1 — Most deprived</span>
              <span className="text-[9px] text-[var(--text-dim)]">10 — Least deprived</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}