"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  GripVertical,
  Plus,
  X,
  FileText,
  Check,
} from "lucide-react";
import Button from "@/components/Button";

type ComponentType =
  | "navbar"
  | "hero"
  | "features"
  | "text"
  | "image"
  | "button"
  | "footer";

type Component = {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
};

type Page = {
  name: string;
  path: string;
  components: Component[];
};

type PagesData = Record<string, Page>;

const DEFAULT_PROPS: Record<ComponentType, Record<string, any>> = {
  navbar: {
    logo: "My Site",
    links: [
      { label: "Home", pageKey: "home" },
      { label: "About", pageKey: "about" },
    ],
  },
  hero: {
    heading: "Welcome to My Site",
    subheading: "A brief tagline goes here",
    buttonText: "Get Started",
  },
  features: {
    heading: "Features",
    items: [
      { title: "Fast", description: "Lightning quick performance" },
      { title: "Reliable", description: "Built to last" },
      { title: "Simple", description: "Easy to use" },
    ],
  },
  text: { content: "Add your text content here." },
  image: { src: "", alt: "Image" },
  button: { text: "Click Me", pageKey: "" },
  footer: { text: "© 2025 My Site. All rights reserved." },
};

const COMPONENT_LIBRARY = [
  { type: "navbar" as const, label: "Navbar", icon: Menu },
  { type: "hero" as const, label: "Hero", icon: Layout },
  { type: "features" as const, label: "Features", icon: Columns },
  { type: "text" as const, label: "Text Block", icon: Type },
  { type: "image" as const, label: "Image", icon: ImageIcon },
  { type: "button" as const, label: "Button", icon: Square },
  { type: "footer" as const, label: "Footer", icon: Menu },
];

type EditorLayoutProps = {
  projectId: string;
  projectName: string;
  initialPages: any;
};

// Purane data ko naye format mein convert karo
function normalizePages(initial: any): PagesData {
  if (!initial) {
    return {
      home: { name: "Home", path: "/", components: [] },
    };
  }
  // Agar purana format hai { home: { components: [...] } } (bina name/path)
  const normalized: PagesData = {};
  for (const key in initial) {
    const p = initial[key];
    normalized[key] = {
      name: p.name || key.charAt(0).toUpperCase() + key.slice(1),
      path: p.path || (key === "home" ? "/" : `/${key}`),
      components: p.components || [],
    };
  }
  if (!normalized.home) {
    normalized.home = { name: "Home", path: "/", components: [] };
  }
  return normalized;
}

export default function EditorLayout({
  projectId,
  projectName,
  initialPages,
}: EditorLayoutProps) {
  const [pages, setPages] = useState<PagesData>(() =>
    normalizePages(initialPages)
  );
  const [currentPageKey, setCurrentPageKey] = useState<string>("home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedType, setDraggedType] = useState<ComponentType | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  const currentPage = pages[currentPageKey];
  const components = currentPage?.components ?? [];

  function addComponent(type: ComponentType) {
    const newComponent: Component = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      props: JSON.parse(JSON.stringify(DEFAULT_PROPS[type])),
    };
    setPages({
      ...pages,
      [currentPageKey]: {
        ...currentPage,
        components: [...components, newComponent],
      },
    });
    setSelectedId(newComponent.id);
  }

  function deleteComponent(id: string) {
    setPages({
      ...pages,
      [currentPageKey]: {
        ...currentPage,
        components: components.filter((c) => c.id !== id),
      },
    });
    if (selectedId === id) setSelectedId(null);
  }

  function handleDragStart(type: ComponentType) {
    setDraggedType(type);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (draggedType) {
      addComponent(draggedType);
      setDraggedType(null);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!isDraggingOver) setIsDraggingOver(true);
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  function addPage() {
    const trimmed = newPageName.trim();
    if (!trimmed) return;

    const key = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (pages[key]) {
      alert("A page with similar name already exists.");
      return;
    }

    const newPages: PagesData = {
      ...pages,
      [key]: {
        name: trimmed,
        path: `/${key}`,
        components: [],
      },
    };
    setPages(newPages);
    setCurrentPageKey(key);
    setNewPageName("");
    setShowNewPageModal(false);
  }

  function deletePage(key: string) {
    if (key === "home") {
      alert("Home page cannot be deleted.");
      return;
    }
    if (!confirm(`Delete "${pages[key].name}" page?`)) return;

    const newPages = { ...pages };
    delete newPages[key];
    setPages(newPages);
    if (currentPageKey === key) setCurrentPageKey("home");
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/projects/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, pages }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
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
            <p className="text-xs text-text-muted">
              {Object.keys(pages).length} page
              {Object.keys(pages).length !== 1 ? "s" : ""}
            </p>
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

      {/* Page Tabs */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-4 py-2 overflow-x-auto">
        {Object.entries(pages).map(([key, page]) => (
          <div
            key={key}
            className={`group flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              currentPageKey === key
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:bg-bg hover:text-text-primary"
            }`}
          >
            <button
              onClick={() => setCurrentPageKey(key)}
              className="flex items-center gap-1.5"
            >
              <FileText size={12} />
              {page.name}
            </button>
            {key !== "home" && currentPageKey === key && (
              <button
                onClick={() => deletePage(key)}
                className="rounded p-0.5 hover:bg-critical/10 hover:text-critical"
                aria-label="Delete page"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowNewPageModal(true)}
          className="ml-2 flex shrink-0 items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Plus size={12} />
          Add Page
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Component Library */}
        <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-surface">
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Components
            </h2>
            <p className="mt-1 text-xs text-text-muted">Drag onto canvas →</p>
            <div className="mt-4 space-y-1">
              {COMPONENT_LIBRARY.map((comp) => {
                const Icon = comp.icon;
                return (
                  <div
                    key={comp.type}
                    draggable
                    onDragStart={() => handleDragStart(comp.type)}
                    onDragEnd={() => setDraggedType(null)}
                    className="flex cursor-grab items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary transition-colors hover:border-accent/50 hover:bg-accent/5 active:cursor-grabbing"
                  >
                    <Icon size={16} className="text-text-muted" />
                    {comp.label}
                  </div>
                );
              })}
            </div>

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

        {/* Center: Canvas */}
        <main className="flex-1 overflow-y-auto bg-bg p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">
                {currentPage?.name} — {components.length} component
                {components.length !== 1 ? "s" : ""}
              </span>
              <span className="font-mono text-xs text-text-muted">
                {currentPage?.path}
              </span>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`min-h-[500px] rounded-xl border-2 border-dashed p-4 transition-colors ${
                isDraggingOver
                  ? "border-accent bg-accent/5"
                  : "border-border bg-surface/50"
              }`}
            >
              {components.length === 0 ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Layout size={24} />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-text-primary">
                    {currentPage?.name} is empty
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
                    Drag components from the left sidebar onto this area.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {components.map((comp) => (
                    <ComponentRenderer
                      key={comp.id}
                      component={comp}
                      isSelected={selectedId === comp.id}
                      onSelect={() => setSelectedId(comp.id)}
                      onDelete={() => deleteComponent(comp.id)}
                      allPages={pages}
                      onNavigatePage={setCurrentPageKey}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right: Properties */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-surface">
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Properties
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Select a component to edit
            </p>
            {selectedId ? (
              <div className="mt-6 rounded-lg border border-border bg-bg p-4">
                <p className="text-xs text-text-muted">
                  Editing:{" "}
                  <span className="font-medium text-text-primary">
                    {components.find((c) => c.id === selectedId)?.type}
                  </span>
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Detailed editing coming in Phase 10.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-border bg-bg p-6 text-center">
                <p className="text-xs text-text-muted">
                  No component selected.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* New Page Modal */}
      {showNewPageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setShowNewPageModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-text-primary">
              New Page
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Give your new page a name.
            </p>
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPage()}
              placeholder="e.g. About, Services, Contact"
              autoFocus
              className="mt-4 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowNewPageModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={addPage}>
                <Check size={14} />
                Add Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentRenderer({
  component,
  isSelected,
  onSelect,
  onDelete,
  allPages,
  onNavigatePage,
}: {
  component: Component;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  allPages: PagesData;
  onNavigatePage: (key: string) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? "border-accent bg-accent/5"
          : "border-transparent hover:border-border"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 top-2 z-10 rounded-md bg-critical/10 p-1.5 text-critical opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Delete component"
      >
        <Trash2 size={14} />
      </button>
      <div className="absolute left-2 top-2 z-10 cursor-move text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical size={14} />
      </div>
      <ComponentPreview
        component={component}
        allPages={allPages}
        onNavigatePage={onNavigatePage}
      />
    </div>
  );
}

function ComponentPreview({
  component,
  allPages,
  onNavigatePage,
}: {
  component: Component;
  allPages: PagesData;
  onNavigatePage: (key: string) => void;
}) {
  const { type, props } = component;

  if (type === "navbar") {
    return (
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="font-bold text-text-primary">{props.logo}</span>
        <div className="flex gap-4 text-sm text-text-muted">
          {props.links?.map((link: any, i: number) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (link.pageKey && allPages[link.pageKey]) {
                  onNavigatePage(link.pageKey);
                }
              }}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          {props.heading}
        </h1>
        <p className="mt-2 text-sm text-text-muted">{props.subheading}</p>
        <button className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm text-accent-fg">
          {props.buttonText}
        </button>
      </div>
    );
  }

  if (type === "features") {
    return (
      <div className="py-4">
        <h2 className="text-center text-lg font-semibold text-text-primary">
          {props.heading}
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {props.items?.map((item: any, i: number) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-bg p-3 text-center"
            >
              <p className="text-sm font-semibold text-text-primary">
                {item.title || item}
              </p>
              {item.description && (
                <p className="mt-1 text-xs text-text-muted">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "text") {
    return <p className="py-2 text-sm text-text-muted">{props.content}</p>;
  }

  if (type === "image") {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-bg text-xs text-text-muted">
        Image Placeholder
      </div>
    );
  }

  if (type === "button") {
    return (
      <div className="flex justify-center py-2">
        <button className="rounded-lg bg-accent px-5 py-2 text-sm text-accent-fg">
          {props.text}
        </button>
      </div>
    );
  }

  if (type === "footer") {
    return (
      <div className="border-t border-border pt-3 text-center text-xs text-text-muted">
        {props.text}
      </div>
    );
  }

  return <div className="text-sm text-text-muted">{type} component</div>;
}