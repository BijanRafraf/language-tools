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

  // Auto-focus whenever a new card appears
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [cardKey, disabled]);

  // Clear suggestions on new card
  useEffect(() => {
    setAccentAnchor(null);
  }, [cardKey]);

  const handleChange = (newValue: string) => {
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
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={placeholder}
          className={cn(
            'flex-1 border border-border bg-input px-4 py-3 text-lg text-foreground outline-none ring-offset-background transition-colors',
            'placeholder:text-muted-foreground/70',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40',
            'disabled:cursor-not-allowed disabled:opacity-60'
          )}
        />
        <button
          type="button"
          onClick={() => !disabled && value.trim() && onSubmit(value)}
          disabled={disabled || !value.trim()}
          className={cn(
            'rounded-r-2xl rounded-l-md border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] transition-colors',
            'hover:bg-[#881337] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
                'flex h-6 items-center gap-0.5 rounded border border-border/50 bg-muted/50 px-1.5',
                'text-sm text-foreground/70 transition-colors duration-100',
                'hover:border-border/80 hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="text-[9px] font-semibold leading-none text-muted-foreground/50">
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
