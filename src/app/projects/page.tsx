const projects = [
  {
    title: "Pax Automata",
    description:
      "Built the first autonomous agent playing Pax Historia, a fully AI grand strategy game, creating an \"AI-on-AI\" system that ingests full game state via a reverse engineered API, plans from a strategic doctrine, and acts over multi-turn campaigns. Validated by beating the game without human input; launch content reached 2.2K+ views.",
    link: "https://x.com/PhillipYan2/status/2020912702273749050?s=20",
  },
  {
    title: "FlareInsure",
    description:
      "Built a smart contract trading platform for rainfall insurance with a decentralized, blockchain marketplace for real-world data verification. Won two prizes at ETH Oxford and secured the first dozen waitlist sign-ups within the first week.",
    link: "https://flareinsure.vercel.app/",
  },
  {
    title: "GitInsight",
    description:
      "Built an AI onboarding tool that lets developers ask natural-language and voice questions about any public GitHub repository. Containerized with Docker and integrated repo parsing, embeddings indexing, and convo retrieval to deliver <2s responses.",
    link: "https://try-git-insight.vercel.app/",
  },
  {
    title: "MCM Outstanding Winner",
    description:
      "Built a spatial-temporal differential equations model to simulate plant biome evolution under drought cycles. Our paper won the MAA award and was named Outstanding Winner (top 6 of 10,000+ teams) at the International MCM.",
    link: "https://drive.google.com/file/d/1B2eYv8jxBGYKL5cUFl9GD3dLy-G5aGV3/view?usp=sharing",
  },
  {
    title: "Biking Infrastructure Optimization",
    description:
      "Built an optimization model to identify NYC zip codes which would benefit the most from bike lane investment based on maximal usage and community benefits.",
    link: "https://drive.google.com/file/d/1NLBmwft5aDhxOOv4CBji00agzcbe7QM7/view?usp=sharing",
  },
  {
    title: "Polyhymnia.ai",
    description:
      "Built the backend of Polyhymnia to generate unlimited original sheet music using AI and Markov Chains, helping early-intermediate players practice sight-reading. Uses the Needleman-Wunsch algorithm to assess student recordings and adapt future exercises.",
    link: "https://github.com/phillipyan300/Polyhymnia.ai",
  },
  {
    title: "Computer Vision Object Identifier",
    description:
      "Compared traditional neural network architecture with CNNs and implemented transfer learning using VGG16, developing an image recognition algorithm using TensorFlow to identify cars and people in video from car windshields.",
  },
  {
    title: "Income Tax Simulator",
    description:
      "An educational simulation on income taxes allowing users to compare tax policies across countries, estimate income taxes given a salary, and explore tax policy formation through situational studies.",
  },
];

export default function Projects() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <div className="mt-10 grid gap-8">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-lg border border-zinc-200 p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
          >
            <h2 className="text-lg font-semibold">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
