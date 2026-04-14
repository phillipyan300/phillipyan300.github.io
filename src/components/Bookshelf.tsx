"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Book } from "@/lib/books";
import { spineWidthPx } from "@/lib/books";

const COVER_W = 168;
const BOOK_H = 220;
const GAP = 12;

interface BookshelfProps {
  books: Book[];
  onSelectBook?: (index: number) => void;
}

export default function Bookshelf({ books, onSelectBook }: BookshelfProps) {
  const [bookIndex, setBookIndex] = useState(-1);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchDevice = useRef(false);
  const lastTappedIndex = useRef(-1);

  const [scroll, setScroll] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const spineWidths = useMemo(
    () => books.map((b) => spineWidthPx(b.pages)),
    [books]
  );

  const avgSpineW = useMemo(
    () => spineWidths.reduce((a, b) => a + b, 0) / (spineWidths.length || 1),
    [spineWidths]
  );

  const booksInView = useMemo(
    () => Math.floor(viewportWidth / (avgSpineW + GAP)) || 1,
    [viewportWidth, avgSpineW]
  );

  const maxScroll = useMemo(() => {
    const totalWidth =
      spineWidths.reduce((sum, w) => sum + w + GAP, 0) +
      (bookIndex > -1 ? COVER_W : 0);
    return Math.max(0, totalWidth - viewportWidth);
  }, [spineWidths, bookIndex, viewportWidth]);

  const clamp = useCallback(
    (v: number) => Math.max(0, Math.min(maxScroll, v)),
    [maxScroll]
  );

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

  useEffect(() => {
    setScroll((s) => clamp(s));
  }, [maxScroll, clamp]);

  useEffect(() => {
    if (bookIndex >= 0) {
      // Sum widths up to the selected book
      let target = 0;
      for (let i = 0; i < bookIndex; i++) {
        target += spineWidths[i] + GAP;
      }
      // Center it roughly
      target -= ((booksInView - 4.5) / 2) * (avgSpineW + GAP);
      setScroll(clamp(target));
    }
  }, [bookIndex, booksInView, clamp, spineWidths, avgSpineW]);

  // Detect touch device
  useEffect(() => {
    const onTouch = () => {
      isTouchDevice.current = true;
    };
    window.addEventListener("touchstart", onTouch, { once: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  const handleMouseEnter = (index: number) => {
    if (isTouchDevice.current) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setBookIndex(index);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setBookIndex(-1);
    }, 150);
  };

  const handleClick = (index: number) => {
    if (isTouchDevice.current) {
      // First tap = preview, second tap = detail
      if (lastTappedIndex.current === index) {
        onSelectBook?.(index);
        lastTappedIndex.current = -1;
      } else {
        setBookIndex(index);
        lastTappedIndex.current = index;
      }
    } else {
      onSelectBook?.(index);
    }
  };

  // Scroll arrows
  const scrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScroll = useCallback(
    (dir: number) => {
      setIsScrolling(true);
      scrollInterval.current = setInterval(() => {
        setScroll((s) => clamp(s + dir * 3));
      }, 10);
    },
    [clamp]
  );

  const stopScroll = useCallback(() => {
    setIsScrolling(false);
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  }, []);

  useEffect(() => stopScroll, [stopScroll]);

  return (
    <div className="relative">
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

      <div className="absolute -left-9 top-0 h-full z-10" style={{ opacity: scroll > 0 ? 1 : 0, pointerEvents: scroll > 0 ? "auto" : "none" }}>
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

      <div
        ref={viewportRef}
        className="flex items-center gap-3 overflow-hidden"
      >
        {books.map((book, index) => {
          const isOpen = bookIndex === index;
          const sw = spineWidths[index];
          const transition = isScrolling
            ? "transform 100ms linear"
            : "all 500ms ease";

          return (
            <button
              key={book.title}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
              className="flex flex-row items-center justify-start flex-shrink-0 outline-none cursor-pointer"
              style={{
                transform: `translateX(-${scroll}px)`,
                width: isOpen ? sw + COVER_W : sw,
                perspective: 1000,
                gap: 0,
                transition,
                willChange: "auto",
              }}
            >
              {/* Spine */}
              <div
                className="flex items-start justify-center flex-shrink-0"
                style={{
                  width: sw,
                  height: BOOK_H,
                  backgroundColor: book.spineColor,
                  color: book.textColor,
                  transformOrigin: "right",
                  transform: `rotateY(${isOpen ? "-60deg" : "0deg"})`,
                  transformStyle: "preserve-3d",
                  transition: "all 500ms ease",
                  willChange: "auto",
                }}
              >
                <span
                  className="pointer-events-none fixed top-0 left-0 z-50"
                  style={{
                    height: BOOK_H,
                    width: sw,
                    opacity: 0.15,
                    filter: "url(#paper)",
                  }}
                />
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

              {/* Cover */}
              <div
                className="relative flex-shrink-0 overflow-hidden"
                style={{
                  height: BOOK_H,
                  transformOrigin: "left",
                  transform: `rotateY(${isOpen ? "30deg" : "88.8deg"})`,
                  transformStyle: "preserve-3d",
                  transition: "all 500ms ease",
                  willChange: "auto",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 z-50"
                  style={{
                    opacity: 0.15,
                    filter: "url(#paper)",
                  }}
                />
                <span
                  className="pointer-events-none absolute inset-0 z-50"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0) 2px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 6px, transparent 7px, transparent 9px, rgba(255,255,255,0.25) 9px, transparent 12px)",
                  }}
                />
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{
                    height: BOOK_H,
                    width: "auto",
                    display: "block",
                    transition: "all 500ms ease",
                    willChange: "auto",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute -right-9 top-0 h-full z-10" style={{ opacity: scroll < maxScroll ? 1 : 0, pointerEvents: scroll < maxScroll ? "auto" : "none" }}>
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
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
