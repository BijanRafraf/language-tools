# AGENTS.md — Codebase Guide for AI Agents

Quick-reference for any AI agent picking up this repository.

---

## What this project is

A static Next.js web app (`output: 'export'`) for language learners. The first and currently only feature is a **French Verb Conjugation Game**. The architecture is intentionally language-agnostic so additional languages are a data-only addition.

---

## Commands

```bash
npm run dev          # dev server → http://localhost:3000/language-tools
npm run build        # production static export → out/
npm test             # Vitest unit tests (CI mode, no watch)
npm run test:watch   # Vitest interactive watch
npm run test:e2e     # Playwright e2e (auto-starts dev server)
npm run lint         # ESLint
```

Always run `npm test` after touching `src/lib/` and `npm run build` before declaring a feature complete.

---

## Key files and their responsibilities

| File | Purpose |
|---|---|
| `src/lib/conjugationEngine.ts` | `checkAnswer` (exact / near-miss / wrong), `scoreOutcome`, `aggregateScore`, `letterGrade` |
| `src/lib/deck.ts` | `buildDeck` (filter + cartesian product of verbs × tenses × pronouns), `shuffle` |
| `src/hooks/useGameRound.ts` | High-level game orchestration: builds/starts round, handles submit, Esc shortcut, progress label |
| `src/store/gameStore.ts` | Zustand store — phase, deck, deckIndex, results, streak, longestStreak |
| `src/store/settingsStore.ts` | Zustand store (persisted) — tenses, verbGroups, pronouns, roundSize, theme |
| `src/data/types.ts` | All shared TypeScript types: `Verb`, `LanguageConfig`, `TenseConfig`, etc. |
| `src/data/languages/fr/index.ts` | French `LanguageConfig` — pronouns, tenses (present / imparfait / passé composé), verbs |
| `src/app/conjugation/page.tsx` | Conjugation game route — composes all game components using `useGameRound` |
| `src/app/page.tsx` | Home screen with links to available games |
| `tests/unit/` | Vitest unit tests for `conjugationEngine` and `deck` |
| `tests/e2e/` | Playwright tests for fixed rounds and indefinite mode |
| `vitest.config.ts` | Vitest config — jsdom environment, `@/` alias, includes only `tests/unit/` |
| `playwright.config.ts` | Playwright config — Chromium only, `baseURL` localhost:3000, auto-starts dev server |

---

## Game state machine

```
idle → playing → feedback → playing → … → summary
                                     ↘ (endRound / Esc) → summary
```

- `idle`: settings panel shown, no round active.
- `playing`: a card is displayed, input is enabled.
- `feedback`: answer submitted, `FeedbackBanner` shown, input disabled.
- `summary`: `RoundSummary` shown.

Transitions live in `gameStore` (`startRound`, `submitAnswer`, `nextCard`, `endRound`, `resetGame`).

In **indefinite mode** (`isIndefinite: true`) `nextCard` wraps the deck index back to 0 instead of transitioning to `summary`.

---

## Scoring rules

- Exact match → `correct` (1 pt)
- Differs only by diacritics (accent marks) → `near-miss` (0.5 pt)
- Anything else → `wrong` (0 pt)
- Aggregate score: `(correct + 0.5 × near-miss) / total × 100`
- Letter grade: A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F < 60

Detection: `normalise(s)` trims, lowercases, and strips diacritics via `str.normalize('NFD').replace(/\p{Diacritic}/gu, '')`.

---

## Data model

```ts
interface Verb {
  infinitive: string        // "parler"
  english?: string          // "to speak"
  group: 'er' | 'ir' | 're' | 'irregular'
  auxiliary?: 'avoir' | 'être'
  conjugations?: {
    [tense: string]: {
      [pronoun: string]: string  // "je" → "parle"
    }
  }
}

interface LanguageConfig {
  code: string              // "fr"
  label: string             // "French"
  pronouns: string[]
  tenses: TenseConfig[]
  verbs: Verb[]
}
```

---

## Styling conventions

- Tailwind CSS v4 utility classes throughout; no CSS modules.
- Dark mode via `darkMode: 'class'` — the `dark` class is toggled on `<html>` at mount time by reading `settingsStore`.
- shadcn/ui CSS variables (`--background`, `--foreground`, `--card`, etc.) defined in `src/app/globals.css` for both `:root` and `.dark`.
- `cn()` from `src/lib/utils.ts` combines `clsx` + `tailwind-merge`.

---

## Adding a new language

1. Create `src/data/languages/<code>/index.ts` exporting a `LanguageConfig`.
2. Import it in `src/app/page.tsx` and add a link card to the home screen.
3. Pass the new config into `useGameRound` (or add a language selector that sets active config in a store).
4. No changes to `conjugationEngine`, `deck`, or any UI components are needed.

---

## Adding a new tense to French

1. Add the conjugation data under each `Verb.conjugations[tense]` in `src/data/languages/fr/index.ts`.
2. Add the tense to the `tenses` array in the same file.
3. Add a `{ key, label }` entry to the `TENSES` array in `src/components/game/SettingsPanel.tsx`.

---

## Testing guidance

- Unit tests are in `tests/unit/` and use Vitest. Run with `npm test`.
- E2E tests are in `tests/e2e/` and use Playwright. Run with `npm run test:e2e`. They require the dev server (started automatically by the Playwright config).
- E2E tests clear `localStorage` in `beforeEach` to avoid settings bleed between tests.
- Do **not** import Playwright's `test`/`expect` in Vitest files (they are picked up by Vitest but `@playwright/test` globals will error). The `vitest.config.ts` `include` pattern keeps them separated.

---

## What does NOT exist yet (Phase 2 ideas from SPEC)

- "Practice weak verbs" action on the summary screen
- Saving a custom practice deck
- User accounts / Supabase backend
- Spanish, German, or other languages
- GitHub Actions deploy workflow (`.github/workflows/deploy.yml`)
