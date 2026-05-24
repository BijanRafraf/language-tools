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
    <div className="w-full max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Round Summary</h1>
      <OverallScore results={results} longestStreak={longestStreak} />
      <PronounBreakdown results={results} />
      <GroupBreakdown results={results} />
      <MissedVerbs results={results} />
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onChangeSettings}
          className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Change settings
        </button>
      </div>
    </div>
  );
}
