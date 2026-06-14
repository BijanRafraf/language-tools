'use client';

import { useEffect, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import type { PromptResult } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface Props {
  result: PromptResult;
  onContinue: () => void;
  /** When true, the player must retype the answer — hide the Continue button. */
  requireRetype?: boolean;
}

const CONFIG = {
  correct: {
    bg: 'border-sky-50/35 dark:border-cyan-900/35 bg-sky-50/12 dark:bg-cyan-900/12',
    icon: <Check className="size-5 text-cyan-950 dark:text-cyan-100" />,
    label: 'Correct!',
    labelClass: 'text-accent-foreground',
  },
  'near-miss': {
    bg: 'border-rose-950/20 dark:border-rose-200/20 bg-stone-100 dark:bg-stone-700',
    icon: <AlertCircle className="size-5 text-rose-950/75 dark:text-rose-200/75" />,
    label: 'Close! Check the accent.',
    labelClass: 'text-primary/80',
  },
  wrong: {
    bg: 'border-rose-600/25 dark:border-rose-600/25 bg-rose-600/8 dark:bg-rose-600/8',
    icon: <X className="size-5 text-rose-600 dark:text-rose-400" />,
    label: 'Not quite.',
    labelClass: 'text-destructive',
  },
};

export function FeedbackBanner({ result, onContinue, requireRetype = false }: Props) {
  const continueRef = useRef<HTMLButtonElement>(null);
  const cfg = CONFIG[result.outcome];

  // Focus continue button so Enter advances to next card
  useEffect(() => {
    continueRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onContinue();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'flex w-full flex-col items-start justify-between gap-4 border px-5 py-4 sm:flex-row sm:items-center',
        cfg.bg
      )}
    >
      <div className="flex items-center gap-3">
        {cfg.icon}
        <div className="flex flex-col gap-0.5">
          <span className={cn('text-sm font-semibold', cfg.labelClass)}>
            {cfg.label}
          </span>
          {result.outcome !== 'correct' && (
            <span className="text-sm text-rose-950/80 dark:text-rose-100/80">
              Answer:{' '}
              <span className="font-semibold">{result.correct}</span>
            </span>
          )}
        </div>
      </div>
      {requireRetype ? (
        <span className="text-sm text-muted-foreground">
          Type it correctly ↓
        </span>
      ) : (
        <button
          ref={continueRef}
          type="button"
          onClick={onContinue}
          onKeyDown={handleKeyDown}
          className="rounded-r-2xl rounded-l-md border border-rose-950 dark:border-rose-200 bg-rose-950 dark:bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-50 dark:text-rose-950 shadow-panel transition-colors hover:bg-rose-900 dark:hover:bg-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
        >
          Continue
          <span className="ml-2 text-xs opacity-50">↵</span>
        </button>
      )}
    </motion.div>
  );
}
