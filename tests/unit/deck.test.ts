import { describe, it, expect, vi } from 'vitest';
import { buildDeck, shuffle, weightedShuffle } from '@/lib/deck';
import type { Verb } from '@/data/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const erVerb: Verb = {
  infinitive: 'parler',
  english: 'to speak',
  group: 'er',
  conjugations: {
    present: { je: 'parle', tu: 'parles', 'il/elle': 'parle' },
  },
};

const irregularVerb: Verb = {
  infinitive: 'être',
  english: 'to be',
  group: 'irregular',
  conjugations: {
    present: { je: 'suis', tu: 'es' },
    imparfait: { je: 'étais' },
  },
};

const verbWithNoConjugations: Verb = {
  infinitive: 'finir',
  english: 'to finish',
  group: 'ir',
};

// ---------------------------------------------------------------------------
// buildDeck
// ---------------------------------------------------------------------------

describe('buildDeck', () => {
  it('creates one card per verb-pronoun-tense combination that exists', () => {
    const deck = buildDeck([erVerb], ['present'], ['je', 'tu', 'il/elle'], []);
    expect(deck).toHaveLength(3);
    expect(deck[0]).toMatchObject({ verb: erVerb, tense: 'present', pronoun: 'je' });
  });

  it('skips pronouns that have no conjugation entry for a tense', () => {
    // erVerb has no 'nous' in present
    const deck = buildDeck([erVerb], ['present'], ['je', 'nous'], []);
    expect(deck).toHaveLength(1);
    expect(deck[0].pronoun).toBe('je');
  });

  it('skips tenses that do not exist on a verb', () => {
    // erVerb has no imparfait
    const deck = buildDeck([erVerb], ['imparfait'], ['je'], []);
    expect(deck).toHaveLength(0);
  });

  it('skips verbs with no conjugations property at all', () => {
    const deck = buildDeck([verbWithNoConjugations], ['present'], ['je'], []);
    expect(deck).toHaveLength(0);
  });

  it('filters verbs by group when verbGroups is non-empty', () => {
    const deck = buildDeck(
      [erVerb, irregularVerb],
      ['present'],
      ['je', 'tu'],
      ['er']
    );
    expect(deck.every((c) => c.verb.group === 'er')).toBe(true);
    expect(deck).toHaveLength(2);
  });

  it('includes all verbs when verbGroups is an empty array', () => {
    const deck = buildDeck([erVerb, irregularVerb], ['present'], ['je'], []);
    expect(deck).toHaveLength(2);
  });

  it('produces cards across multiple tenses', () => {
    const deck = buildDeck(
      [irregularVerb],
      ['present', 'imparfait'],
      ['je', 'tu'],
      []
    );
    const presentCards = deck.filter((c) => c.tense === 'present');
    const imparfaitCards = deck.filter((c) => c.tense === 'imparfait');
    expect(presentCards).toHaveLength(2); // je + tu
    expect(imparfaitCards).toHaveLength(1); // je only
  });

  it('returns an empty array when the verb list is empty', () => {
    const deck = buildDeck([], ['present'], ['je'], []);
    expect(deck).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// shuffle
// ---------------------------------------------------------------------------

describe('shuffle', () => {
  it('returns a new array (does not mutate the original)', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    const result = shuffle(original);
    expect(result).not.toBe(original);
    expect(original).toEqual(copy);
  });

  it('returns an array with the same length as the input', () => {
    const arr = [10, 20, 30, 40];
    expect(shuffle(arr)).toHaveLength(arr.length);
  });

  it('contains exactly the same elements as the input', () => {
    const arr = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
    expect(shuffle(arr).sort()).toEqual([...arr].sort());
  });

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffle(['only'])).toEqual(['only']);
  });
});

// ---------------------------------------------------------------------------
// weightedShuffle
// ---------------------------------------------------------------------------

describe('weightedShuffle', () => {
  it('returns the same elements without mutating the original array', () => {
    const original = ['common', 'rare', 'mid'];
    const copy = [...original];

    const result = weightedShuffle(original, () => 1);

    expect(result).not.toBe(original);
    expect(original).toEqual(copy);
    expect(result.sort()).toEqual(copy.sort());
  });

  it('favours higher-weight items when random draws are equal', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const result = weightedShuffle(
      [
        { label: 'rare', weight: 1 },
        { label: 'common', weight: 100 },
      ],
      (item) => item.weight
    );

    expect(result[0].label).toBe('common');
    randomSpy.mockRestore();
  });

  it('falls back to uniform weighting for invalid weights', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const result = weightedShuffle(
      [
        { label: 'missing', weight: 0 },
        { label: 'invalid', weight: Number.NaN },
      ],
      (item) => item.weight
    );

    expect(result.map((item) => item.label).sort()).toEqual([
      'invalid',
      'missing',
    ]);
    randomSpy.mockRestore();
  });
});
