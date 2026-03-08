import Image from "next/image";

const articles = [
  {
    title: "Institutions as Startups",
    subtitle:
      "On Burke, Revolution, and the Architecture of Change Through the Lens of the French Army and Navy",
    date: "Dec 2025",
    href: "https://phillipyan.substack.com/p/institutions-as-startups",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/053cd302-1378-447d-8e99-9f1c58fde04e_2816x1536.png",
  },
  {
    title: "The Hidden Architecture of On-Chain Capital",
    subtitle:
      "The ERC-4626 techne enabling asynchronous and permissionless on-chain capital markets",
    date: "Nov 2025",
    href: "https://phillipyan.substack.com/p/the-hidden-architecture-of-on-chain",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/d5a4e441-01dc-44db-bb23-0cc51909c837_1536x1024.png",
  },
  {
    title: "How to Make Internet Money",
    subtitle:
      "How would you design 'money' from first principles, fit for the internet age?",
    date: "Sep 2025",
    href: "https://phillipyan.substack.com/p/how-to-make-internet-money",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/b6a8b4ee-0824-4045-856b-7d21c6ce6436_1920x1080.webp",
  },
  {
    title: "The Philosophy Behind Gifts",
    subtitle: "An ontological-normative theory of gifting",
    date: "Jun 2025",
    href: "https://phillipyan.substack.com/p/the-philosophy-behind-gifts",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/0e0d6a0d-4ab6-43b5-8f1a-857cfccf1d82_501x282.jpeg",
  },
  {
    title: "Pubs as a Third Space",
    subtitle: "Brewed Bonds: How Pubs Create Community and Casual Connection",
    date: "Feb 2025",
    href: "https://phillipyan.substack.com/p/pubs-as-a-third-space",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/68689d41-c602-4e7c-a688-2afabccbcedf_275x183.jpeg",
  },
  {
    title: "Mispricing Experiences",
    subtitle:
      "Beyond the Price Tag: Hidden Costs and Benefits in Everyday Purchases",
    date: "Feb 2025",
    href: "https://phillipyan.substack.com/p/mispricing-experiences",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/a1175a68-c3c8-438f-9f03-620993ea2417_612x530.jpeg",
  },
];

export default function Writing() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        Essays on institutions, markets, philosophy, and everyday life.{" "}
        <a
          href="https://phillipyan.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          Subscribe on Substack
        </a>
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <a
            key={article.title}
            href={article.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-lg border border-zinc-200 transition-all duration-300 hover:border-zinc-300 hover:scale-[1.03] hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {article.date}
              </p>
              <h2 className="mt-1 text-sm font-semibold leading-snug group-hover:underline">
                {article.title}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {article.subtitle}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
