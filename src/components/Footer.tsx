export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-10 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Phillip Yan</p>
        <div className="flex items-center gap-6">
          <a
            href="https://twitter.com/PhillipYan2"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Twitter
          </a>
          <a
            href="https://github.com/phillipyan300"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          <a
            href="mailto:pmy2105@columbia.edu"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
