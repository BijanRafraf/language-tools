'use client';

import { useSettingsStore, RoundSize } from '@/store/settingsStore';
import { VerbGroup } from '@/data/types';
import { cn } from '@/lib/utils';

const TENSES = [
  { key: 'present', label: 'Présent' },
  { key: 'imparfait', label: 'Imparfait' },
  { key: 'passe-compose', label: 'Passé composé' },
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
    <label className="flex cursor-pointer items-center gap-2.5 select-none">
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
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Game Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          French verb conjugation
        </p>
      </div>

      {/* Tenses */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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

      {/* Verb groups */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Verb groups
        </legend>
        <div className="grid grid-cols-2 gap-2">
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

      {/* Pronouns */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pronouns
        </legend>
        <div className="grid grid-cols-2 gap-2">
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

      {/* Round size */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Round size
        </legend>
        <div className="flex gap-2">
          {ROUND_SIZES.map(({ value, label }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => updateSettings({ roundSize: value })}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                roundSize === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:bg-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {!deckAvailable && (
        <p className="text-sm text-destructive">
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
        className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Start
      </button>
    </div>
  );
}
