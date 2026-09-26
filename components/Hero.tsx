"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
      {/* Gradient glow */}
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
          {/* Start Building — smart routing */}
          <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">
              {isLoggedIn ? "Go to Dashboard" : "Start Building"}
            </Button>
          </Link>

          {/* Explore Demo — scroll to services */}
          <a href="#services" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Explore Demo
            </Button>
          </a>
        </div>

        {/* Small helper text */}
        <p className="mt-6 text-xs text-text-muted">
          No credit card required • Free to start
        </p>
      </div>
    </section>
  );
}