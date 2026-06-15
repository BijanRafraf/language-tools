'use client';

import type { PromptResult } from '@/store/gameStore';
import { OverallScore } from './OverallScore';
import { PronounBreakdown } from './PronounBreakdown';
import { MissedVerbs } from './MissedVerbs';

interface Props {
  results: PromptResult[];
  longestStreak: number;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  showEnglish?: boolean;
}

export function RoundSummary({
  results,
  longestStreak,
  onPlayAgain,
  onChangeSettings,
  showEnglish = true,
}: Props) {
  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="space-y-2 border-b border-stone-300 dark:border-stone-600 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Round review
        </p>
        <h2 className="text-3xl font-bold text-rose-950 dark:text-rose-100">Round Summary</h2>
      </div>
      <OverallScore results={results} longestStreak={longestStreak} />
      <PronounBreakdown results={results} />
      <MissedVerbs results={results} showEnglish={showEnglish} />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 rounded-r-2xl rounded-l-md border border-rose-950 dark:border-rose-200 bg-rose-950 dark:bg-rose-200 py-3 text-sm font-semibold text-rose-50 dark:text-rose-950 shadow-panel transition-colors hover:bg-rose-900 dark:hover:bg-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onChangeSettings}
          className="flex-1 rounded-r-2xl rounded-l-md border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 py-3 text-sm font-semibold text-rose-950 dark:text-rose-100 shadow-panel transition-colors hover:bg-stone-100 dark:hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
        >
          Change settings
        </button>
      </div>
    </div>
  );
}
