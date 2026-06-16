'use client';

import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

const ACCENT_MAP: Record<string, string[]> = {
  a: ['à', 'â', 'æ'],
  c: ['ç'],
  e: ['é', 'è', 'ê', 'ë'],
  i: ['î', 'ï'],
  o: ['ô', 'œ'],
  u: ['ù', 'û', 'ü'],
  y: ['ÿ'],
};

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  /** Changes when a new card is shown — used to auto-focus. */
  cardKey: number;
  placeholder?: string;
}

export function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  cardKey,
  placeholder = 'Type your answer…',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [accentAnchor, setAccentAnchor] = useState<{
    pos: number;
    suggestions: string[];
  } | null>(null);

  // Maintain focus through prop changes (prevents mobile keyboard from closing on re-render)
  useEffect(() => {
    inputRef.current?.focus();
  });

  // Clear suggestions on new card
  useEffect(() => {
    setAccentAnchor(null);
  }, [cardKey]);

  const handleChange = (newValue: string) => {
    if (disabled) return; // Prevent input changes when disabled
    const cursorPos = inputRef.current?.selectionStart ?? newValue.length;
    if (newValue.length === value.length + 1) {
      const addedChar = newValue[cursorPos - 1]?.toLowerCase();
      const suggestions = addedChar ? ACCENT_MAP[addedChar] : undefined;
      setAccentAnchor(suggestions ? { pos: cursorPos - 1, suggestions } : null);
    } else {
      setAccentAnchor(null);
    }
    onChange(newValue);
  };

  const applyAccent = (accented: string) => {
    if (!accentAnchor) return;
    const { pos } = accentAnchor;
    const newValue = value.slice(0, pos) + accented + value.slice(pos + 1);
    onChange(newValue);
    setAccentAnchor(null);
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        input.setSelectionRange(pos + 1, pos + 1);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSubmit(value);
      return;
    }
    if (accentAnchor && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= accentAnchor.suggestions.length) {
        e.preventDefault();
        applyAccent(accentAnchor.suggestions[num - 1]);
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus
          placeholder={placeholder}
          className={cn(
            'flex-1 border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 px-4 py-3 text-lg text-rose-950 dark:text-rose-100 outline-none ring-offset-background transition-colors',
            'placeholder:text-stone-400/70 dark:placeholder:text-stone-400/70',
            'focus-visible:border-cyan-700 dark:focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-700/40 dark:focus-visible:ring-cyan-400/40',
            disabled && 'cursor-not-allowed opacity-60'
          )}
        />
        <button
          type="button"
          onClick={() => !disabled && value.trim() && onSubmit(value)}
          disabled={disabled || !value.trim()}
          className={cn(
            'rounded-r-2xl rounded-l-md border border-rose-950 dark:border-rose-200 bg-rose-950 dark:bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-50 dark:text-rose-950 shadow-panel transition-colors',
            'hover:bg-rose-900 dark:hover:bg-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          Check
        </button>
      </div>
      {accentAnchor && (
        <div
          className="flex items-center gap-1 pl-0.5"
          role="group"
          aria-label="Accented character options"
        >
          {accentAnchor.suggestions.map((char, i) => (
            <button
              key={char}
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => {
                e.preventDefault(); // keep input focused
                applyAccent(char);
              }}
              className={cn(
                'flex h-6 items-center gap-0.5 rounded-sm border border-stone-300/50 dark:border-stone-600/50 bg-stone-100/50 dark:bg-stone-700/50 px-1.5',
                'text-sm text-rose-950/70 dark:text-rose-100/70 transition-colors duration-100',
                'hover:border-stone-300/80 dark:hover:border-stone-600/80 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-rose-950 dark:hover:text-rose-100'
              )}
            >
              <span className="text-[9px] font-semibold leading-none text-stone-400/50">
                {i + 1}
              </span>
              <span className="ml-0.5">{char}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
