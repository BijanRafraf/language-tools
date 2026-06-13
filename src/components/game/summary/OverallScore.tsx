'use client';

import { aggregateScore, letterGrade } from '@/lib/conjugationEngine';
import type { PromptResult } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface Props {
  results: PromptResult[];
  longestStreak: number;
}

const GRADE_COLORS: Record<string, string> = {
  A: 'text-accent-foreground',
  B: 'text-primary',
  C: 'text-primary/80',
  D: 'text-destructive/80',
  F: 'text-destructive',
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
    <div className="border border-border bg-card p-6 shadow-[0_8px_18px_rgba(76,5,25,0.12)]">
      <h3 className="mb-4 text-xl font-bold text-foreground">
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
          <span className="mt-1 text-sm text-muted-foreground">
            {score.toFixed(0)}%
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="border border-border bg-secondary py-2">
              <p className="font-semibold text-accent-foreground">
                {correct}
              </p>
              <p className="text-xs text-muted-foreground">
                Correct {pct(correct)}
              </p>
            </div>
            <div className="border border-border bg-secondary py-2">
              <p className="font-semibold text-primary/80">
                {nearMiss}
              </p>
              <p className="text-xs text-muted-foreground">
                Near-miss {pct(nearMiss)}
              </p>
            </div>
            <div className="border border-border bg-secondary py-2">
              <p className="font-semibold text-destructive">
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
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}


