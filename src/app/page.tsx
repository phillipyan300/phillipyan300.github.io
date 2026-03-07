export default function Home() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start justify-center px-6 py-32">
      <h1 className="text-3xl font-semibold tracking-tight">Phillip Yan</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Columbia &apos;25 &middot; CS + Math &middot; Previously at Coinbase
        &amp; Expedition Technology
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
        Exploring energy markets.
      </p>
      <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500">
        Press{" "}
        <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 text-xs dark:border-zinc-700">
          Cmd+K
        </kbd>{" "}
        to open the terminal.
      </p>
    </div>
  );
}
