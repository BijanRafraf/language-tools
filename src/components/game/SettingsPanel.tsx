'use client';

import { useSettingsStore, RoundSize } from '@/store/settingsStore';
import { VerbGroup } from '@/data/types';
import { cn } from '@/lib/utils';

const TENSES = [
  { key: 'present', label: 'Présent' },
  { key: 'imparfait', label: 'Imparfait' },
  { key: 'passe-compose', label: 'Passé composé' },
  { key: 'futur', label: 'Futur simple' },
  { key: 'conditionnel', label: 'Conditionnel présent' },
];

const VERB_GROUPS: { key: VerbGroup; label: string }[] = [
  { key: 'er', label: 'Regular -er' },
  { key: 'ir', label: 'Regular -ir' },
  { key: 're', label: 'Regular -re' },
  { key: 'irregular', label: 'Irregular' },
];

const PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

const ROUND_SIZES: { value: RoundSize; label: string }[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 'indefinite', label: '∞' },
];

interface Props {
  onStart: () => void;
  deckAvailable: boolean;
}

function CheckboxRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 border-b border-border/70 py-2.5 select-none transition-colors hover:text-primary">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

export function SettingsPanel({ onStart, deckAvailable }: Props) {
  const { tenses, verbGroups, pronouns, roundSize, updateSettings } =
    useSettingsStore();

  function toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  return (
    <div className="w-full max-w-xl space-y-8 border border-border bg-card p-6 shadow-[0_8px_18px_rgba(76,5,25,0.12)] sm:p-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Game Settings
        </h2>
        <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
          Choose the tense, verb group, and round size, then start a focused drill.
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Tenses
        </legend>
        <div className="space-y-2">
          {TENSES.map(({ key, label }) => (
            <CheckboxRow
              key={key}
              checked={tenses.includes(key)}
              label={label}
              onChange={() =>
                updateSettings({ tenses: toggleItem(tenses, key) })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Verb groups
        </legend>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {VERB_GROUPS.map(({ key, label }) => (
            <CheckboxRow
              key={key}
              checked={verbGroups.includes(key)}
              label={label}
              onChange={() =>
                updateSettings({
                  verbGroups: toggleItem(verbGroups, key) as VerbGroup[],
                })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Pronouns
        </legend>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {PRONOUNS.map((p) => (
            <CheckboxRow
              key={p}
              checked={pronouns.includes(p)}
              label={p}
              onChange={() =>
                updateSettings({ pronouns: toggleItem(pronouns, p) })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Round size
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ROUND_SIZES.map(({ value, label }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => updateSettings({ roundSize: value })}
              className={cn(
                'rounded-r-2xl rounded-l-md border px-3 py-2 text-sm font-semibold shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                roundSize === value
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-secondary text-foreground hover:bg-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {!deckAvailable && (
        <p className="border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          No cards match the current filters. Select at least one tense,
          pronoun, and verb group.
        </p>
      )}

      <button
        type="button"
        onClick={onStart}
        disabled={
          !deckAvailable ||
          tenses.length === 0 ||
          pronouns.length === 0 ||
          verbGroups.length === 0
        }
        className="w-full rounded-r-2xl rounded-l-md border border-primary bg-primary py-3 text-base font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors hover:bg-[#881337] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Start
      </button>
    </div>
  );
}
