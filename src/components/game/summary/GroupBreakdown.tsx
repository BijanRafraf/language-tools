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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        By Verb Group
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="pb-2 pr-4">Group</th>
            <th className="pb-2 pr-4 text-right text-green-600 dark:text-green-400">✓</th>
            <th className="pb-2 pr-4 text-right text-amber-600 dark:text-amber-400">~</th>
            <th className="pb-2 pr-4 text-right text-red-600 dark:text-red-400">✗</th>
            <th className="pb-2 text-right">Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {stats.map((s) => (
            <tr key={s.group} className="text-foreground">
              <td className="py-2 pr-4 font-medium">{s.label}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.correct}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.nearMiss}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.wrong}</td>
              <td
                className={cn(
                  'py-2 text-right font-semibold tabular-nums',
                  s.accuracy >= 80
                    ? 'text-green-600 dark:text-green-400'
                    : s.accuracy >= 60
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400'
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
