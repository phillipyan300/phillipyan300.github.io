"use client";

import dynamic from "next/dynamic";
import type { Book } from "@/lib/books";

const BookCanvas = dynamic(() => import("./BookCanvas"), { ssr: false });

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export default function BookDetail({ book, onClose }: BookDetailProps) {
  return (
    <div
      className="mt-10"
      style={{
        animation: "fadeSlideIn 500ms ease both",
      }}
    >
      <div className="flex flex-col lg:flex-row gap-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-lg">
        {/* 3D Book */}
        <div className="w-full lg:w-1/2 h-80 lg:h-96 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800">
          <BookCanvas book={book} />
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {book.title}
          </h2>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {book.author}
            {book.date && <span> &middot; {book.date}</span>}
          </p>
          {book.rating !== undefined && (
            <p className="mt-3 text-lg font-medium">
              {book.rating}/10
            </p>
          )}
          {book.notes && (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {book.notes}
            </p>
          )}
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
            Drag to rotate the book
          </p>
          <button
            onClick={onClose}
            className="mt-6 self-start px-4 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
