export interface KnowledgeChunk {
  id: string;
  category: string;
  content: string;
  keywords: string[];
}

export const KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "bio",
    category: "bio",
    content:
      "Phillip Yan is a senior at Columbia University studying Computer Science and Math (GPA: 3.91, graduating 2026). He also took MAT214: Numbers, Equations and Proofs at Princeton in 2021. He's a member of CORE (Columbia's entrepreneurship club) and the Almaworks Fellowship.",
    keywords: [
      "who",
      "about",
      "bio",
      "background",
      "phillip",
      "education",
      "school",
      "college",
      "columbia",
      "princeton",
      "gpa",
      "major",
      "study",
      "yourself",
      "introduce",
    ],
  },
  {
    id: "coursework",
    category: "education",
    content:
      "Phillip's coursework includes Operating Systems (highest exam score), Data Structures and Algorithms, C Systems Programming, Intro to Databases, Advanced Algorithms, Parallel Functional Programming in Haskell, Honors Math A (Proof-based Linear Algebra), Honors Math B (Real Analysis and Differential Geometry), and Abstract Algebra.",
    keywords: [
      "courses",
      "coursework",
      "classes",
      "study",
      "haskell",
      "algorithms",
      "operating",
      "database",
      "math",
      "algebra",
      "analysis",
    ],
  },
  {
    id: "exp-0x",
    category: "experience",
    content:
      "At 0x (Sep-Dec 2025), Phillip was the first engineering intern -he created the role. He worked on DEX meta-aggregation and intents-based execution research, built and productionized exchange integrations handling 150M+ TPV across multiple venues, and researched intents-based execution architectures focusing on solver incentive design and search/auction mechanisms.",
    keywords: [
      "0x",
      "dex",
      "aggregation",
      "intents",
      "crypto",
      "exchange",
      "defi",
      "web3",
      "blockchain",
    ],
  },
  {
    id: "exp-coinbase",
    category: "experience",
    content:
      "At Coinbase (Jun-Sep 2025), Phillip was a Software Engineering Intern on the Institutional Crypto Financing team. He built automation for institutional loan products, eliminating 50+ hours/quarter of manual updates for the prime brokerage.",
    keywords: [
      "coinbase",
      "loan",
      "institutional",
      "financing",
      "crypto",
      "prime",
      "brokerage",
    ],
  },
  {
    id: "exp-scale",
    category: "experience",
    content:
      "At Scale AI (Nov-Dec 2024), Phillip was a Technical Advisor Intern for Gen AI, teaching state-of-the-art AI models how to solve complex algorithmic problems.",
    keywords: ["scale", "advisor", "teaching", "algorithmic"],
  },
  {
    id: "exp-exptech",
    category: "experience",
    content:
      "At Expedition Technology (May-Aug 2024), Phillip was an ML Engineering Intern. He designed an end-to-end PyTorch training framework for signal classification (IARPA SCISRS program), containerized with Docker and equipped with MLFlow and TensorBoard. He integrated Mamba architecture to develop a novel RF-specific hybrid architecture, achieving O(n log n) runtime vs O(n²) for traditional transformers.",
    keywords: [
      "expedition",
      "machine learning",
      "pytorch",
      "signal",
      "iarpa",
      "mamba",
      "docker",
      "classification",
    ],
  },
  {
    id: "exp-axpo",
    category: "experience",
    content:
      "At Axpo US (Mar-May 2024), Phillip built energy trading tools including automated data pipelines for time series data via Pandas and NumPy, and a bot to report and annotate JSON intraday trade changes in any portfolio.",
    keywords: [
      "axpo",
      "energy",
      "trading",
      "pipeline",
      "pandas",
      "numpy",
      "data",
    ],
  },
  {
    id: "exp-summary",
    category: "experience",
    content:
      "Phillip has interned at 0x (DEX meta-aggregation), Coinbase (institutional crypto financing), Scale AI (Gen AI advising), Expedition Technology (ML engineering for IARPA), and Axpo US (energy trading tools). His experience spans crypto/DeFi, ML/AI, and energy.",
    keywords: [
      "experience",
      "internship",
      "intern",
      "job",
      "career",
      "previously",
      "where",
      "worked",
    ],
  },
  {
    id: "proj-pax",
    category: "project",
    content:
      "Pax Automata (Feb 2026): Built the first autonomous agent playing Pax Historia, a fully AI grand strategy game. An 'AI-on-AI' system that ingests full game state via a reverse engineered API, plans from a strategic doctrine, and acts over multi-turn campaigns. Validated by beating the game without human input; launch content reached 2.2K+ views.",
    keywords: [
      "pax",
      "automata",
      "agent",
      "game",
      "strategy",
      "autonomous",
    ],
  },
  {
    id: "proj-flare",
    category: "project",
    content:
      "FlareInsure: A smart contract trading platform for rainfall insurance with a decentralized blockchain marketplace for real-world data verification. Won two prizes at ETH Oxford and secured the first dozen waitlist sign-ups within the first week.",
    keywords: [
      "flare",
      "insure",
      "insurance",
      "blockchain",
      "smart contract",
      "eth",
      "oxford",
      "hackathon",
    ],
  },
  {
    id: "proj-gitinsight",
    category: "project",
    content:
      "GitInsight: An AI onboarding tool that lets developers ask natural-language and voice questions about any public GitHub repository. Containerized with Docker, integrated repo parsing, embeddings indexing, and conversation retrieval to deliver <2s responses. (Sunset due to cost.)",
    keywords: [
      "gitinsight",
      "github",
      "onboarding",
      "repo",
      "embeddings",
      "natural language",
    ],
  },
  {
    id: "proj-mcm",
    category: "project",
    content:
      "MCM Outstanding Winner (Feb 2023): Built a spatial-temporal differential equations model simulating plant biome evolution under drought cycles. Won the MAA award and Outstanding Winner (top 6 of 10,000+ teams) at the International Mathematical Contest in Modeling.",
    keywords: [
      "mcm",
      "modeling",
      "competition",
      "award",
      "outstanding",
      "maa",
      "differential",
      "equations",
    ],
  },
  {
    id: "proj-polyhymnia",
    category: "project",
    content:
      "Polyhymnia.ai: Led a team to build a full-stack music app generating original sheet music using Markov Chains, helping early-intermediate players practice sight-reading. Uses the Needleman-Wunsch algorithm to assess student recordings.",
    keywords: ["polyhymnia", "music", "sheet", "markov", "team", "lead"],
  },
  {
    id: "proj-summary",
    category: "project",
    content:
      "Phillip's projects include Pax Automata (autonomous AI game agent), FlareInsure (blockchain rainfall insurance -won prizes at ETH Oxford), GitInsight (AI repo Q&A tool), MCM Outstanding Winner (math modeling, top 6 of 10K teams), Polyhymnia.ai (AI music generation), a Computer Vision Object Identifier (TensorFlow/VGG16), and an Income Tax Simulator.",
    keywords: [
      "projects",
      "built",
      "build",
      "portfolio",
      "made",
      "create",
      "best",
      "favorite",
      "cool",
      "impressive",
    ],
  },
  {
    id: "writing",
    category: "writing",
    content:
      "Phillip writes essays on institutions, markets, philosophy, and everyday life on Substack (phillipyan.substack.com). Essays: 'Institutions as Startups' (Dec 2025) -on Burke, revolution, and organizational architecture. 'The Hidden Architecture of On-Chain Capital' (Nov 2025) -ERC-4626 and on-chain capital markets. 'How to Make Internet Money' (Sep 2025) -designing money from first principles. 'The Philosophy Behind Gifts' (Jun 2025) -an ontological-normative theory of gifting. 'Pubs as a Third Space' (Feb 2025) -how pubs create community. 'Mispricing Experiences' (Feb 2025) -hidden costs and benefits in purchases.",
    keywords: [
      "writing",
      "essay",
      "blog",
      "article",
      "substack",
      "recommend",
      "suggest",
      "written",
    ],
  },
  {
    id: "energy-thesis",
    category: "energy",
    content:
      "Phillip's energy thesis: Energy data is fragmented and priced differently at every node because transmission constraints, weather, and demand curves interact in non-obvious ways. He wants to build the unified data and reasoning layer for the grid -a real-time LMP feed aggregated across all major ISOs, structured into a knowledge graph. The wedge is the data layer. On top: a reasoning layer where you can ask why a price spike happened. Initial customers: ML infrastructure teams optimizing compute scheduling by electricity cost, plus energy traders and grid operators.",
    keywords: [
      "energy",
      "thesis",
      "grid",
      "power",
      "lmp",
      "iso",
      "electricity",
      "working on",
      "interested",
      "passion",
      "idea",
      "startup",
    ],
  },
  {
    id: "skills",
    category: "skills",
    content:
      "Phillip's technical skills: Python, TypeScript/JavaScript, Haskell, C, Solidity. Frameworks/tools: PyTorch, Docker, React/Next.js, Pandas, NumPy, TensorFlow, MLFlow, TensorBoard. Domains: ML systems, signal processing, smart contracts, DeFi, full-stack web development, energy data.",
    keywords: [
      "skills",
      "tech",
      "stack",
      "language",
      "python",
      "typescript",
      "tools",
      "technologies",
      "know",
      "use",
    ],
  },
  {
    id: "contact",
    category: "contact",
    content:
      "Contact Phillip: Email pmy2105@columbia.edu · GitHub github.com/phillipyan300 · Twitter twitter.com/PhillipYan2 · LinkedIn linkedin.com/in/phillip-yan-swe/ · Website philyan.com",
    keywords: [
      "contact",
      "email",
      "reach",
      "connect",
      "twitter",
      "github",
      "linkedin",
      "hire",
    ],
  },
  {
    id: "values",
    category: "values",
    content:
      "Phillip's values: 'Do great work' -organized curiosity, a normative perspective, agency, appetite for risk, tolerance for being weird. 'Do not assume the status quo' -the distribution of expectations may not match actual potential realities. 'Be the bee' -consume selectively, curate intensely, produce enduring honey. 'Everything can be learned, but not everything can be taught.' 'Many things which cannot be overcome when together yield themselves up when taken little by little.'",
    keywords: [
      "values",
      "believe",
      "philosophy",
      "principles",
      "motto",
      "care",
    ],
  },
  {
    id: "site-meta",
    category: "meta",
    content:
      "This site (philyan.com) is built with Next.js, React, TypeScript, and Tailwind CSS. It features a terminal with AI-powered responses. Sections: home, projects, reading (bookshelf), writing (Substack essays), and energy thesis.",
    keywords: [
      "site",
      "website",
      "terminal",
      "how",
      "next",
      "react",
      "tailwind",
    ],
  },
];
