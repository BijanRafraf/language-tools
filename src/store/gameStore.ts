import { create } from 'zustand';
import type { GameCard } from '@/lib/deck';
import type { AnswerOutcome } from '@/lib/conjugationEngine';
import { Verb } from '@/data/types';

export type { GameCard };
export type GamePhase = 'idle' | 'playing' | 'feedback' | 'summary';

export interface PromptResult {
  verb: Verb;
  pronoun: string;
  tense: string;
  userAnswer: string;
  correct: string;
  outcome: AnswerOutcome;
}

interface GameState {
  phase: GamePhase;
  deck: GameCard[];
  deckIndex: number;
  results: PromptResult[];
  streak: number;
  longestStreak: number;
  lastResult: PromptResult | null;
  isIndefinite: boolean;
}

interface GameActions {
  startRound: (cards: GameCard[], isIndefinite: boolean) => void;
  submitAnswer: (result: PromptResult) => void;
  nextCard: () => void;
  endRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  phase: 'idle',
  deck: [],
  deckIndex: 0,
  results: [],
  streak: 0,
  longestStreak: 0,
  lastResult: null,
  isIndefinite: false,

  startRound: (cards, isIndefinite) =>
    set({
      phase: 'playing',
      deck: cards,
      deckIndex: 0,
      results: [],
      streak: 0,
      longestStreak: 0,
      lastResult: null,
      isIndefinite,
    }),

  submitAnswer: (result) =>
    set((state) => {
      const newStreak =
        result.outcome !== 'wrong' ? state.streak + 1 : 0;
      return {
        results: [...state.results, result],
        streak: newStreak,
        longestStreak: Math.max(state.longestStreak, newStreak),
        lastResult: result,
        phase: 'feedback' as GamePhase,
      };
    }),

  nextCard: () =>
    set((state) => {
      const nextIndex = state.deckIndex + 1;
      const atEnd = nextIndex >= state.deck.length;
      const newIndex = state.isIndefinite && atEnd ? 0 : nextIndex;
      const isFinished = !state.isIndefinite && atEnd;
      return {
        deckIndex: newIndex,
        lastResult: null,
        phase: (isFinished ? 'summary' : 'playing') as GamePhase,
      };
    }),

  endRound: () => set({ phase: 'summary' }),

  resetGame: () =>
    set({
      phase: 'idle',
      deck: [],
      deckIndex: 0,
      results: [],
      streak: 0,
      longestStreak: 0,
      lastResult: null,
      isIndefinite: false,
    }),
}));
