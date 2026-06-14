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
      className="flex items-center gap-1.5 rounded-r-2xl rounded-l-md border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 px-3 py-2 text-sm font-semibold text-stone-400 shadow-panel transition-colors hover:border-rose-600/40 dark:hover:border-rose-600/40 hover:text-rose-600 dark:hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
    >
      <StopCircle className="size-4" />
      End round
      <span className="ml-1 text-xs opacity-50">Esc</span>
    </button>
  );
}
