import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-4xl bg-stone-50 dark:bg-stone-800 px-6 py-8 text-rose-950 dark:text-rose-100 shadow-panel sm:px-8 sm:py-10">
        <div className="border-l-4 border-rose-950 dark:border-rose-200 pl-6">
          <section className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              French learning utility
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-rose-950 dark:text-rose-100">
              Language Tools
            </h1>
            <p className="max-w-xl text-base leading-7 text-stone-400">
              Editorial-style practice tools for language learners, starting with a French verb conjugation game built for fast repetition and clean feedback.
            </p>
          </section>

          <hr className="my-6 border-0 border-t border-stone-300 dark:border-stone-600" />

          <section className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-rose-950 dark:text-rose-100">Available tools</h2>
            <div className="flex w-full flex-col gap-3">
              <Link
                href="/conjugation"
                className="flex items-center justify-between gap-4 border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 px-5 py-5 transition-colors duration-150 hover:bg-stone-100 dark:hover:bg-stone-700"
              >
                <div className="text-left">
                  <p className="font-semibold text-rose-950 dark:text-rose-100">
                    Verb Conjugation
                  </p>
                  <p className="text-sm leading-6 text-stone-400">
                    French · Présent · Imparfait · Passé composé · Futur · Conditionnel
                  </p>
                </div>
                <span className="text-2xl text-rose-950 dark:text-rose-200">FR</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
