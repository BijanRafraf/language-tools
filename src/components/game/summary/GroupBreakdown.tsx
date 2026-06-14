'use client';

import type { PromptResult } from '@/store/gameStore';
import type { VerbGroup } from '@/data/types';
import { cn } from '@/lib/utils';

interface Props {
  results: PromptResult[];
}

interface GroupStats {
  group: VerbGroup;
  label: string;
  correct: number;
  nearMiss: number;
  wrong: number;
  total: number;
  accuracy: number;
}

const GROUP_LABELS: Record<VerbGroup, string> = {
  er: 'Regular -er',
  ir: 'Regular -ir',
  re: 'Regular -re',
  irregular: 'Irregular',
};

function computeStats(results: PromptResult[]): GroupStats[] {
  const map = new Map<VerbGroup, GroupStats>();
  for (const r of results) {
    const g = r.verb.group;
    if (!map.has(g)) {
      map.set(g, {
        group: g,
        label: GROUP_LABELS[g],
        correct: 0,
        nearMiss: 0,
        wrong: 0,
        total: 0,
        accuracy: 0,
      });
    }
    const s = map.get(g)!;
    s.total++;
    if (r.outcome === 'correct') s.correct++;
    else if (r.outcome === 'near-miss') s.nearMiss++;
    else s.wrong++;
  }
  return [...map.values()]
    .map((s) => ({
      ...s,
      accuracy: s.total > 0 ? ((s.correct + s.nearMiss * 0.5) / s.total) * 100 : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function GroupBreakdown({ results }: Props) {
  const stats = computeStats(results);
  if (stats.length === 0) return null;

  return (
    <div className="border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-6 shadow-panel">
        <h3 className="mb-4 text-xl font-bold text-rose-950 dark:text-rose-100">
        By Verb Group
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            <th className="pb-2 pr-4">Group</th>
            <th className="pb-2 pr-4 text-right text-cyan-950 dark:text-cyan-100">✓</th>
            <th className="pb-2 pr-4 text-right text-rose-950/80 dark:text-rose-200/80">~</th>
            <th className="pb-2 pr-4 text-right text-rose-600 dark:text-rose-400">✗</th>
            <th className="pb-2 text-right">Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {stats.map((s) => (
            <tr key={s.group} className="text-rose-950 dark:text-rose-100">
              <td className="py-2 pr-4 font-medium">{s.label}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.correct}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.nearMiss}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.wrong}</td>
              <td
                className={cn(
                  'py-2 text-right font-semibold tabular-nums',
                  s.accuracy >= 80
                    ? 'text-cyan-950 dark:text-cyan-100'
                    : s.accuracy >= 60
                    ? 'text-rose-950/80 dark:text-rose-200/80'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {Math.round(s.accuracy)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
