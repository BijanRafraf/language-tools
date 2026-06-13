'use client';

import { useEffect, useRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

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

  // Auto-focus whenever a new card appears
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [cardKey, disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  );
}
