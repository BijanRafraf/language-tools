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
    bg: 'border-accent/35 bg-accent/12',
    icon: <Check className="size-5 text-accent-foreground" />,
    label: 'Correct!',
    labelClass: 'text-accent-foreground',
  },
  'near-miss': {
    bg: 'border-primary/20 bg-secondary',
    icon: <AlertCircle className="size-5 text-primary/75" />,
    label: 'Close! Check the accent.',
    labelClass: 'text-primary/80',
  },
  wrong: {
    bg: 'border-destructive/25 bg-destructive/8',
    icon: <X className="size-5 text-destructive" />,
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
          className="rounded-r-2xl rounded-l-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors hover:bg-[#881337] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Continue
          <span className="ml-2 text-xs opacity-50">↵</span>
        </button>
      )}
    </motion.div>
  );
}
