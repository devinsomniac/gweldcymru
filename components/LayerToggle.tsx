// components/LayerToggle.tsx
'use client';

interface LayerToggleProps {
  layerKey: string;
  name: string;
  source: string;
  color: string;
  active: boolean;
  onToggle: (key: string) => void;
}

const ACTIVE_STYLES: Record<string, string> = {
  wimd: 'border-[var(--welsh-red)] bg-[var(--welsh-red-subtle)]',
  flood: 'border-[var(--blue)] bg-[var(--blue-glow)]',
  floodwarn: 'border-[var(--amber)] bg-[var(--amber-glow)]',
  lsoa: 'border-[var(--welsh-green)] bg-[var(--welsh-green-subtle)]',
};

const TOGGLE_BG: Record<string, string> = {
  wimd: 'bg-[var(--welsh-red)]',
  flood: 'bg-[var(--blue)]',
  floodwarn: 'bg-[var(--amber)]',
  lsoa: 'bg-[var(--welsh-green)]',
};

export default function LayerToggle({ layerKey, name, source, color, active, onToggle }: LayerToggleProps) {
  return (
    <div
      onClick={() => onToggle(layerKey)}
      className={`flex items-center justify-between p-3 bg-[var(--surface2)] border-[1.5px] rounded-[10px] mb-2 cursor-pointer select-none transition-all duration-200 hover:border-[var(--border-light)] hover:bg-[var(--surface3)] ${
        active ? ACTIVE_STYLES[layerKey] : 'border-[var(--border)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
        <div>
          <div className="text-[13px] font-medium text-[var(--text)]">{name}</div>
          <div className="text-[10px] text-[var(--text-dim)] mt-0.5">{source}</div>
        </div>
      </div>

      {/* Toggle switch */}
      <div
        className={`w-9 h-5 rounded-full relative transition-all duration-300 shrink-0 ${
          active ? `${TOGGLE_BG[layerKey]} border-transparent` : 'bg-[var(--surface3)] border border-[var(--border)]'
        }`}
      >
        <div
          className={`absolute w-3.5 h-3.5 rounded-full top-[2.5px] transition-all duration-300 ${
            active ? 'left-[18px] bg-white' : 'left-[2.5px] bg-[var(--text-dim)]'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </div>
    </div>
  );
}