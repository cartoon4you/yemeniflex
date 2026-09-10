'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

export default function CatalogFilters({
  activeType,
  activeSort,
}: {
  activeType: string;
  activeSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === 'all' || !val) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    params.set('page', '1');
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-neutral-900/60 p-3.5 sm:p-4 rounded-2xl border border-neutral-800/80">
      {/* Type Filter */}
      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-xs text-neutral-400 ml-1 sm:ml-2">النوع:</span>
        {[
          { id: 'all', label: 'الكل' },
          { id: 'movie', label: 'أفلام فقط' },
          { id: 'series', label: 'مسلسلات فقط' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => updateFilters({ type: t.id })}
            className={`px-3 py-2 min-h-[40px] flex items-center justify-center rounded-xl text-xs font-medium transition cursor-pointer active:scale-95 ${
              activeType === t.id
                ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                : 'text-neutral-400 hover:text-white bg-neutral-900/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        <span className="text-xs text-neutral-400 shrink-0">الترتيب:</span>
        <select
          value={activeSort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full sm:w-auto bg-neutral-950 text-xs text-neutral-200 border border-neutral-800 rounded-xl px-3 py-2 min-h-[40px] focus:outline-none focus:border-red-600 cursor-pointer"
        >
          <option value="latest">الأحدث إضافة</option>
          <option value="rating">الأعلى تقييماً (IMDb)</option>
          <option value="year">سنة الإنتاج</option>
        </select>
      </div>
    </div>
  );
}
