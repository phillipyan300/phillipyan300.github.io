"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { keywordSearch } from "@/lib/terminal-ai";
import {
  loadModel,
  generate,
  isModelLoaded,
  isModelLoading,
} from "@/lib/web-llm";

// --- Welcome Box ---

function WelcomeBox() {
  return (
    <div className="mb-4" style={{ fontSize: "12px", lineHeight: "1.7" }}>
      <div className="inline-block rounded border border-[#da7756] px-3 py-1">
        <span className="text-[#da7756] font-bold">🦀 Phillip Code v1.2</span>
      </div>

      <div className="mt-4 flex gap-8 text-[#e0e0e0]">
        {/* Left column */}
        <div className="flex-shrink-0">
          <div className="font-bold text-white">Welcome back!</div>
          <pre className="mt-2">{`    ██  ██
  ██████████
  ██▓▓██▓▓██
  ██████████
    ██  ██
    ██  ██`}</pre>
          <div className="mt-2 text-[#a0a0b0]">Columbia &apos;26 · CS+Math</div>
          <div className="text-[#a0a0b0]">~/philyan.com</div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-0">
          <div className="text-[#da7756] font-bold">Tips for getting started</div>
          <div className="text-[#585868]">──────────────────────────────────────────────────</div>
          <div className="mt-1">
            Try &quot;what have you built?&quot;<br />
            or &quot;cd projects&quot;
          </div>

          <div className="mt-3 text-[#da7756] font-bold">Sections</div>
          <div>home/  reading/  writing/  projects/  energy/</div>

          <div className="mt-3 text-[#da7756] font-bold">Quick commands</div>
          <div>help · ls · whoami · dark · thesis</div>
          <div>contact · twitter · light</div>

          <div className="mt-3 text-[#da7756] font-bold">In-browser AI <span className="text-[#585868] font-normal">(experimental)</span></div>
          <div>Type <span className="text-white">&quot;ai on&quot;</span> to load a fully</div>
          <div>client-side AI model (~200 MB, no servers)</div>
        </div>
      </div>
    </div>
  );
}

// --- Command Handling ---

type OutputLine = { type: "input" | "output" | "error" | "thinking"; text: string };

const SECTIONS = ["home", "reading", "writing", "projects"] as const;

const HELP_TEXT = `Available commands:
  help              Show this help message
  ls                List site sections
  cd <section>      Navigate to a section
  cd ..             Go home
  whoami            About Phillip
  cat thesis.txt    Open energy thesis
  cat resume.txt    Open resume
  contact           Show contact info
  twitter           Open Twitter
  dark / light      Toggle dark/light mode
  clear             Clear terminal
  echo <text>       Echo text back
  ai on             Load in-browser AI (~200 MB, fully client-side)`;

const THESIS = `Energy data is fragmented and priced differently at every node because
transmission constraints, weather, and demand curves interact in non-obvious
ways. I want to build the unified data and reasoning layer for the grid:
a real-time LMP feed aggregated across all major ISOs, structured into a
knowledge graph that captures how grid events propagate across nodes.

The wedge is the data layer -- the hard part nobody has built cleanly. On top:
a reasoning layer where instead of just seeing a price spike, you can ask why.
Wind farms in West Texas generating cheap power that can't physically reach
Dallas because the transmission lines are full. Prices going negative at the
source while spiking at the destination. Two nodes a few hundred miles apart
moving in opposite directions in the same hour.

Initial customers: ML infrastructure teams optimizing compute job scheduling
by electricity cost -- though also energy traders and grid operators given how
fragmented their current data tooling is.`;

const WHOAMI =
  "Phillip Yan -- Columbia '26, Math & CS. Previously at 0x, Coinbase & Expedition Technology. Interested in all things energy.";

const CONTACT = `Email:   pmy2105@columbia.edu
GitHub:  github.com/phillipyan300
Twitter: twitter.com/PhillipYan2`;

function matchCommand(
  input: string,
  navigate: (path: string) => void
): { output: string; action?: () => void; isUnknown?: boolean } {
  const trimmed = input.trim().toLowerCase();
  const raw = input.trim();

  if (!trimmed) return { output: "" };

  // help
  if (trimmed === "help" || trimmed === "/help") {
    return { output: HELP_TEXT };
  }

  // ls
  if (trimmed === "ls") {
    return { output: "home/  reading/  writing/  projects/" };
  }

  if (trimmed.startsWith("ls ")) {
    const target = trimmed.slice(3).replace(/\/$/, "");
    if (target === "projects") {
      return {
        output: [
          "FlareInsure",
          "GitInsight",
          "MCM Outstanding Winner",
          "Biking Infrastructure Optimization",
          "Polyhymnia.ai",
          "Computer Vision Object Identifier",
          "Income Tax Simulator",
        ].join("\n"),
      };
    }
    return { output: `ls: ${target}: No such file or directory` };
  }

  // cd
  if (trimmed.startsWith("cd ")) {
    const target = trimmed.slice(3).replace(/\/$/, "");
    if (target === ".." || target === "~" || target === "home") {
      return { output: "Navigating to home...", action: () => navigate("/") };
    }
    if (SECTIONS.includes(target as (typeof SECTIONS)[number])) {
      return {
        output: `Navigating to ${target}...`,
        action: () => navigate(`/${target === "home" ? "" : target}`),
      };
    }
    return { output: `cd: ${target}: No such directory` };
  }

  // whoami
  if (trimmed === "whoami") {
    return { output: WHOAMI };
  }

  // cat thesis.txt / thesis -> navigate to /energy
  if (trimmed === "cat thesis.txt" || trimmed === "thesis") {
    return {
      output: "Navigating to energy thesis...",
      action: () => navigate("/energy"),
    };
  }

  // dark mode / light mode toggle
  if (/^(dark|light|dark mode|light mode|toggle theme)$/i.test(trimmed)) {
    const wantsDark = /^(dark|dark mode)$/i.test(trimmed);
    return {
      output: `Switching to ${wantsDark ? "dark" : "light"} mode...`,
      action: () => {
        document.documentElement.classList.toggle("dark", wantsDark);
        localStorage.setItem("theme", wantsDark ? "dark" : "light");
      },
    };
  }

  // cat resume.txt
  if (trimmed === "cat resume.txt" || trimmed === "resume") {
    return {
      output: "Opening resume...",
      action: () =>
        window.open(
          "https://drive.google.com/file/d/1oo5IAJaWdPJstCagSXC39ZUe1CSND0NB/view?usp=sharing",
          "_blank"
        ),
    };
  }

  // contact
  if (trimmed === "contact") {
    return { output: CONTACT };
  }

  // twitter
  if (trimmed === "twitter") {
    return {
      output: "Opening Twitter...",
      action: () =>
        window.open("https://twitter.com/PhillipYan2", "_blank"),
    };
  }

  // echo
  if (trimmed.startsWith("echo ")) {
    return { output: raw.slice(5) };
  }

  // clear is handled separately

  // --- Regex NLP layer ---

  // thesis / energy / what are you working on
  if (/\b(thesis|energy|grid|power|lmp|working on|exploring)\b/i.test(trimmed)) {
    return {
      output: "Navigating to energy thesis...",
      action: () => navigate("/energy"),
    };
  }

  // projects / what have you built
  if (
    /\b(projects?|built|build|portfolio|work)\b/i.test(trimmed)
  ) {
    return {
      output: "Navigating to projects...",
      action: () => navigate("/projects"),
    };
  }

  // writing
  if (/\b(writ(ing|e|es)|blog|articles?|essays?|substack)\b/i.test(trimmed)) {
    return {
      output: "Navigating to writing...",
      action: () => navigate("/writing"),
    };
  }

  // reading / books
  if (/\b(read(ing)?|books?|bookshelf|library)\b/i.test(trimmed)) {
    return {
      output: "Navigating to reading...",
      action: () => navigate("/reading"),
    };
  }

  // who / about
  if (/\b(who|about|bio|background)\b/i.test(trimmed)) {
    return { output: WHOAMI };
  }

  // contact
  if (/\b(contact|email|reach|connect)\b/i.test(trimmed)) {
    return { output: CONTACT };
  }

  // twitter / social
  if (/\b(twitter|tweet|social|x\.com)\b/i.test(trimmed)) {
    return {
      output: "Opening Twitter...",
      action: () =>
        window.open("https://twitter.com/PhillipYan2", "_blank"),
    };
  }

  // resume / cv
  if (/\b(resume|cv|curriculum)\b/i.test(trimmed)) {
    return {
      output: "Opening resume...",
      action: () =>
        window.open(
          "https://drive.google.com/file/d/1oo5IAJaWdPJstCagSXC39ZUe1CSND0NB/view?usp=sharing",
          "_blank"
        ),
    };
  }

  return {
    output: `Command not found: ${raw}. Type "help" for available commands.`,
    isUnknown: true,
  };
}

// --- Terminal Component ---

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiProgress, setAiProgress] = useState<string | null>(null);
  const [aiProgressPct, setAiProgressPct] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (minimized) {
          setMinimized(false);
          setOpen(true);
        } else {
          setOpen((prev) => !prev);
        }
      }
      if (e.key === "Escape") {
        setOpen(false);
        setMinimized(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  async function startAi() {
    if (isModelLoaded() || isModelLoading()) return;
    setAiProgress("Initializing in-browser AI...");
    setAiProgressPct(0);

    try {
      await loadModel((report) => {
        setAiProgress(report.text);
        // Extract percentage from progress text if available
        const match = report.text.match(/([\d.]+)%/);
        if (match) setAiProgressPct(parseFloat(match[1]));
      });
      setAiEnabled(true);
      setAiProgress(null);
      setLines((prev) => [
        ...prev,
        {
          type: "output",
          text: "🧠 In-browser AI loaded. Fully client-side, no servers. This is experimental and may give rough answers. Ask me anything about Phillip!",
        },
      ]);
    } catch (err) {
      setAiProgress(null);
      const msg =
        err instanceof Error && err.message.includes("WebGPU")
          ? "Your browser doesn't support WebGPU. Try Chrome 113+ or Edge 113+."
          : "Failed to load the AI model. Your device may not support it.";
      setLines((prev) => [...prev, { type: "error", text: msg }]);
    }
  }

  async function handleSubmit(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const value = input.trim();
    if (!value) return;

    if (value.toLowerCase() === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    // Handle "ai on" command
    if (/^(ai\s*on|enable\s*ai|load\s*ai|start\s*ai)$/i.test(value)) {
      setLines((prev) => [
        ...prev,
        { type: "input", text: value },
      ]);
      setInput("");
      startAi();
      return;
    }

    // Tier 1: Pattern matching
    const result = matchCommand(value, navigate);

    if (!result.isUnknown) {
      const newLines: OutputLine[] = [{ type: "input", text: value }];
      if (result.output) {
        newLines.push({ type: "output", text: result.output });
      }
      setLines((prev) => [...prev, ...newLines]);
      setInput("");
      if (result.action) {
        setOpen(false);
        setMinimized(true);
        setTimeout(result.action, 350);
      }
      return;
    }

    // Tier 2: Keyword matching against knowledge base
    const match = keywordSearch(value);
    if (match) {
      setLines((prev) => [
        ...prev,
        { type: "input", text: value },
        { type: "output", text: match.chunk.content },
      ]);
      setInput("");
      return;
    }

    // Tier 3: In-browser LLM
    if (!aiEnabled) {
      setLines((prev) => [
        ...prev,
        { type: "input", text: value },
        {
          type: "output",
          text: 'I can answer basic questions, but for deeper conversation type "ai on" to load an in-browser AI model (~200 MB, fully client-side, no servers). Note: this is experimental and runs a small model locally in your browser.',
        },
      ]);
      setInput("");
      return;
    }

    setLines((prev) => [
      ...prev,
      { type: "input", text: value },
      { type: "thinking", text: "thinking..." },
    ]);
    setInput("");

    try {
      const response = await generate(value);
      setLines((prev) => {
        const updated = prev.slice(0, -1);
        updated.push({ type: "output", text: response });
        return updated;
      });
    } catch {
      setLines((prev) => {
        const updated = prev.slice(0, -1);
        updated.push({
          type: "error",
          text: "AI inference failed. Try a simpler question or type 'help'.",
        });
        return updated;
      });
    }
  }

  return (
    <>
      {/* Minimized bar */}
      {minimized && !open && (
        <button
          onClick={() => {
            setMinimized(false);
            setOpen(true);
          }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-4xl w-[90vw] items-center justify-between rounded-t-lg bg-[#1e1e2e] px-5 py-2.5 shadow-lg transition-all hover:py-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#da7756]">phillip &gt;_</span>
            <span className="text-xs text-[#585868]">terminal paused</span>
          </div>
          <span className="text-xs text-[#585868]">
            <kbd className="rounded border border-[#585868] px-1.5 py-0.5 text-[10px]">⌘K</kbd> to reopen
          </span>
        </button>
      )}

      {/* Floating trigger button */}
      {!minimized && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900"
          aria-label="Open terminal"
        >
          <span className="text-lg font-bold">&gt;_</span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Terminal drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-w-4xl w-[90vw] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "60vh" }}
      >
        <div className="flex h-full flex-col rounded-t-xl border border-b-0 border-[#da7756] bg-[#1e1e2e] shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-[#585868] px-4 py-2">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-[#a0a0b0]">phillip@philyan.com</span>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-[#585868] hover:text-[#a0a0b0]"
            >
              ESC
            </button>
          </div>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Welcome box */}
            <WelcomeBox />

            {/* Output history */}
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line.type === "input" ? (
                  <span>
                    <span className="text-[#da7756]">phillip</span>
                    <span className="text-[#a0a0b0]"> &gt; </span>
                    <span className="text-white">{line.text}</span>
                  </span>
                ) : line.type === "thinking" ? (
                  <span className="text-[#da7756] animate-pulse">{line.text}</span>
                ) : line.type === "error" ? (
                  <span className="text-[#ff6b6b]">{line.text}</span>
                ) : (
                  <span className="text-[#e0e0e0]">{line.text}</span>
                )}
              </div>
            ))}

            {/* AI loading progress bar */}
            {aiProgress && (
              <div className="mb-2">
                <div className="text-xs text-[#da7756]">{aiProgress}</div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#2a2a3e]">
                  <div
                    className="h-full rounded-full bg-[#da7756] transition-all duration-300"
                    style={{ width: `${aiProgressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Input line */}
            <div className="flex items-center">
              <span className="text-[#da7756]">phillip</span>
              <span className="text-[#a0a0b0]"> &gt; </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSubmit}
                className="flex-1 border-none bg-transparent text-white outline-none caret-white"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
