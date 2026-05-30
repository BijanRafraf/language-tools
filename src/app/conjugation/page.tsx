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
    <div className="flex flex-1 flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        {isPlaying && (
          <div className="mb-4 flex w-full max-w-md justify-end">
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
          <div className="flex w-full max-w-md flex-col gap-4">
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
      </main>
    </div>
  );
}
