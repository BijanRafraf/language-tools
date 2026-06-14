'use client';

import { useGameRound } from '@/hooks/useGameRound';
import { ConjugationCard } from '@/components/game/ConjugationCard';
import { AnswerInput } from '@/components/game/AnswerInput';
import { FeedbackBanner } from '@/components/game/FeedbackBanner';
import { ScoreBar } from '@/components/game/ScoreBar';
import { EndRoundButton } from '@/components/game/EndRoundButton';
import { SettingsPanel } from '@/components/game/SettingsPanel';
import { RoundSummary } from '@/components/game/summary/RoundSummary';

export default function ConjugationPage() {
  const {
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
    progressLabel,
    inputValue,
    setInputValue,
    deckAvailable,
    startNewRound,
    handleSubmit,
    nextCard,
    endRound,
    resetGame,
  } = useGameRound();

  const isPlaying = phase === 'playing' || phase === 'feedback';

  return (
    <div className="flex flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col bg-stone-50 dark:bg-stone-800 px-6 py-8 text-rose-950 dark:text-rose-100 shadow-panel sm:px-8 sm:py-10">
        <div className="border-l-4 border-rose-950 dark:border-rose-200 pl-6">
          <section className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Utility tool</p>
            <h1 className="text-4xl font-bold tracking-tight text-rose-950 dark:text-rose-100 sm:text-5xl">French Verb Conjugation</h1>
            <p className="max-w-xl text-sm leading-6 text-stone-400 sm:text-base">
              Configure a narrow practice set, answer quickly, and review weak spots without dashboard chrome getting in the way.
            </p>
          </section>

          <hr className="my-6 border-0 border-t border-stone-300 dark:border-stone-600" />

          <section className="flex flex-1 flex-col items-center justify-center">
        {isPlaying && (
          <div className="mb-4 flex w-full max-w-xl justify-end">
            <EndRoundButton onEndRound={endRound} />
          </div>
        )}

        {phase === 'idle' && (
          <SettingsPanel
            onStart={startNewRound}
            deckAvailable={deckAvailable}
          />
        )}

        {isPlaying && currentCard && (
          <div className="flex w-full max-w-xl flex-col gap-4">
            <ScoreBar
              streak={streak}
              progressLabel={progressLabel}
              isIndefinite={isIndefinite}
            />
            <ConjugationCard
              card={currentCard}
              cardKey={results.length}
              outcome={lastResult?.outcome ?? null}
            />
            <AnswerInput
              value={isRetypeMode ? retypeValue : inputValue}
              onChange={isRetypeMode ? setRetypeValue : setInputValue}
              onSubmit={isRetypeMode ? handleRetypeSubmit : handleSubmit}
              disabled={phase === 'feedback' && !isRetypeMode}
              cardKey={results.length}
              placeholder={
                isRetypeMode ? 'Type the correct answer…' : 'Type your answer…'
              }
            />
            {phase === 'feedback' && lastResult && (
              <FeedbackBanner
                result={lastResult}
                onContinue={nextCard}
                requireRetype={isRetypeMode}
              />
            )}
          </div>
        )}

        {phase === 'summary' && (
          <RoundSummary
            results={results}
            longestStreak={longestStreak}
            onPlayAgain={() => {
              resetGame();
              startNewRound();
            }}
            onChangeSettings={resetGame}
          />
        )}
          </section>
        </div>
      </main>
    </div>
  );
}
