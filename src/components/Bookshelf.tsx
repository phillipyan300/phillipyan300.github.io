"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── Book data ───────────────────────────────────────────────────────────────
// Each book needs a spine color, text color, and cover image.
// For now these are placeholders — swap coverImage for real URLs later.

export interface Book {
  title: string;
  author: string;
  spineColor: string;
  textColor: string;
  coverImage: string;
  date?: string;
  rating?: number;
}

export const BOOKS: Book[] = [
  {
    title: "The Master and Margarita",
    author: "Mikhail Bulgakov",
    spineColor: "#8B0000",
    textColor: "#f5f5dc",
    coverImage: "https://covers.openlibrary.org/b/id/8234171-L.jpg",
    date: "2025",
    rating: 10,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    spineColor: "#1a1a2e",
    textColor: "#e0e0e0",
    coverImage: "https://covers.openlibrary.org/b/id/8309786-L.jpg",
    date: "2024",
    rating: 9,
  },
  {
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    spineColor: "#f0e6d3",
    textColor: "#333",
    coverImage: "https://covers.openlibrary.org/b/id/10389354-L.jpg",
    date: "2024",
    rating: 9,
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    spineColor: "#2c3e50",
    textColor: "#ecf0f1",
    coverImage: "https://covers.openlibrary.org/b/id/12818414-L.jpg",
    date: "2023",
    rating: 8,
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    spineColor: "#0074D9",
    textColor: "#fff",
    coverImage: "https://covers.openlibrary.org/b/id/7895055-L.jpg",
    date: "2023",
    rating: 8,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    spineColor: "#f4a261",
    textColor: "#1a1a1a",
    coverImage: "https://covers.openlibrary.org/b/id/12842973-L.jpg",
    date: "2022",
    rating: 8,
  },
  {
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    spineColor: "#111827",
    textColor: "#facc15",
    coverImage: "https://covers.openlibrary.org/b/id/8594063-L.jpg",
    date: "2024",
    rating: 9,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    spineColor: "#c2703e",
    textColor: "#fff8e7",
    coverImage: "https://covers.openlibrary.org/b/id/13208700-L.jpg",
    date: "2023",
    rating: 9,
  },
];

// ─── Dimensions (px) ─────────────────────────────────────────────────────────
// These match Adam's proportions: spine is narrow, cover is 4x the spine width.

const SPINE_W = 42;
const COVER_W = SPINE_W * 4; // 168
const BOOK_W = SPINE_W + COVER_W; // 210 (total when open)
const BOOK_H = 220;
const GAP = 12; // horizontal gap between spines

// ─── Component ───────────────────────────────────────────────────────────────

interface BookshelfProps {
  books: Book[];
  onSelectBook?: (index: number) => void;
  selectedIndex?: number;
}

export default function Bookshelf({
  books,
  onSelectBook,
  selectedIndex: controlledIndex,
}: BookshelfProps) {
  // Which book is "open" (-1 = none)
  const [internalIndex, setInternalIndex] = useState(-1);
  const bookIndex = controlledIndex ?? internalIndex;
  const setBookIndex = (i: number) => {
    setInternalIndex(i);
    onSelectBook?.(i);
  };

  // Horizontal scroll state (px offset)
  const [scroll, setScroll] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  // How many spines fit in the viewport
  const booksInView = useMemo(
    () => Math.floor(viewportWidth / (SPINE_W + GAP)) || 1,
    [viewportWidth]
  );

  // Max scroll so we don't scroll past the last book
  const maxScroll = useMemo(() => {
    const totalWidth =
      (SPINE_W + GAP) * books.length +
      (bookIndex > -1 ? COVER_W : 0);
    return Math.max(0, totalWidth - viewportWidth);
  }, [books.length, bookIndex, viewportWidth]);

  const clamp = (v: number) => Math.max(0, Math.min(maxScroll, v));

  // Measure viewport on mount + resize
  useEffect(() => {
    const measure = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Re-clamp scroll when maxScroll changes
  useEffect(() => {
    setScroll((s) => clamp(s));
  }, [maxScroll]);

  // Center the opened book in view
  useEffect(() => {
    if (bookIndex >= 0) {
      const target = (bookIndex - (booksInView - 4.5) / 2) * (SPINE_W + GAP);
      setScroll(clamp(target));
    }
  }, [bookIndex]);

  // Scroll arrows — continuous scroll on hover/touch
  const scrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScroll = useCallback(
    (dir: number) => {
      setIsScrolling(true);
      scrollInterval.current = setInterval(() => {
        setScroll((s) => clamp(s + dir * 3));
      }, 10);
    },
    [maxScroll]
  );

  const stopScroll = useCallback(() => {
    setIsScrolling(false);
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  }, []);

  // Clean up interval on unmount
  useEffect(() => stopScroll, [stopScroll]);

  return (
    <div className="relative">
      {/* ── SVG paper-texture filter (invisible, referenced by books) ── */}
      <svg className="absolute inset-0 invisible" aria-hidden>
        <defs>
          <filter id="paper" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={8}
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="white"
              surfaceScale={1}
              result="diffLight"
            >
              <feDistantLight azimuth={45} elevation={35} />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      {/* ── Left scroll arrow ── */}
      {scroll > 0 && (
        <div className="absolute -left-9 top-0 h-full z-10">
          <button
            className="flex items-center justify-center h-full w-7 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500"
            onMouseEnter={() => startScroll(-1)}
            onMouseLeave={stopScroll}
            onTouchStart={() => startScroll(-1)}
            onTouchEnd={stopScroll}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
        </div>
      )}

      {/* ── Book row ── */}
      <div
        ref={viewportRef}
        className="flex items-center gap-3 overflow-hidden"
      >
        {books.map((book, index) => {
          const isOpen = bookIndex === index;
          const transition = isScrolling
            ? "transform 100ms linear"
            : "all 500ms ease";

          return (
            <button
              key={book.title}
              onClick={() => setBookIndex(isOpen ? -1 : index)}
              className="flex flex-row items-center justify-start flex-shrink-0 outline-none"
              style={{
                transform: `translateX(-${scroll}px)`,
                width: isOpen ? BOOK_W : SPINE_W,
                perspective: 1000,
                gap: 0,
                transition,
                willChange: "auto",
              }}
            >
              {/* ── Spine ── */}
              <div
                className="flex items-start justify-center flex-shrink-0"
                style={{
                  width: SPINE_W,
                  height: BOOK_H,
                  backgroundColor: book.spineColor,
                  color: book.textColor,
                  transformOrigin: "right",
                  transform: `rotateY(${isOpen ? "-60deg" : "0deg"})`,
                  transformStyle: "preserve-3d",
                  filter: "brightness(0.8) contrast(2)",
                  transition: "all 500ms ease",
                  willChange: "auto",
                }}
              >
                {/* Paper texture overlay */}
                <span
                  className="pointer-events-none fixed top-0 left-0 z-50"
                  style={{
                    height: BOOK_H,
                    width: SPINE_W,
                    opacity: 0.4,
                    filter: "url(#paper)",
                  }}
                />
                {/* Title text (vertical) */}
                <span
                  className="mt-3 text-xs font-sans select-none overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{
                    writingMode: "vertical-rl",
                    maxHeight: BOOK_H - 24,
                  }}
                >
                  {book.title}
                </span>
              </div>

              {/* ── Cover ── */}
              <div
                className="relative flex-shrink-0 overflow-hidden"
                style={{
                  transformOrigin: "left",
                  transform: `rotateY(${isOpen ? "30deg" : "88.8deg"})`,
                  transformStyle: "preserve-3d",
                  filter: "brightness(0.8) contrast(2)",
                  transition: "all 500ms ease",
                  willChange: "auto",
                }}
              >
                {/* Paper texture overlay */}
                <span
                  className="pointer-events-none fixed top-0 right-0 z-50"
                  style={{
                    height: BOOK_H,
                    width: COVER_W,
                    opacity: 0.4,
                    filter: "url(#paper)",
                  }}
                />
                {/* Spine-edge lighting (thin gradient on left edge of cover) */}
                <span
                  className="pointer-events-none absolute top-0 left-0 z-50"
                  style={{
                    height: BOOK_H,
                    width: COVER_W,
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0) 2px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 6px, transparent 7px, transparent 9px, rgba(255,255,255,0.25) 9px, transparent 12px)",
                  }}
                />
                {/* Cover image */}
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{
                    width: COVER_W,
                    height: BOOK_H,
                    objectFit: "cover",
                    transition: "all 500ms ease",
                    willChange: "auto",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Right scroll arrow ── */}
      {scroll < maxScroll && (
        <div className="absolute -right-9 top-0 h-full z-10">
          <button
            className="flex items-center justify-center h-full w-7 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500"
            onMouseEnter={() => startScroll(1)}
            onMouseLeave={stopScroll}
            onTouchStart={() => startScroll(1)}
            onTouchEnd={stopScroll}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Tiny chevron icons (avoid adding react-icons dependency) ────────────────

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
