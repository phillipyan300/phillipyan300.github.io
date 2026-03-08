import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <div className="flex items-center gap-4">
        <Image
          src="/profile.png"
          alt="Phillip Yan"
          width={48}
          height={48}
          className="rounded-full"
        />
        <h1 className="text-3xl font-semibold tracking-tight">Phillip Yan</h1>
      </div>

      <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        Interested in all things{" "}
        <a
          href="/energy"
          className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
        >
          energy
        </a>
        .
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
        <ul className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <li>
            <a
              href="https://paulgraham.com/greatwork.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
            >
              Do great work
            </a>{" "}
            &mdash; organized curiosity, a normative perspective rather than a
            positive one, agency, appetite for risk, and tolerance for being
            weird.
          </li>
          <li>
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              Do not assume the status quo
            </span>{" "}
            &mdash; the distribution of people&apos;s expectations of the future
            may not be the distribution of the actual potential realities.
          </li>
          <li>
            <a
              href="https://history.hanover.edu/texts/bacon/novorg.html#aphorisms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
            >
              Be the bee
            </a>{" "}
            &mdash; consume selectively, curate intensely, and produce
            enduring honey.
          </li>
          <li>
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              Everything can be learned
            </span>
            , but not everything can be taught.
          </li>
          <li>
            <a
              href="https://www.gutenberg.org/files/674/674-h/674-h.htm#chap41"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
            >
              Many things which cannot be overcome when they are together yield
              themselves up when taken little by little.
            </a>
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
