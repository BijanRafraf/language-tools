import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-6">
      <main className="flex max-w-md flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Language Tools
          </h1>
          <p className="text-muted-foreground">
            Interactive games for language learners
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Link
            href="/conjugation"
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-5 shadow-sm transition-colors hover:bg-muted"
          >
            <div className="text-left">
              <p className="font-semibold text-foreground">
                Verb Conjugation
              </p>
              <p className="text-sm text-muted-foreground">
                French · Present, Imparfait, Passé composé
              </p>
            </div>
            <span className="text-2xl">🇫🇷</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
