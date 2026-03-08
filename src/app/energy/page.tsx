export default function Energy() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32">
      <h1 className="text-2xl font-semibold tracking-tight">Energy Thesis</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          Energy data is currently fragmented and priced differently at every
          node because transmission constraints, weather, and demand curves
          interact in non-obvious ways.
        </p>

        <p>
          I want to build the{" "}
          <span className="text-zinc-900 dark:text-zinc-200">
            unified data and reasoning layer for the grid
          </span>
          :
        </p>

        <ul className="list-disc space-y-3 pl-5">
          <li>
            A real-time LMP feed aggregated across all major ISOs, structured
            into a knowledge graph that captures how grid events propagate
            across nodes.
          </li>
          <li>
            The most obvious initial customers are ML infrastructure teams
            optimizing compute job scheduling by electricity cost, though
            potentially also energy traders and grid operators given how
            fragmented their current data tooling is.
          </li>
          <li>
            The wedge is the data layer &mdash; the hard part nobody has built
            cleanly. I would build the reasoning layer on top.
          </li>
        </ul>

        <p>
          Instead of just seeing a price spike, you can ask{" "}
          <span className="italic">why</span>:
        </p>

        <ul className="list-disc space-y-3 pl-5">
          <li>
            Wind farms in West Texas generating cheap power that can&apos;t
            physically reach Dallas because the transmission lines are full.
          </li>
          <li>
            Prices going negative at the source while spiking at the
            destination.
          </li>
          <li>
            Two nodes a few hundred miles apart moving in opposite directions
            in the same hour.
          </li>
        </ul>
      </div>
    </div>
  );
}
