'use client';

import type { PromptResult } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface Props {
  results: PromptResult[];
}

interface PronounStats {
  pronoun: string;
  correct: number;
  nearMiss: number;
  wrong: number;
  total: number;
  accuracy: number;
}

function computeStats(results: PromptResult[]): PronounStats[] {
  const map = new Map<string, PronounStats>();
  for (const r of results) {
    if (!map.has(r.pronoun)) {
      map.set(r.pronoun, {
        pronoun: r.pronoun,
        correct: 0,
        nearMiss: 0,
        wrong: 0,
        total: 0,
        accuracy: 0,
      });
    }
    const s = map.get(r.pronoun)!;
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

export function PronounBreakdown({ results }: Props) {
  const stats = computeStats(results);
  if (stats.length === 0) return null;

  return (
    <div className="border border-border bg-card p-6 shadow-[0_8px_18px_rgba(76,5,25,0.12)]">
      <h3 className="mb-4 text-xl font-bold text-foreground">
        By Pronoun
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <th className="pb-2 pr-4">Pronoun</th>
            <th className="pb-2 pr-4 text-right text-accent-foreground">✓</th>
            <th className="pb-2 pr-4 text-right text-primary/80">~</th>
            <th className="pb-2 pr-4 text-right text-destructive">✗</th>
            <th className="pb-2 text-right">Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {stats.map((s) => (
            <tr key={s.pronoun} className="text-foreground">
              <td className="py-2 pr-4 font-medium">{s.pronoun}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.correct}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.nearMiss}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{s.wrong}</td>
              <td
                className={cn(
                  'py-2 text-right font-semibold tabular-nums',
                  s.accuracy >= 80
                    ? 'text-accent-foreground'
                    : s.accuracy >= 60
                    ? 'text-primary/80'
                    : 'text-destructive'
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
