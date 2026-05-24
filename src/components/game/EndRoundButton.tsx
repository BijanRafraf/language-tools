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
      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <StopCircle className="size-4" />
      End round
      <span className="ml-1 text-xs opacity-50">Esc</span>
    </button>
  );
}
