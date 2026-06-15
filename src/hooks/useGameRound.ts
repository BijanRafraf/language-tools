'use client';

import { useCallback, useEffect, useState } from 'react';
import { useGameStore, PromptResult } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { VerbGroup } from '@/data/types';
import { checkAnswer } from '@/lib/conjugationEngine';
import { buildDeck, weightedShuffle } from '@/lib/deck';
import fr from '@/data/languages/fr/index';

function getVerbFrequencyWeight(frequency: number | undefined): number {
  const parsed = Number(frequency);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function useGameRound() {
  const {
    phase,
    deck,
    deckIndex,
    results,
    streak,
    longestStreak,
    lastResult,
    isIndefinite,
    startRound,
    submitAnswer,
    nextCard,
    endRound,
    resetGame,
  } = useGameStore();

  const { tenses, pronouns, roundSize, frequencyMode, frequencyTopN, frequencyRangeMin, frequencyRangeMax } =
    useSettingsStore();

  const [inputValue, setInputValue] = useState('');
  const [retypeValue, setRetypeValue] = useState('');

  const currentCard =
    phase === 'playing' || phase === 'feedback'
      ? deck[deckIndex] ?? null
      : null;

  // Reset inputs when the card changes
  useEffect(() => {
    setInputValue('');
    setRetypeValue('');
  }, [deckIndex, phase]);

  // True when the player must retype the correct answer before advancing
  const isRetypeMode =
    phase === 'feedback' && lastResult?.outcome !== 'correct';

  const handleRetypeSubmit = useCallback(
    (answer: string) => {
      if (!lastResult || !isRetypeMode) return;
      const typedNorm = answer.trim().toLowerCase();
      const correctNorm = lastResult.correct.trim().toLowerCase();
      if (typedNorm === correctNorm) nextCard();
    },
    [lastResult, isRetypeMode, nextCard]
  );

  const startNewRound = useCallback(() => {
    const indefinite = roundSize === 'indefinite';
    // Always include all verb groups (classification pending accuracy fix)
    const allVerbGroups: VerbGroup[] = ['er', 'ir', 're', 'irregular'];
    let cards = weightedShuffle(
      buildDeck(fr.verbs, tenses, pronouns, allVerbGroups, frequencyMode, frequencyTopN, frequencyRangeMin, frequencyRangeMax),
      (card) => getVerbFrequencyWeight(card.verb.frequency)
    );
    if (!indefinite && typeof roundSize === 'number') {
      cards = cards.slice(0, roundSize);
    }
    // Guard: nothing to play
    if (cards.length === 0) return;
    startRound(cards, indefinite);
  }, [tenses, pronouns, roundSize, frequencyMode, frequencyTopN, frequencyRangeMin, frequencyRangeMax, startRound]);

  const handleSubmit = useCallback(
    (answer: string) => {
      if (!currentCard || phase !== 'playing') return;
      const correct =
        currentCard.verb.conjugations?.[currentCard.tense]?.[
          currentCard.pronoun
        ] ?? '';
      const outcome = checkAnswer(answer, correct);
      const result: PromptResult = {
        verb: currentCard.verb,
        pronoun: currentCard.pronoun,
        tense: currentCard.tense,
        userAnswer: answer,
        correct,
        outcome,
      };
      submitAnswer(result);
    },
    [currentCard, phase, submitAnswer]
  );

  // Esc ends an indefinite round
  useEffect(() => {
    if (!isIndefinite || (phase !== 'playing' && phase !== 'feedback'))
      return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') endRound();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isIndefinite, phase, endRound]);

  const answeredCount = results.length;
  const totalCards = isIndefinite ? null : deck.length;
  const progressLabel = isIndefinite
    ? `${answeredCount} answered`
    : `${answeredCount} / ${totalCards}`;

  const deckAvailable =
    buildDeck(fr.verbs, tenses, pronouns, ['er', 'ir', 're', 'irregular'], frequencyMode, frequencyTopN, frequencyRangeMin, frequencyRangeMax).length > 0;

  return {
    phase,
    currentCard,
    lastResult,
    isRetypeMode,
    retypeValue,
    setRetypeValue,
    handleRetypeSubmit,
    streak,
    longestStreak,
    results,
    isIndefinite,
    answeredCount,
    totalCards,
    progressLabel,
    inputValue,
    setInputValue,
    deckAvailable,
    startNewRound,
    handleSubmit,
    nextCard,
    endRound,
    resetGame,
  };
}
