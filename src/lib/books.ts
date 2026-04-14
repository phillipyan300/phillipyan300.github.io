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
  // ── 2026 ──
  {
    title: "The Grid",
    author: "Gretchen Bakke",
    spineColor: "#1b3a4b",
    textColor: "#e0e0e0",
    coverImage: "/covers/the-grid.jpg",
    date: "2026",
    slug: "the-grid",
    pages: 384,
  },
  {
    title: "Energy Markets",
    author: "Vincent Kaminski",
    spineColor: "#2a2a6e",
    textColor: "#f0f0f0",
    coverImage: "/covers/energy-markets.jpg",
    date: "2026",
    slug: "energy-markets",
    pages: 592,
  },
  {
    title: "Energy Trading & Investing",
    author: "Davis W. Edwards",
    spineColor: "#1a5276",
    textColor: "#f0f0f0",
    coverImage: "/covers/energy-trading-and-investing.jpg",
    date: "2026",
    slug: "energy-trading-and-investing",
    pages: 480,
  },
  {
    title: "Energy and Civilization",
    author: "Vaclav Smil",
    spineColor: "#e85d26",
    textColor: "#fff",
    coverImage: "/covers/energy-and-civilization.jpg",
    date: "2026",
    slug: "energy-and-civilization",
    pages: 568,
  },
  {
    title: "Siddhartha",
    author: "Hermann Hesse",
    spineColor: "#c4a35a",
    textColor: "#1a1a1a",
    coverImage: "/covers/siddhartha.jpg",
    date: "2026",
    slug: "siddhartha",
    pages: 152,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    spineColor: "#1a1a2e",
    textColor: "#e0e0e0",
    coverImage: "/covers/sapiens.jpg",
    date: "2026",
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
    date: "2026",
    rating: 9,
    slug: "almanack-naval",
    pages: 242,
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    spineColor: "#0074D9",
    textColor: "#fff",
    coverImage: "/covers/zero-to-one.jpg",
    date: "2026",
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
    date: "2026",
    rating: 8,
    slug: "atomic-habits",
    pages: 320,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    spineColor: "#c2703e",
    textColor: "#fff8e7",
    coverImage: "/covers/dune.jpg",
    date: "2026",
    rating: 9,
    slug: "dune",
    pages: 688,
  },
  {
    title: "The Bhagavad Gita",
    author: "Laurie L. Patton",
    spineColor: "#d4a017",
    textColor: "#1a1a1a",
    coverImage: "/covers/bhagavad-gita.jpg",
    date: "2026",
    slug: "bhagavad-gita",
    pages: 275,
  },
  {
    title: "The Scaling Era",
    author: "Dwarkesh Patel",
    spineColor: "#1a1a2e",
    textColor: "#e8e8e8",
    coverImage: "/covers/the-scaling-era.jpg",
    date: "2026",
    slug: "the-scaling-era",
    pages: 320,
  },
  {
    title: "Plutarch's Lives",
    author: "Plutarch",
    spineColor: "#4a2c2a",
    textColor: "#f0e0c0",
    coverImage: "/covers/plutarchs-lives.jpg",
    date: "2026",
    slug: "plutarchs-lives",
    pages: 1504,
  },
  {
    title: "The Black Swan",
    author: "Nassim Nicholas Taleb",
    spineColor: "#1a1a1a",
    textColor: "#fff",
    coverImage: "/covers/black-swan.jpg",
    date: "2026",
    slug: "black-swan",
    pages: 444,
  },
  // ── 2025 ──
  {
    title: "Foundation",
    author: "Isaac Asimov",
    spineColor: "#1c1c3a",
    textColor: "#d4af37",
    coverImage: "/covers/foundation.jpg",
    date: "2025",
    slug: "foundation",
    pages: 244,
  },
  {
    title: "Foundation and Empire",
    author: "Isaac Asimov",
    spineColor: "#2b1a2e",
    textColor: "#e0c080",
    coverImage: "/covers/foundation-and-empire.jpg",
    date: "2025",
    slug: "foundation-and-empire",
    pages: 247,
  },
  {
    title: "Second Foundation",
    author: "Isaac Asimov",
    spineColor: "#0d2137",
    textColor: "#c0d8f0",
    coverImage: "/covers/second-foundation.jpg",
    date: "2025",
    slug: "second-foundation",
    pages: 256,
  },
  {
    title: "Age of Ambition",
    author: "Evan Osnos",
    spineColor: "#b22222",
    textColor: "#fff",
    coverImage: "/covers/age-of-ambition.jpg",
    date: "2025",
    slug: "age-of-ambition",
    pages: 416,
  },
  {
    title: "A History of South Africa",
    author: "Leonard Thompson",
    spineColor: "#3b5e3b",
    textColor: "#f0e8d0",
    coverImage: "/covers/history-of-south-africa.jpg",
    date: "2025",
    slug: "history-of-south-africa",
    pages: 384,
  },
  {
    title: "Going Infinite",
    author: "Michael Lewis",
    spineColor: "#0a0a23",
    textColor: "#00d4ff",
    coverImage: "/covers/going-infinite.jpg",
    date: "2025",
    slug: "going-infinite",
    pages: 288,
  },
  {
    title: "Ataturk",
    author: "Andrew Mango",
    spineColor: "#8b0000",
    textColor: "#f0e0c0",
    coverImage: "/covers/ataturk.jpg",
    date: "2025",
    slug: "ataturk",
    pages: 666,
  },
  {
    title: "A Concise History of Switzerland",
    author: "Clive H. Church",
    spineColor: "#c41e3a",
    textColor: "#fff",
    coverImage: "/covers/concise-history-of-switzerland.jpg",
    date: "2025",
    slug: "concise-history-of-switzerland",
    pages: 348,
  },
];
