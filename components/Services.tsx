import { Brain, Network, ShieldCheck, FileText } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Brain,
      title: "AI Project Architect",
      description:
        "Turn a raw idea into structured requirements, system architecture, database schemas, and API contracts — all in minutes.",
    },
    {
      icon: Network,
      title: "Project Brain",
      description:
        "A visual map of your entire project. See how every requirement connects to features, APIs, database tables, and tasks.",
    },
    {
      icon: ShieldCheck,
      title: "Project Detective",
      description:
        "Automatically detects inconsistencies across your project — missing requirements, broken references, and design drift.",
    },
    {
      icon: FileText,
      title: "Documentation Generator",
      description:
        "Keep your docs in sync with your code. Generate READMEs, API references, and user guides from your project source.",
    },
  ];

  return (
    <section id="services" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What X Code Does
          </h2>
          <p className="mt-4 text-base text-text-muted sm:text-lg">
            Four core tools that carry your project from idea to deployment.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:bg-accent/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-accent-fg">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}