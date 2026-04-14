// components/SearchInput.tsx
'use client';

import { useState } from 'react';

interface SearchInputProps {
  onSearch: (postcode: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="p-5 border-b border-[var(--border)]">
      <p className="text-[10px] tracking-[2px] uppercase text-[var(--text-dim)] font-semibold mb-2.5">
        Search Postcode
      </p>
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="e.g. CF10 3AT, SA1 1DP"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="w-full py-3 pl-11 pr-4 bg-[var(--surface2)] border-[1.5px] border-[var(--border)] rounded-[10px] text-[var(--text)] text-sm outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--welsh-red)] focus:shadow-[0_0_0_3px_var(--welsh-red-glow)] focus:bg-[var(--surface3)] transition-all duration-200"
        />
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-dim)]">
        Press <kbd className="bg-[var(--surface3)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">Enter</kbd> to search · or click on the map
      </p>
    </div>
  );
}