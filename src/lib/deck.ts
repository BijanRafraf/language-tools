import { Verb, VerbGroup } from '@/data/types';
import type { FrequencyMode } from '@/store/settingsStore';

export interface GameCard {
  verb: Verb;
  pronoun: string;
  tense: string;
}

export function buildDeck(
  verbs: Verb[],
  tenses: string[],
  pronouns: string[],
  verbGroups: VerbGroup[],
  frequencyMode: FrequencyMode = 'all',
  frequencyTopN: number = 10,
  frequencyRangeMin: number = 20,
  frequencyRangeMax: number = 50
): GameCard[] {
  // Sort by frequency (descending) and assign ranks
  const sortedByFreq = [...verbs].sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0));
  const frequencyRank = new Map<string, number>();
  sortedByFreq.forEach((v, i) => frequencyRank.set(v.infinitive, i + 1));

  // Filter by verb groups
  let filtered =
    verbGroups.length === 0
      ? verbs
      : verbs.filter((v) => verbGroups.includes(v.group));

  // Filter by frequency mode
  if (frequencyMode !== 'all') {
    filtered = filtered.filter((v) => {
      const rank = frequencyRank.get(v.infinitive) ?? Infinity;
      if (frequencyMode === 'most-frequent') {
        return rank >= 1 && rank <= frequencyTopN;
      } else if (frequencyMode === 'range') {
        return rank >= frequencyRangeMin && rank <= frequencyRangeMax;
      }
      return true;
    });
  }

  const cards: GameCard[] = [];
  for (const verb of filtered) {
    for (const tense of tenses) {
      const tenseConj = verb.conjugations?.[tense];
      if (!tenseConj) continue;
      for (const pronoun of pronouns) {
        if (!tenseConj[pronoun]) continue;
        cards.push({ verb, pronoun, tense });
      }
    }
  }
  return cards;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normaliseWeight(weight: number): number {
  return Number.isFinite(weight) && weight > 0 ? weight : 1;
}

export function weightedShuffle<T>(
  arr: T[],
  getWeight: (item: T) => number
): T[] {
  return [...arr]
    .map((item) => {
      const weight = normaliseWeight(getWeight(item));
      const random = Math.max(Number.MIN_VALUE, Math.random());
      const score = -Math.log(random) / weight;
      return { item, score };
    })
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);
}
