'use client';

import { aggregateScore, letterGrade } from '@/lib/conjugationEngine';
import type { PromptResult } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface Props {
  results: PromptResult[];
  longestStreak: number;
}

const GRADE_COLORS: Record<string, string> = {
  A: 'text-cyan-950 dark:text-cyan-100',
  B: 'text-rose-950 dark:text-rose-200',
  C: 'text-rose-950/80 dark:text-rose-200/80',
  D: 'text-rose-600/80 dark:text-rose-400/80',
  F: 'text-rose-600 dark:text-rose-400',
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
    <div className="border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-6 shadow-panel">
        <h3 className="mb-4 text-xl font-bold text-rose-950 dark:text-rose-100">
        Overall Score
      </h3>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center">
          <span
            className={cn(
              'font-heading text-6xl font-bold tabular-nums sm:text-7xl',
              GRADE_COLORS[grade]
            )}
          >
            {grade}
          </span>
          <span className="mt-1 text-sm text-stone-400">
            {score.toFixed(0)}%
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 py-2">
              <p className="font-semibold text-cyan-950 dark:text-cyan-100">
                {correct}
              </p>
              <p className="text-xs text-stone-400">
                Correct {pct(correct)}
              </p>
            </div>
            <div className="border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 py-2">
              <p className="font-semibold text-rose-950/80 dark:text-rose-200/80">
                {nearMiss}
              </p>
              <p className="text-xs text-stone-400">
                Near-miss {pct(nearMiss)}
              </p>
            </div>
            <div className="border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 py-2">
              <p className="font-semibold text-rose-600 dark:text-rose-400">
                {wrong}
              </p>
              <p className="text-xs text-stone-400">
                Wrong {pct(wrong)}
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-stone-400">
            <span>Total: <strong className="text-rose-950 dark:text-rose-100">{total}</strong></span>
            <span>Best streak: <strong className="text-rose-950 dark:text-rose-100">{longestStreak}</strong></span>
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-700">
        <div
          className="h-full rounded-full bg-sky-50 dark:bg-cyan-900 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}


