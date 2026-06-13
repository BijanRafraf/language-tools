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
      <div className="border border-border bg-card p-6 shadow-[0_8px_18px_rgba(76,5,25,0.12)]">
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Verbs to Review
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          No mistakes this round. The full deck stayed clean.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-6 shadow-[0_8px_18px_rgba(76,5,25,0.12)]">
      <h3 className="mb-4 text-xl font-bold text-foreground">
        Verbs to Review
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({missed.length} verb{missed.length !== 1 ? 's' : ''})
        </span>
      </h3>
      <div className="space-y-4">
        {missed.map((entry) => (
          <div key={entry.infinitive} className="space-y-2 border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-foreground">
                {entry.infinitive}
              </span>
              {entry.english && (
                <span className="text-xs italic text-muted-foreground">
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
                  <span className="font-medium text-foreground/80">
                    {m.pronoun}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold text-foreground">
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
