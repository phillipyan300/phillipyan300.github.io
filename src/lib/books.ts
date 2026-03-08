/**
 * HOW TO ADD A NEW BOOK
 * ---------------------
 * 1. Save the front cover image to public/covers/<slug>.jpg
 *    - Use a high-res image (at least 400px wide)
 *    - Name it with a URL-friendly slug (lowercase, hyphens)
 *
 * 2. Pick spineColor: the dominant color from the cover image
 *    - This wraps the spine, back, and non-cover faces of the 3D book
 *    - Use a browser color picker on the cover, or eyeball it
 *
 * 3. Pick textColor: a contrasting color readable on the spine
 *    - Light spine → dark text (#1a1a1a, #333)
 *    - Dark spine → light text (#fff, #f5f5dc, #e0e0e0)
 *
 * 4. Add an entry to the BOOKS array below (order = shelf order, left to right)
 *
 * 5. Fields:
 *    - title       (required) Book title — shown on spine + detail panel
 *    - author      (required) Author name
 *    - spineColor  (required) Hex color — dominant cover color (spine + back of 3D book)
 *    - textColor   (required) Hex color — readable on spineColor
 *    - coverImage  (required) Path to cover: "/covers/<slug>.jpg"
 *    - date        (optional) Year you read it, e.g. "2025"
 *    - rating      (optional) Your rating out of 10
 *    - slug        (optional) URL-safe identifier, e.g. "three-body-problem"
 *    - pages       (optional) Real page count — controls 3D book depth (maps to 0.3–0.8)
 *    - notes       (optional) Your review/thoughts — shown in the detail panel
 *    - headbandColor (optional) Hex color for headband/tailband strips at spine top/bottom (default: #c25545)
 */
export interface Book {
  title: string;
  author: string;
  spineColor: string;
  textColor: string;
  coverImage: string;
  date?: string;
  rating?: number;
  slug?: string;
  pages?: number;
  notes?: string;
  headbandColor?: string;
}

/** Map real page count to 3D book depth (0.3 thin – 0.8 thick) */
export function bookThickness(pages?: number): number {
  if (!pages) return 0.5;
  const t = Math.max(0, Math.min(1, (pages - 100) / 700));
  return 0.3 + t * 0.5;
}

/** Map page count to CSS spine width in px (28–56) */
export function spineWidthPx(pages?: number): number {
  const thick = bookThickness(pages);
  return Math.round(28 + ((thick - 0.3) / 0.5) * 28);
}

export const BOOKS: Book[] = [
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    spineColor: "#1a1a2e",
    textColor: "#e0e0e0",
    coverImage: "/covers/sapiens.jpg",
    date: "2024",
    rating: 9,
    slug: "sapiens",
    pages: 498,
  },
  {
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    spineColor: "#f0e6d3",
    textColor: "#333",
    coverImage: "/covers/almanack-naval.jpg",
    date: "2024",
    rating: 9,
    slug: "almanack-naval",
    pages: 242,
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    spineColor: "#2c3e50",
    textColor: "#ecf0f1",
    coverImage: "/covers/meditations.jpg",
    date: "2023",
    rating: 8,
    slug: "meditations",
    pages: 256,
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    spineColor: "#0074D9",
    textColor: "#fff",
    coverImage: "/covers/zero-to-one.jpg",
    date: "2023",
    rating: 8,
    slug: "zero-to-one",
    pages: 224,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    spineColor: "#f4a261",
    textColor: "#1a1a1a",
    coverImage: "/covers/atomic-habits.jpg",
    date: "2022",
    rating: 8,
    slug: "atomic-habits",
    pages: 320,
  },
  {
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    spineColor: "#111827",
    textColor: "#facc15",
    coverImage: "/covers/three-body-problem.jpg",
    date: "2024",
    rating: 9,
    slug: "three-body-problem",
    pages: 400,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    spineColor: "#c2703e",
    textColor: "#fff8e7",
    coverImage: "/covers/dune.jpg",
    date: "2023",
    rating: 9,
    slug: "dune",
    pages: 688,
  },
];
