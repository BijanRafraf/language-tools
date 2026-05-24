'use client';

import { useGameRound } from '@/hooks/useGameRound';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ConjugationCard } from '@/components/game/ConjugationCard';
import { AnswerInput } from '@/components/game/AnswerInput';
import { FeedbackBanner } from '@/components/game/FeedbackBanner';
import { ScoreBar } from '@/components/game/ScoreBar';
import { EndRoundButton } from '@/components/game/EndRoundButton';
import { SettingsPanel } from '@/components/game/SettingsPanel';
import { RoundSummary } from '@/components/game/summary/RoundSummary';
import Link from 'next/link';

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
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors"
        >
          Language Tools
        </Link>
        <div className="flex items-center gap-3">
          {isPlaying && (
            <EndRoundButton onEndRound={endRound} />
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center p-6">
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
