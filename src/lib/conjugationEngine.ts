export type AnswerOutcome = 'correct' | 'near-miss' | 'wrong';

function normalise(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string
): AnswerOutcome {
  const user = userAnswer.trim();
  const correct = correctAnswer.trim();
  if (user === correct) return 'correct';
  if (normalise(user) === normalise(correct)) return 'near-miss';
  return 'wrong';
}

export function scoreOutcome(outcome: AnswerOutcome): number {
  switch (outcome) {
    case 'correct':
      return 1;
    case 'near-miss':
      return 0.5;
    case 'wrong':
      return 0;
  }
}

export function aggregateScore(results: { outcome: AnswerOutcome }[]): number {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + scoreOutcome(r.outcome), 0);
  return (total / results.length) * 100;
}

export function letterGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
