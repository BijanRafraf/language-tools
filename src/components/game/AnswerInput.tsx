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
    <div className="flex w-full gap-2">
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
          'flex-1 rounded-lg border border-border bg-background px-4 py-3 text-lg text-foreground outline-none ring-offset-background transition-colors',
          'placeholder:text-muted-foreground/50',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
      />
      <button
        type="button"
        onClick={() => !disabled && value.trim() && onSubmit(value)}
        disabled={disabled || !value.trim()}
        className={cn(
          'rounded-lg border border-transparent bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors',
          'hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50'
        )}
      >
        Check
      </button>
    </div>
  );
}
