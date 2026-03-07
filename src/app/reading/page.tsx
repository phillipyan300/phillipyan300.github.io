"use client";

import { useState } from "react";
import Bookshelf, { BOOKS } from "@/components/Bookshelf";

export default function Reading() {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectedBook = selectedIndex >= 0 ? BOOKS[selectedIndex] : null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Reading</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Click a spine to peek at the cover. Click again to close.
      </p>

      {/* ── Bookshelf ── */}
      <div className="mt-8 w-full">
        <Bookshelf
          books={BOOKS}
          selectedIndex={selectedIndex}
          onSelectBook={setSelectedIndex}
        />
      </div>

      {/* ── Book detail (shown when a book is selected) ── */}
      {selectedBook && (
        <div className="mt-10 w-full border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-xl font-semibold">{selectedBook.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {selectedBook.author}
            {selectedBook.date && ` · Read ${selectedBook.date}`}
            {selectedBook.rating && ` · ${selectedBook.rating}/10`}
          </p>
        </div>
      )}

      {/* ── Full book list (sorted by rating) ── */}
      <div className="mt-12 w-full">
        <h2 className="text-lg font-semibold tracking-tight">All books</h2>
        <div className="mt-4 flex flex-col gap-6">
          {BOOKS.slice()
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .map((book, i) => (
              <div
                key={book.title}
                className="flex flex-row items-start gap-4"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-28 w-auto rounded border border-zinc-200 object-cover dark:border-zinc-700"
                />
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-zinc-500">{book.author}</p>
                  {book.date && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Read {book.date}
                      {book.rating && ` · ${book.rating}/10`}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
