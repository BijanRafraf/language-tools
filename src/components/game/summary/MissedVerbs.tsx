'use client';

import type { PromptResult } from '@/store/gameStore';

interface Props {
  results: PromptResult[];
}

interface MissedEntry {
  infinitive: string;
  english?: string;
  misses: { pronoun: string; tense: string; correct: string; outcome: 'near-miss' | 'wrong' }[];
}

function computeMissed(results: PromptResult[]): MissedEntry[] {
  const map = new Map<string, MissedEntry>();
  for (const r of results) {
    if (r.outcome === 'correct') continue;
    const key = r.verb.infinitive;
    if (!map.has(key)) {
      map.set(key, {
        infinitive: r.verb.infinitive,
        english: r.verb.english,
        misses: [],
      });
    }
    map.get(key)!.misses.push({
      pronoun: r.pronoun,
      tense: r.tense,
      correct: r.correct,
      outcome: r.outcome as 'near-miss' | 'wrong',
    });
  }
  return [...map.values()].sort((a, b) =>
    a.infinitive.localeCompare(b.infinitive)
  );
}

export function MissedVerbs({ results }: Props) {
  const missed = computeMissed(results);
  if (missed.length === 0) {
    return (
      <div className="border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-6 shadow-panel">
        <h3 className="mb-2 text-xl font-bold text-rose-950 dark:text-rose-100">
          Verbs to Review
        </h3>
        <p className="text-sm leading-6 text-stone-400">
          No mistakes this round. The full deck stayed clean.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 p-6 shadow-panel">
      <h3 className="mb-4 text-xl font-bold text-rose-950 dark:text-rose-100">
        Verbs to Review
        <span className="ml-2 text-sm font-normal text-stone-400">
          ({missed.length} verb{missed.length !== 1 ? 's' : ''})
        </span>
      </h3>
      <div className="space-y-4">
        {missed.map((entry) => (
          <div key={entry.infinitive} className="space-y-2 border-b border-stone-300/70 dark:border-stone-600/70 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-rose-950 dark:text-rose-100">
                {entry.infinitive}
              </span>
              {entry.english && (
                <span className="text-xs italic text-stone-400">
                  {entry.english}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.misses.map((m, i) => (
                <span
                  key={i}
                  className={
                    m.outcome === 'near-miss'
                      ? 'inline-flex items-center gap-1 border border-primary/15 bg-secondary px-2 py-1 text-xs'
                      : 'inline-flex items-center gap-1 border border-destructive/20 bg-destructive/8 px-2 py-1 text-xs'
                  }
                >
                  <span className="font-medium text-rose-950/80 dark:text-rose-100/80">
                    {m.pronoun}
                  </span>
                  <span className="text-stone-400">→</span>
                  <span className="font-semibold text-rose-950 dark:text-rose-100">
                    {m.correct}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
