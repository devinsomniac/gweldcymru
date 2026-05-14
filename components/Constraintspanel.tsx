'use client';

import { useState } from 'react';

export interface ConstraintResult {
  status: 'red' | 'amber' | 'green' | 'unknown';
  label: string;
  detail: string;
}

interface ConstraintsPanelProps {
  results: Record<string, ConstraintResult> | null;
  loading: boolean;
  lat: number | null;
  lng: number | null;
}

const DOT_COLOR: Record<string, string> = {
  red: '#EF4444',
  amber: '#F59E0B',
  green: '#10B981',
  unknown: '#6B7280',
};

// Generates the formatted plain-text report
function generateReportText(
  results: Record<string, ConstraintResult>,
  lat: number,
  lng: number
): string {
  const triggered = Object.values(results).filter(
    (r) => r.status === 'red' || r.status === 'amber'
  );
  const clear = Object.values(results).filter((r) => r.status === 'green');

  const lines: string[] = [
    'GWELDCYMRU — SITE CONSTRAINTS CHECK',
    '====================================',
    `Coordinates: ${lat.toFixed(4)}°N, ${Math.abs(lng).toFixed(4)}°W`,
    `Checked: ${new Date().toLocaleString('en-GB', {
      dateStyle: 'long',
      timeStyle: 'short',
    })}`,
    '',
    `SUMMARY: ${triggered.length} triggered, ${clear.length} clear`,
    '',
    'CONSTRAINTS:',
  ];

  for (const r of Object.values(results)) {
    const tag = r.status === 'red' || r.status === 'amber' ? '[TRIGGERED]' : '[CLEAR]    ';
    lines.push(`${tag} ${r.label}`);
    lines.push(`  ${r.detail}`);
    lines.push('');
  }

  lines.push('Source: DataMapWales · OGL v3.0');

  return lines.join('\n');
}

// Inline button with click-to-copy + visual feedback
function CopyReportButton({
  results,
  lat,
  lng,
}: {
  results: Record<string, ConstraintResult>;
  lat: number;
  lng: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = generateReportText(results, lat, lng);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full bg-[var(--surface2)] border border-[var(--border)] hover:border-[var(--welsh-red)] rounded-[10px] p-3 text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-all duration-200 flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[var(--welsh-green)]">Report copied to clipboard</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy report
        </>
      )}
    </button>
  );
}

export default function ConstraintsPanel({ results, loading, lat, lng }: ConstraintsPanelProps) {
  // Empty state — no site selected yet
  if (!results && !loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-[var(--border)] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-dim)]">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--text-muted)] mb-1">No site selected</p>
        <p className="text-xs text-[var(--text-dim)]">
          Search a postcode or click the map<br />to check site constraints
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 mx-auto mb-3 border-2 border-[var(--border)] border-t-[var(--welsh-red)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Checking constraints…</p>
      </div>
    );
  }

  // Results state
  const entries = Object.entries(results!);
  const triggered = entries.filter(([, r]) => r.status === 'red' || r.status === 'amber');
  const clear = entries.filter(([, r]) => r.status === 'green');

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-[10px] p-3">
        <p className="text-[13px] font-medium text-[var(--text)]">
          <span style={{ color: DOT_COLOR.red }}>{triggered.length} triggered</span>
          {' · '}
          <span style={{ color: DOT_COLOR.green }}>{clear.length} clear</span>
        </p>
        {lat !== null && lng !== null && (
          <p className="text-[11px] text-[var(--text-dim)] mt-1">
            {lat.toFixed(4)}°N, {Math.abs(lng).toFixed(4)}°W
          </p>
        )}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {entries.map(([key, r]) => (
          <div
            key={key}
            className="bg-[var(--surface2)] border border-[var(--border)] rounded-[10px] p-3"
          >
            <div className="flex items-start gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                style={{ background: DOT_COLOR[r.status] }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[var(--text)]">{r.label}</div>
                <p className="text-[11px] text-[var(--text-dim)] mt-0.5">{r.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Copy report button — only when coords are known */}
      {lat !== null && lng !== null && (
        <CopyReportButton results={results!} lat={lat} lng={lng} />
      )}

      {/* Footer meta */}
      <p className="text-[10px] text-[var(--text-dim)] text-center pt-1">
        Checked {new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
      </p>
    </div>
  );
}