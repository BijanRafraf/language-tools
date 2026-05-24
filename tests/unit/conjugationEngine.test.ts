import { describe, it, expect } from 'vitest';
import {
  checkAnswer,
  scoreOutcome,
  aggregateScore,
  letterGrade,
} from '@/lib/conjugationEngine';

describe('checkAnswer', () => {
  it('returns correct for an exact match', () => {
    expect(checkAnswer('parle', 'parle')).toBe('correct');
  });

  it('trims surrounding whitespace before comparing', () => {
    expect(checkAnswer('  parle  ', 'parle')).toBe('correct');
    expect(checkAnswer('parle', '  parle  ')).toBe('correct');
  });

  it('returns near-miss when the answer differs only by diacritics (missing accent)', () => {
    expect(checkAnswer('etais', 'étais')).toBe('near-miss');
  });

  it('returns near-miss when the answer differs only by diacritics (extra accent)', () => {
    expect(checkAnswer('parlé', 'parle')).toBe('near-miss');
  });

  it('returns near-miss for a cedilla difference', () => {
    expect(checkAnswer('recois', 'reçois')).toBe('near-miss');
  });

  it('returns wrong for a completely different answer', () => {
    expect(checkAnswer('mange', 'parle')).toBe('wrong');
  });

  it('returns wrong when extra words are present', () => {
    expect(checkAnswer('je parle', 'parle')).toBe('wrong');
  });

  it('returns wrong for an empty answer against a non-empty correct form', () => {
    expect(checkAnswer('', 'parle')).toBe('wrong');
  });

  it('treats a case-only difference as near-miss (normalise lowercases before comparing)', () => {
    // The exact check fails ('PARLE' !== 'parle'), but normalised strings are equal
    expect(checkAnswer('PARLE', 'parle')).toBe('near-miss');
  });
});

describe('scoreOutcome', () => {
  it('returns 1 for correct', () => {
    expect(scoreOutcome('correct')).toBe(1);
  });

  it('returns 0.5 for near-miss', () => {
    expect(scoreOutcome('near-miss')).toBe(0.5);
  });

  it('returns 0 for wrong', () => {
    expect(scoreOutcome('wrong')).toBe(0);
  });
});

describe('aggregateScore', () => {
  it('returns 0 for an empty result set', () => {
    expect(aggregateScore([])).toBe(0);
  });

  it('returns 100 when all answers are correct', () => {
    const results = [{ outcome: 'correct' }, { outcome: 'correct' }] as const;
    expect(aggregateScore(results)).toBe(100);
  });

  it('returns 0 when all answers are wrong', () => {
    const results = [{ outcome: 'wrong' }, { outcome: 'wrong' }] as const;
    expect(aggregateScore(results)).toBe(0);
  });

  it('returns 50 for one correct and one wrong', () => {
    const results = [{ outcome: 'correct' }, { outcome: 'wrong' }] as const;
    expect(aggregateScore(results)).toBe(50);
  });

  it('returns 75 for one correct and one near-miss', () => {
    const results = [{ outcome: 'correct' }, { outcome: 'near-miss' }] as const;
    expect(aggregateScore(results)).toBe(75);
  });

  it('returns 25 for one near-miss and one wrong', () => {
    const results = [{ outcome: 'near-miss' }, { outcome: 'wrong' }] as const;
    expect(aggregateScore(results)).toBe(25);
  });

  it('computes (correct + 0.5 × near-miss) / total × 100 for a mixed set', () => {
    // 2 correct + 1 near-miss + 1 wrong => (2 + 0.5) / 4 × 100 = 62.5
    const results = [
      { outcome: 'correct' },
      { outcome: 'correct' },
      { outcome: 'near-miss' },
      { outcome: 'wrong' },
    ] as const;
    expect(aggregateScore(results)).toBe(62.5);
  });
});

describe('letterGrade', () => {
  it('returns A for scores >= 90', () => {
    expect(letterGrade(90)).toBe('A');
    expect(letterGrade(100)).toBe('A');
    expect(letterGrade(95)).toBe('A');
  });

  it('returns B for scores in [80, 90)', () => {
    expect(letterGrade(80)).toBe('B');
    expect(letterGrade(89)).toBe('B');
  });

  it('returns C for scores in [70, 80)', () => {
    expect(letterGrade(70)).toBe('C');
    expect(letterGrade(79)).toBe('C');
  });

  it('returns D for scores in [60, 70)', () => {
    expect(letterGrade(60)).toBe('D');
    expect(letterGrade(69)).toBe('D');
  });

  it('returns F for scores below 60', () => {
    expect(letterGrade(59)).toBe('F');
    expect(letterGrade(0)).toBe('F');
  });
});
