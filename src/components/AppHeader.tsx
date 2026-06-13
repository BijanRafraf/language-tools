'use client';

import Link from 'next/link';
import { InstallOfflineButton } from '@/components/InstallOfflineButton';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/86 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary/80"
        >
          Language Tools
        </Link>
        <div className="flex items-center gap-2">
          <InstallOfflineButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}