export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <h1 className="text-3xl font-semibold tracking-tight">Phillip Yan</h1>

      <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        Studying computer science and math at Columbia University.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Previously
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <li>
            First engineering intern at{" "}
            <span className="text-zinc-900 dark:text-zinc-200">0x</span> &mdash;
            DEX meta-aggregation and intents-based execution research
          </li>
          <li>
            Software engineering intern at{" "}
            <span className="text-zinc-900 dark:text-zinc-200">Coinbase</span>{" "}
            &mdash; institutional crypto financing
          </li>
          <li>
            ML engineering intern at{" "}
            <span className="text-zinc-900 dark:text-zinc-200">
              Expedition Technology
            </span>{" "}
            &mdash; signal classification for IARPA
          </li>
          <li>
            Software engineering intern at{" "}
            <span className="text-zinc-900 dark:text-zinc-200">Axpo US</span>{" "}
            &mdash; energy trading tools
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Values
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <li>
            Build things that work. Ship fast, learn faster.
          </li>
          <li>
            Go deep &mdash; the best ideas come from understanding first
            principles.
          </li>
          <li>
            Seek hard problems at the intersection of math and engineering.
          </li>
        </ul>
      </section>

      <div className="mt-10 flex items-center gap-4">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Press{" "}
          <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 text-xs dark:border-zinc-700">
            Cmd+K
          </kbd>{" "}
          to open the terminal.
        </p>
        <span className="text-xs text-zinc-400 dark:text-zinc-600">
          &middot; site under construction
        </span>
      </div>
    </div>
  );
}
