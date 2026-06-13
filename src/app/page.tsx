import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-4xl bg-card px-6 py-8 text-foreground shadow-[0_8px_18px_rgba(76,5,25,0.12)] sm:px-8 sm:py-10">
        <div className="border-l-4 border-primary pl-6">
          <section className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              French learning utility
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Language Tools
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Editorial-style practice tools for language learners, starting with a French verb conjugation game built for fast repetition and clean feedback.
            </p>
          </section>

          <hr className="my-6 border-0 border-t border-border" />

          <section className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-foreground">Available tools</h2>
            <div className="flex w-full flex-col gap-3">
          <Link
            href="/conjugation"
            className="flex items-center justify-between gap-4 border border-border bg-secondary px-5 py-5 transition-colors duration-150 hover:bg-muted"
          >
            <div className="text-left">
              <p className="font-semibold text-foreground">
                Verb Conjugation
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                French · Present, Imparfait, Passé composé
              </p>
            </div>
            <span className="text-2xl text-primary">🇫🇷</span>
          </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
