"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Download,
  Layout,
  Type,
  Image as ImageIcon,
  Square,
  Columns,
  Menu,
  Sparkles,
} from "lucide-react";
import Button from "@/components/Button";

type EditorLayoutProps = {
  projectId: string;
  projectName: string;
  initialPages: any;
};

// Component library — yahan se drag karenge
const COMPONENT_LIBRARY = [
  { type: "navbar", label: "Navbar", icon: Menu },
  { type: "hero", label: "Hero", icon: Layout },
  { type: "features", label: "Features", icon: Columns },
  { type: "text", label: "Text Block", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "button", label: "Button", icon: Square },
  { type: "footer", label: "Footer", icon: Menu },
];

export default function EditorLayout({
  projectId,
  projectName,
  initialPages,
}: EditorLayoutProps) {
  const [pages, setPages] = useState(initialPages);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Abhi khali — Phase 8 mein drag-drop hoga
  const components = pages?.home?.components ?? [];

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    // Phase 8 mein actual save logic
    await new Promise((r) => setTimeout(r, 600));

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-text-primary">
              {projectName}
            </h1>
            <p className="text-xs text-text-muted">Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={saving}
            className="!px-3 !py-1.5 !text-xs"
          >
            <Save size={14} />
            {saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </Button>
          <Button
            variant="secondary"
            className="!px-3 !py-1.5 !text-xs"
            disabled
          >
            <Eye size={14} />
            Preview
          </Button>
          <Button
            variant="primary"
            className="!px-3 !py-1.5 !text-xs"
            disabled
          >
            <Download size={14} />
            Download Code
          </Button>
        </div>
      </header>

      {/* Main 3-Column Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Component Library */}
        <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-surface">
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Components
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Drag onto canvas (Phase 8)
            </p>

            <div className="mt-4 space-y-1">
              {COMPONENT_LIBRARY.map((comp) => {
                const Icon = comp.icon;
                return (
                  <div
                    key={comp.type}
                    className="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary transition-colors hover:border-accent/50 hover:bg-accent/5 cursor-grab"
                  >
                    <Icon size={16} className="text-text-muted" />
                    {comp.label}
                  </div>
                );
              })}
            </div>

            {/* AI Chat Section */}
            <div className="mt-8 rounded-lg border border-border bg-bg p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Sparkles size={14} />
                AI Assistant
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Coming in Phase 11: Type what you want, AI adds it.
              </p>
            </div>
          </div>
        </aside>

        {/* Center — Canvas */}
        <main className="flex-1 overflow-y-auto bg-bg p-6">
          <div className="mx-auto max-w-4xl">
            {/* Canvas header */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">
                Home Page — {components.length} component
                {components.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Canvas — empty state */}
            {components.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-border bg-surface/50 p-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Layout size={24} />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-text-primary">
                  Your canvas is empty
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
                  Drag components from the left sidebar onto this area to start
                  building your website.
                </p>
                <p className="mt-4 text-xs text-text-muted">
                  (Drag-drop coming in Phase 8)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {components.map((comp: any) => (
                  <div
                    key={comp.id}
                    className="rounded-lg border border-border bg-surface p-4 text-sm text-text-primary"
                  >
                    {comp.type} — (render coming in Phase 8)
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar — Properties */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-surface">
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Properties
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Select a component to edit
            </p>

            <div className="mt-6 rounded-lg border border-dashed border-border bg-bg p-6 text-center">
              <p className="text-xs text-text-muted">
                No component selected.
                <br />
                (Properties panel in Phase 10)
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}