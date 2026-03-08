"use client";

import { useState } from "react";
import Bookshelf from "@/components/Bookshelf";
import BookDetail from "@/components/BookDetail";
import { BOOKS } from "@/lib/books";

export default function Reading() {
  const [selectedBook, setSelectedBook] = useState(-1);

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start px-6 py-32">
      <h1 className="text-3xl font-semibold tracking-tight">Reading</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Hover to preview, click for details
      </p>

      <div className="mt-8 w-full px-10">
        <Bookshelf books={BOOKS} onSelectBook={setSelectedBook} />
      </div>

      {selectedBook >= 0 && (
        <div className="w-full">
          <BookDetail
            book={BOOKS[selectedBook]}
            onClose={() => setSelectedBook(-1)}
          />
        </div>
      )}

      <p className="mt-16 text-xs text-zinc-400 dark:text-zinc-500">
        Interactive book component inspired by{" "}
        <a
          href="https://press.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Stripe Press
        </a>
        . Bookshelf borrowed from{" "}
        <a
          href="https://adammaj.com/reading"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Adam Majmudar
        </a>
        .
      </p>
    </div>
  );
}
