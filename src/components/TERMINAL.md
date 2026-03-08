# Terminal — Architecture & How It Works

The terminal (`src/components/Terminal.tsx`) is an interactive CLI-style interface on philyan.com. It uses a **three-tier system** to handle user queries, from instant pattern matching to an in-browser AI model.

## Three-Tier Query System

When a user types something and hits Enter:

```
User input
  │
  ▼
┌─────────────────────────────┐
│ Tier 1: Pattern Matching    │  Instant, client-side
│ Regex + exact commands      │  No download, no network
│ (help, cd, ls, whoami, etc) │
└──────────┬──────────────────┘
           │ No match ("command not found")
           ▼
┌─────────────────────────────┐
│ Tier 2: Knowledge Search    │  Instant, client-side
│ Keyword scoring against 20  │  No download, no network
│ pre-written content chunks  │
└──────────┬──────────────────┘
           │ No confident match (score < 1.5)
           ▼
┌─────────────────────────────┐
│ Tier 3: In-Browser LLM      │  Requires opt-in ("ai on")
│ SmolLM2-360M via WebLLM     │  ~200 MB one-time download
│ Runs fully in browser (GPU) │  Cached after first load
└─────────────────────────────┘
```

### Tier 1 — Pattern Matching (`Terminal.tsx: matchCommand`)

Handles exact commands and regex-based navigation. Zero latency.

- **Exact commands**: `help`, `ls`, `clear`, `whoami`, `contact`, `twitter`, `echo`, `dark`/`light`, `cat resume.txt`, `cat thesis.txt`
- **Navigation regex**: Matches keywords like "projects", "writing", "books", "energy", "thesis" and navigates via `router.push()`
- **NLP regex layer**: Broader patterns like "what have you built?" → projects, "who are you?" → bio

If the command is recognized, it executes immediately. If not, it returns `isUnknown: true` and falls through to Tier 2.

### Tier 2 — Knowledge Search (`src/lib/terminal-ai.ts` + `src/lib/knowledge.ts`)

20 content chunks covering bio, education, each work experience, each project, writing, energy thesis, skills, contact, values, and site meta. Each chunk has:
- `content`: The actual text to display
- `keywords`: Terms that should match this chunk
- `category`: For grouping (bio, experience, project, writing, etc.)

**Scoring algorithm:**
1. Tokenize query, remove stop words
2. For each chunk, score keyword matches (exact = 2, partial = 1, content mention = 0.5, multi-word keyword = 3)
3. Normalize by query length
4. Return best match if score >= 1.5

Example: "what did phillip do at coinbase?" → tokens: ["phillip", "coinbase"] → matches `exp-coinbase` chunk with high confidence → displays the Coinbase content instantly.

The knowledge chunks are derived from the resume (`PhillipYan2026SpringResume.pdf`) and site pages but are written as natural-language summaries — the raw resume is never exposed.

### Tier 3 — In-Browser LLM (`src/lib/web-llm.ts`)

Uses [WebLLM](https://github.com/mlc-ai/web-llm) to run **SmolLM2-360M-Instruct** (quantized to 4-bit) entirely in the browser via WebGPU. No server, no API key.

**Opt-in flow:**
1. User types `"ai on"` (or `"enable ai"`, `"load ai"`, `"start ai"`)
2. Progress bar appears showing model download (~200 MB first time, cached after)
3. Once loaded, a confirmation message appears
4. All subsequent Tier 3 queries use the local model

**How generation works:**
- All 20 knowledge chunks are included in the system prompt (total ~2000 tokens)
- The model receives the system prompt + user query and generates a response
- Max 200 tokens, temperature 0.7

**Fallback:** If the user hasn't loaded the AI, Tier 3 queries show a message prompting them to type `"ai on"` with the pitch about it being fully client-side.

## Server-Side API Route (Optional)

`src/app/api/terminal/route.ts` is an optional server-side fallback using any OpenAI-compatible LLM API. Not currently active — requires setting env vars:

```
LLM_API_KEY=your_api_key
LLM_API_URL=https://api.groq.com/openai/v1/chat/completions  (default)
LLM_MODEL=llama-3.1-8b-instant  (default)
```

This was the original Tier 3 before the in-browser model was added. It's still wired up in `terminal-ai.ts` (`generateResponse`) but not called by the current Terminal component.

## File Map

```
src/
├── components/
│   ├── Terminal.tsx          # Main terminal UI + Tier 1 pattern matching
│   └── TERMINAL.md           # This file
├── lib/
│   ├── knowledge.ts          # 20 content chunks (bio, experience, projects, etc.)
│   ├── terminal-ai.ts        # Tier 2 keyword search + server-side API helper
│   └── web-llm.ts            # Tier 3 WebLLM wrapper (lazy model loading + generation)
└── app/
    └── api/
        └── terminal/
            └── route.ts      # Optional server-side LLM endpoint
```

## Key Design Decisions

- **No raw resume exposure**: Knowledge chunks are natural-language summaries, not copy-pasted resume text.
- **Opt-in AI download**: The ~200 MB model only downloads when the user explicitly types `"ai on"`. It never loads automatically.
- **Progressive enhancement**: The terminal works fully without AI (Tiers 1+2 cover ~80-90% of queries). AI is a bonus.
- **WebGPU requirement**: The in-browser model needs WebGPU (Chrome 113+, Edge 113+, Firefox 141+, Safari on macOS Tahoe 26). Falls back to an error message on unsupported browsers.
- **Cached model**: After first download, WebLLM caches the model in the browser's Cache API. Subsequent visits load from cache (~5s).
