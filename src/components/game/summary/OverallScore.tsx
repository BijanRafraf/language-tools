'use client';

import { aggregateScore, letterGrade } from '@/lib/conjugationEngine';
import type { PromptResult } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface Props {
  results: PromptResult[];
  longestStreak: number;
}

const GRADE_COLORS: Record<string, string> = {
  A: 'text-green-600 dark:text-green-400',
  B: 'text-emerald-600 dark:text-emerald-400',
  C: 'text-amber-600 dark:text-amber-400',
  D: 'text-orange-600 dark:text-orange-400',
  F: 'text-red-600 dark:text-red-400',
};

export function OverallScore({ results, longestStreak }: Props) {
  const total = results.length;
  const correct = results.filter((r) => r.outcome === 'correct').length;
  const nearMiss = results.filter((r) => r.outcome === 'near-miss').length;
  const wrong = results.filter((r) => r.outcome === 'wrong').length;
  const score = aggregateScore(results);
  const grade = letterGrade(score);

  const pct = (n: number) =>
    total > 0 ? `${Math.round((n / total) * 100)}%` : '—';

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Overall Score
      </h2>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span
            className={cn(
              'text-6xl font-bold tabular-nums',
              GRADE_COLORS[grade]
            )}
          >
            {grade}
          </span>
          <span className="mt-1 text-sm text-muted-foreground">
            {score.toFixed(0)}%
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg bg-green-50 py-2 dark:bg-green-950/30">
              <p className="font-semibold text-green-700 dark:text-green-400">
                {correct}
              </p>
              <p className="text-xs text-muted-foreground">
                Correct {pct(correct)}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 py-2 dark:bg-amber-950/30">
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                {nearMiss}
              </p>
              <p className="text-xs text-muted-foreground">
                Near-miss {pct(nearMiss)}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 py-2 dark:bg-red-950/30">
              <p className="font-semibold text-red-700 dark:text-red-400">
                {wrong}
              </p>
              <p className="text-xs text-muted-foreground">
                Wrong {pct(wrong)}
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>
              Total:{' '}
              <strong className="text-foreground">{total}</strong>
            </span>
            <span>
              Best streak:{' '}
              <strong className="text-foreground">{longestStreak}</strong>
            </span>
          </div>
        </div>
      </div>
      {/* Score bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}


