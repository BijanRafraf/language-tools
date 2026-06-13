'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  streak: number;
  progressLabel: string;
  isIndefinite: boolean;
}

export function ScoreBar({ streak, progressLabel, isIndefinite }: Props) {
  return (
    <div className="flex w-full items-center justify-between border-b border-border pb-3">
      <div className="flex items-center gap-1.5 text-sm">
        <Flame
          className={cn(
            'size-4',
            streak > 0
              ? 'text-accent-foreground'
              : 'text-muted-foreground/40'
          )}
        />
        <span
          className={cn(
            'tabular-nums text-sm font-semibold',
            streak > 0
              ? 'text-accent-foreground'
              : 'text-muted-foreground/40'
          )}
        >
          {streak}
        </span>
        {streak > 0 && (
          <span className="text-xs text-muted-foreground">streak</span>
        )}
      </div>
      <span className="text-sm text-muted-foreground">
        {isIndefinite ? 'Active loop ' : ''}
        <span className="font-medium text-foreground">{progressLabel}</span>
      </span>
    </div>
  );
}
