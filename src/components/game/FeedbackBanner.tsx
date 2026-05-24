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
    bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
    icon: <Check className="size-5 text-green-600 dark:text-green-400" />,
    label: 'Correct!',
    labelClass: 'text-green-700 dark:text-green-400',
  },
  'near-miss': {
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    icon: <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />,
    label: 'Close! Check the accent.',
    labelClass: 'text-amber-700 dark:text-amber-400',
  },
  wrong: {
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
    icon: <X className="size-5 text-red-600 dark:text-red-400" />,
    label: 'Not quite.',
    labelClass: 'text-red-700 dark:text-red-400',
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
        'flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4',
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
            <span className="text-sm text-foreground/80">
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
          className="rounded-lg bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Continue
          <span className="ml-2 text-xs opacity-50">↵</span>
        </button>
      )}
    </motion.div>
  );
}
