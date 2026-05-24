#!/usr/bin/env node
/**
 * Reads src/data/languages/fr/data.csv and writes
 * src/data/languages/fr/verbs.generated.json with the parsed Verb[] array.
 *
 * Run: node scripts/generate-verbs.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, '../src/data/languages/fr/data.csv');
const OUT_PATH = join(__dirname, '../src/data/languages/fr/verbs.generated.json');

// ── CSV helpers ──────────────────────────────────────────────────────────────

/** Parse a single CSV line, respecting quoted fields and escaped quotes. */
function splitLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const nextChar = line[index + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

/** When a cell contains "form1;form2" alternatives, return only the first. */
function firstForm(value) {
  if (!value || value.trim() === '') return '';
  return value.split(';')[0].trim();
}

// ── Pronoun / person mapping ─────────────────────────────────────────────────

const PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const PERSONS = [
  'first person singular',
  'second person singular',
  'third person singular',
  'first person plural',
  'second person plural',
  'third person plural',
];

// Conjugated auxiliary forms (value only — the pronoun is shown separately in the UI)
const AVOIR_FORMS = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const ETRE_FORMS  = ['suis', 'es', 'est', 'sommes', '\u00eates', 'sont'];

// ── Group inference ──────────────────────────────────────────────────────────

function inferGroup(infinitive) {
  if (infinitive.endsWith('er')) return 'er';
  if (infinitive.endsWith('ir')) return 'ir';
  if (infinitive.endsWith('re')) return 're';
  return 'irregular';
}

// ── Main ─────────────────────────────────────────────────────────────────────

const DEBUG = process.argv.includes('--debug');

const raw   = readFileSync(CSV_PATH, 'utf-8');
const lines = raw.split(/\r?\n/).filter(l => l.trim() !== '');
const headers = splitLine(lines[0]).map((header) => header.trim());

const verbs = [];

for (let i = 1; i < lines.length; i++) {
  const values = splitLine(lines[i]);
  /** @type {Record<string, string>} */
  const row = Object.fromEntries(headers.map((h, idx) => [h, values[idx] ?? '']));

  const infinitive = row['infinitive']?.trim();
  if (!infinitive) continue;

  const english = row['english']?.trim();

  if (DEBUG && i <= 3) {
    console.log('[generate-verbs:debug]', {
      line: i + 1,
      infinitive,
      lastHeader: headers.at(-1),
      headerCount: headers.length,
      valueCount: values.length,
      english,
    });
  }

  const pp  = firstForm(row['past participle']);
  const aux = firstForm(row['compound verb'] || 'avoir');
  const auxForms = aux === '\u00eatre' ? ETRE_FORMS : AVOIR_FORMS;

  const present      = {};
  const imparfait    = {};
  const passeCompose = {};

  PERSONS.forEach((person, idx) => {
    const pronoun = PRONOUNS[idx];

    const pForm = firstForm(row[`indicative|present|${person}`]);
    const iForm = firstForm(row[`indicative|imperfect|${person}`]);

    if (pForm) present[pronoun]   = pForm;
    if (iForm) imparfait[pronoun] = iForm;
    if (pp)    passeCompose[pronoun] = `${auxForms[idx]} ${pp}`;
  });

  const conjugations = {};
  if (Object.keys(present).length)      conjugations['present']       = present;
  if (Object.keys(imparfait).length)    conjugations['imparfait']     = imparfait;
  if (Object.keys(passeCompose).length) conjugations['passe-compose'] = passeCompose;

  // Skip verbs with no usable conjugation data
  if (Object.keys(conjugations).length === 0) continue;

  const parsedFrequency = Number.parseInt(row['frequency']?.trim() || '', 10);
  const frequency = Number.isFinite(parsedFrequency) ? parsedFrequency : undefined;

  verbs.push({
    infinitive,
    english,
    frequency,
    group: inferGroup(infinitive),
    conjugations,
  });
}

writeFileSync(OUT_PATH, JSON.stringify(verbs), 'utf-8');
console.log(`\u2713 Generated ${verbs.length} verbs \u2192 ${OUT_PATH}`);
if (DEBUG) {
  console.log('[generate-verbs:debug] sample output', {
    firstVerb: verbs[0]?.infinitive,
    firstEnglish: verbs[0]?.english,
  });
}
