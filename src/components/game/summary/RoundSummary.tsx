'use client';

import type { PromptResult } from '@/store/gameStore';
import { OverallScore } from './OverallScore';
import { PronounBreakdown } from './PronounBreakdown';
import { GroupBreakdown } from './GroupBreakdown';
import { MissedVerbs } from './MissedVerbs';

interface Props {
  results: PromptResult[];
  longestStreak: number;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export function RoundSummary({
  results,
  longestStreak,
  onPlayAgain,
  onChangeSettings,
}: Props) {
  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="space-y-2 border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Round review
        </p>
        <h2 className="text-3xl font-bold text-foreground">Round Summary</h2>
      </div>
      <OverallScore results={results} longestStreak={longestStreak} />
      <PronounBreakdown results={results} />
      <GroupBreakdown results={results} />
      <MissedVerbs results={results} />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 rounded-r-2xl rounded-l-md border border-primary bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors hover:bg-[#881337] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onChangeSettings}
          className="flex-1 rounded-r-2xl rounded-l-md border border-border bg-secondary py-3 text-sm font-semibold text-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Change settings
        </button>
      </div>
    </div>
  );
}
