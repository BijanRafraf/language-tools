'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { GameCard } from '@/lib/deck';
import type { AnswerOutcome } from '@/lib/conjugationEngine';
import fr from '@/data/languages/fr/index';

interface Props {
  card: GameCard;
  /** Increments each time a new card is shown — triggers slide-in. */
  cardKey: number;
  outcome: AnswerOutcome | null;
  showEnglish?: boolean;
}

function tenseLabelFor(tenseKey: string): string {
  return fr.tenses.find((t) => t.key === tenseKey)?.label ?? tenseKey;
}

export function ConjugationCard({ card, cardKey, outcome, showEnglish = true }: Props) {
  const controls = useAnimation();

  // Slide in when card changes
  useEffect(() => {
    controls.set({ x: 40, opacity: 0 });
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardKey]);

  // Shake/pop on feedback
  useEffect(() => {
    if (outcome === 'wrong') {
      controls.start({
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        transition: { duration: 0.45 },
      });
    } else if (outcome === 'near-miss') {
      controls.start({
        x: [0, -5, 5, -3, 3, 0],
        transition: { duration: 0.35 },
      });
    } else if (outcome === 'correct') {
      controls.start({
        scale: [1, 1.06, 0.97, 1.02, 1],
        transition: { duration: 0.38, ease: 'easeInOut' },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  return (
    <motion.div
      animate={controls}
      className="relative flex w-full flex-col items-center gap-6 border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-8 py-10 text-center shadow-panel"
    >
      {outcome === 'correct' && (
        <motion.div
          key="correct-flash"
          initial={{ opacity: 0.45 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 bg-sky-50/18 dark:bg-cyan-900/18"
        />
      )}
      <span className="border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 px-4 py-1 text-sm font-medium text-stone-400">
        {tenseLabelFor(card.tense)}
      </span>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-heading text-5xl font-bold tracking-tight text-rose-950 dark:text-rose-100 sm:text-6xl">
          {card.pronoun}
        </span>
        <span className="text-2xl font-semibold text-rose-950/85 dark:text-rose-200/85">
          {card.verb.infinitive}
        </span>
        {showEnglish && card.verb.english && (
          <span className="text-sm italic text-stone-400">
            {card.verb.english}
          </span>
        )}
      </div>
    </motion.div>
  );
}
