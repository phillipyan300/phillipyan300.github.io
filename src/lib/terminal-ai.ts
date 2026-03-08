import { KNOWLEDGE, type KnowledgeChunk } from "./knowledge";

// ── Tier 2: Keyword matching ──────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "because", "but", "and", "or", "if", "while", "that", "this",
  "what", "which", "i", "me", "my", "we", "you", "your", "he", "him",
  "she", "her", "it", "they", "them", "his", "its", "our", "their",
  "am", "tell", "about", "know", "get", "make", "like", "please",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export function keywordSearch(
  query: string
): { chunk: KnowledgeChunk; score: number } | null {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return null;

  // Also check for multi-word keyword matches in the raw query
  const queryLower = query.toLowerCase();

  let bestMatch: KnowledgeChunk | null = null;
  let bestScore = 0;

  for (const chunk of KNOWLEDGE) {
    let score = 0;

    // Check each query token against chunk keywords
    for (const token of queryTokens) {
      for (const keyword of chunk.keywords) {
        if (keyword === token) {
          score += 2; // exact match
        } else if (keyword.includes(token) || token.includes(keyword)) {
          score += 1; // partial match
        }
      }
      // Check against content
      if (chunk.content.toLowerCase().includes(token)) {
        score += 0.5;
      }
    }

    // Check multi-word keywords against raw query
    for (const keyword of chunk.keywords) {
      if (keyword.includes(" ") && queryLower.includes(keyword)) {
        score += 3;
      }
    }

    // Normalize by query length
    const normalizedScore = score / queryTokens.length;

    if (normalizedScore > bestScore) {
      bestScore = normalizedScore;
      bestMatch = chunk;
    }
  }

  // Threshold: need a decent match confidence
  if (bestMatch && bestScore >= 1.5) {
    return { chunk: bestMatch, score: bestScore };
  }
  return null;
}

// ── Tier 3: LLM API call ─────────────────────────────────────────────────

export async function generateResponse(query: string): Promise<string> {
  try {
    const response = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      if (data?.fallback) return data.fallback;
      throw new Error("API error");
    }

    const data = await response.json();
    return data.response;
  } catch {
    return "Couldn't reach the AI backend. Try a specific command like 'help', 'whoami', or 'cd projects'.";
  }
}
