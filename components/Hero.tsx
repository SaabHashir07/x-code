import Button from "./Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
      {/* Background gradient glow — absolute position pe */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
          Build Software From{" "}
          <span className="text-accent">Idea to Deployment</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg">
          X Code turns your idea into requirements, architecture, database
          design, APIs, tasks, testing, and documentation — all in one
          AI-powered workspace.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" className="w-full sm:w-auto">
            Start Building
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            Explore Demo
          </Button>
        </div>
      </div>
    </section>
  );
}