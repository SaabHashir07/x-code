import { Lightbulb, Sparkles, Code2, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Lightbulb,
      title: "Share Your Idea",
      description:
        "Describe what you want to build in plain language. No formal spec needed — just your vision.",
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description:
        "X Code turns your idea into structured requirements, architecture, database design, and API contracts.",
    },
    {
      icon: Code2,
      title: "Build",
      description:
        "Follow the generated roadmap, track tasks, and connect every feature back to the original requirements.",
    },
    {
      icon: CheckCircle2,
      title: "Detect & Fix",
      description:
        "Project Detective flags inconsistencies, missing pieces, and design drift before they become bugs.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-t border-border px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-base text-text-muted sm:text-lg">
            From a raw idea to a shipped product — in four steps.
          </p>
        </div>

        {/* Steps grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const number = String(i + 1).padStart(2, "0");
            return (
              <div key={step.title} className="relative">
                {/* Number + Icon row */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-accent">
                    {number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon size={20} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}