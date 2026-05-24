# Language Tools

An interactive language-learning web app.

## Features

- **Verb Conjugation Game** — cards show a subject pronoun and infinitive; you type the conjugation and get instant feedback.
- **Accent-aware scoring** — exact match scores full points; accent-only mistakes score 0.5 (near-miss); anything else is wrong.
- **Frequency-weighted practice** — verb frequency data is used to influence deck ordering.
- **Configurable rounds** — choose tense(s), verb groups, pronouns, and round size (10 / 20 / 50 / Indefinite).
- **Indefinite mode** — the deck loops until you end the round manually.
- **Round Summary** — score, grade, streaks, per-pronoun breakdown, per-group breakdown, and missed answers.
- **Light / dark / system theme** — persisted in local storage.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'`) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Base UI / shadcn-style components |
| State | Zustand |
| Animation | Framer Motion |
| Unit tests | Vitest + jest-dom |
| E2E tests | Playwright |
| Hosting | GitHub Pages via GitHub Actions |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/language-tools](http://localhost:3000/language-tools).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Regenerate French verb JSON, then start the Next.js dev server |
| `npm run build` | Regenerate French verb JSON, then build a static export to `out/` |
| `npm run generate-verbs` | Regenerate `verbs.generated.json` from the French CSV source |
| `npm run generate-verbs:debug` | Regenerate JSON with debug output |
| `npm run convert:verbs` | Run the CSV conversion helper script |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Open the Playwright interactive UI |

## Adding a New Language

1. Create `src/data/languages/<code>/index.ts` exporting a `LanguageConfig`.
2. Add the source data and any build-time generation needed for that language.
3. Surface the language on the home page.
4. Reuse the existing engine and UI components, which already consume `LanguageConfig`.

## Attribution

The app includes attribution for frequency data adapted from the FrequencyWords project under CC BY-SA 4.0.
