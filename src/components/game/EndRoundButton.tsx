'use client';

import { StopCircle } from 'lucide-react';

interface Props {
  onEndRound: () => void;
}

export function EndRoundButton({ onEndRound }: Props) {
  return (
    <button
      type="button"
      onClick={onEndRound}
      className="flex items-center gap-1.5 rounded-r-2xl rounded-l-md border border-border bg-secondary px-3 py-2 text-sm font-semibold text-muted-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <StopCircle className="size-4" />
      End round
      <span className="ml-1 text-xs opacity-50">Esc</span>
    </button>
  );
}
