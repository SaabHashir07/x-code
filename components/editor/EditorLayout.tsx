"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Download,
  Layout,
  Type,
  Image as ImageIcon,
  Square,
  Columns,
  Menu,
  Trash2,
  GripVertical,
  Plus,
  X,
  FileText,
  Check,
  Settings2,
  Settings,
  Sparkles,
  Layers,
  DollarSign,
  Quote,
  BarChart3,
  Grid3x3,
  Megaphone,
  Mail,
  HelpCircle,
  Users,
  Building2,
  Video,
  Minus,
  Undo2,
  Redo2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import Button from "@/components/Button";
import Toast from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ThemePanel from "./ThemePanel";
import PropertiesPanel from "./PropertiesPanel";
import SiteSettingsModal from "./SiteSettingsModal";
import AIChat from "./AIChat";
import { Theme, DEFAULT_THEME, radiusPx, shadowCss } from "./theme";

type ComponentType =
  | "navbar" | "hero" | "features" | "text" | "image" | "button" | "footer"
  | "pricing" | "testimonial" | "cta" | "stats" | "gallery"
  | "contact" | "faq" | "team" | "logos" | "video" | "divider";

type Component = {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  style?: Record<string, any>;
};

type Page = { name: string; path: string; components: Component[] };
type PagesData = Record<string, Page>;
type SiteSettings = { siteName: string; tagline: string; favicon: string };

type EditorData = {
  version: 3;
  theme: Theme;
  pages: PagesData;
  settings: SiteSettings;
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "My Website",
  tagline: "Built with X Code",
  favicon: "🚀",
};

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
  pricing: {
    heading: "Simple, transparent pricing",
    subheading: "Choose the plan that fits your needs",
    plans: [
      { name: "Starter", price: "$9", period: "/month", features: ["1 project", "Basic support", "1GB storage"], buttonText: "Get Started", highlighted: false },
      { name: "Pro", price: "$29", period: "/month", features: ["10 projects", "Priority support", "50GB storage", "Custom domain"], buttonText: "Get Started", highlighted: true },
      { name: "Business", price: "$99", period: "/month", features: ["Unlimited", "24/7 support", "500GB", "API access"], buttonText: "Contact Sales", highlighted: false },
    ],
  },
  testimonial: {
    heading: "Loved by thousands",
    items: [
      { quote: "This completely changed how we build products.", author: "Sarah Chen", role: "CEO at Acme" },
      { quote: "Best tool I've used in years.", author: "Marcus Rivera", role: "Founder at StartupX" },
      { quote: "Saved us weeks of work.", author: "Priya Sharma", role: "CTO at TechFlow" },
    ],
  },
  cta: {
    heading: "Ready to get started?",
    subheading: "Join thousands of happy customers building with us.",
    buttonText: "Start Free Trial",
  },
  stats: {
    items: [
      { value: "10K+", label: "Active Users" },
      { value: "500+", label: "Projects Built" },
      { value: "99.9%", label: "Uptime" },
      { value: "24/7", label: "Support" },
    ],
  },
  gallery: {
    heading: "Gallery",
    images: [
      { src: "", alt: "Image 1" },
      { src: "", alt: "Image 2" },
      { src: "", alt: "Image 3" },
      { src: "", alt: "Image 4" },
      { src: "", alt: "Image 5" },
      { src: "", alt: "Image 6" },
    ],
  },
  contact: {
    heading: "Get in touch",
    subheading: "We'd love to hear from you.",
    email: "hello@example.com",
    buttonText: "Send Message",
    fields: ["Name", "Email", "Message"],
  },
  faq: {
    heading: "Frequently Asked Questions",
    items: [
      { question: "How does it work?", answer: "Simple - just drag and drop." },
      { question: "Is there a free plan?", answer: "Yes, we offer a generous free tier." },
      { question: "Can I cancel anytime?", answer: "Absolutely, no questions asked." },
    ],
  },
  team: {
    heading: "Meet the Team",
    items: [
      { name: "Alex Johnson", role: "CEO", avatar: "" },
      { name: "Sam Lee", role: "CTO", avatar: "" },
      { name: "Riley Kim", role: "Design Lead", avatar: "" },
      { name: "Jordan Park", role: "Engineer", avatar: "" },
    ],
  },
  logos: {
    heading: "Trusted by leading teams",
    items: ["Acme", "TechFlow", "StartupX", "CloudBase", "DataSync"],
  },
  video: {
    heading: "Watch how it works",
    url: "",
  },
  divider: { style: "line" },
  text: { content: "Add your text content here." },
  image: { src: "", alt: "Image" },
  button: { text: "Click Me", pageKey: "" },
  footer: { text: "© 2025 My Site. All rights reserved." },
};

const LIBRARY: { type: ComponentType; label: string; icon: any; group: string }[] = [
  { type: "navbar", label: "Navbar", icon: Menu, group: "Layout" },
  { type: "hero", label: "Hero", icon: Layout, group: "Layout" },
  { type: "footer", label: "Footer", icon: Menu, group: "Layout" },
  { type: "divider", label: "Divider", icon: Minus, group: "Layout" },
  { type: "features", label: "Features", icon: Columns, group: "Content" },
  { type: "pricing", label: "Pricing", icon: DollarSign, group: "Content" },
  { type: "testimonial", label: "Testimonials", icon: Quote, group: "Content" },
  { type: "stats", label: "Stats", icon: BarChart3, group: "Content" },
  { type: "cta", label: "CTA", icon: Megaphone, group: "Content" },
  { type: "faq", label: "FAQ", icon: HelpCircle, group: "Content" },
  { type: "team", label: "Team", icon: Users, group: "Content" },
  { type: "logos", label: "Logo Cloud", icon: Building2, group: "Content" },
  { type: "contact", label: "Contact Form", icon: Mail, group: "Forms" },
  { type: "gallery", label: "Gallery", icon: Grid3x3, group: "Media" },
  { type: "video", label: "Video", icon: Video, group: "Media" },
  { type: "image", label: "Image", icon: ImageIcon, group: "Media" },
  { type: "text", label: "Text", icon: Type, group: "Basic" },
  { type: "button", label: "Button", icon: Square, group: "Basic" },
];

const GROUPS = ["Layout", "Content", "Forms", "Media", "Basic"];

type Props = { projectId: string; projectName: string; initialPages: any };

type ToastState = { message: string; type: "success" | "error" | "info" };

type ConfirmState = {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
};

function normalizeData(initial: any): EditorData {
  if (!initial) {
    return {
      version: 3,
      theme: { ...DEFAULT_THEME },
      pages: { home: { name: "Home", path: "/", components: [] } },
      settings: { ...DEFAULT_SETTINGS },
    };
  }
  if (initial.version === 3 && initial.pages) {
    return {
      version: 3,
      theme: { ...DEFAULT_THEME, ...(initial.theme || {}) },
      pages: initial.pages,
      settings: { ...DEFAULT_SETTINGS, ...(initial.settings || {}) },
    };
  }
  if (initial.version === 2 && initial.pages) {
    return {
      version: 3,
      theme: { ...DEFAULT_THEME, ...(initial.theme || {}) },
      pages: initial.pages,
      settings: { ...DEFAULT_SETTINGS },
    };
  }
  const pages: PagesData = {};
  for (const key in initial) {
    const p = initial[key];
    pages[key] = {
      name: p.name || key.charAt(0).toUpperCase() + key.slice(1),
      path: p.path || (key === "home" ? "/" : `/${key}`),
      components: p.components || [],
    };
  }
  if (!pages.home) pages.home = { name: "Home", path: "/", components: [] };
  return {
    version: 3,
    theme: { ...DEFAULT_THEME },
    pages,
    settings: { ...DEFAULT_SETTINGS },
  };
}

const MAX_HISTORY = 50;

export default function EditorLayout({ projectId, initialPages }: Props) {
  const [data, setData] = useState<EditorData>(() => normalizeData(initialPages));
  const [currentPageKey, setCurrentPageKey] = useState("home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<ComponentType | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<number | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [rightTab, setRightTab] = useState<"properties" | "theme" | "ai">("properties");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const [history, setHistory] = useState<EditorData[]>([normalizeData(initialPages)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushHistory = useCallback(
    (newData: EditorData) => {
      setHistory((h) => {
        const trimmed = h.slice(0, historyIndex + 1);
        trimmed.push(newData);
        if (trimmed.length > MAX_HISTORY) {
          trimmed.shift();
          return trimmed;
        }
        return trimmed;
      });
      setHistoryIndex((i) => {
        const next = i + 1;
        return next >= MAX_HISTORY ? MAX_HISTORY - 1 : next;
      });
    },
    [historyIndex]
  );

  function undo() {
    if (!canUndo) return;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    setData(history[newIdx]);
    setHasUnsavedChanges(true);
    showToast("Undo", "info");
  }

  function redo() {
    if (!canRedo) return;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    setData(history[newIdx]);
    setHasUnsavedChanges(true);
    showToast("Redo", "info");
  }

  const { pages, theme, settings } = data;
  const currentPage = pages[currentPageKey];
  const components = currentPage?.components ?? [];
  const selectedComponent = components.find((c) => c.id === selectedId);

  function showToast(message: string, type: ToastState["type"] = "info") {
    setToast({ message, type });
  }

  function showConfirm(
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = "Delete"
  ) {
    setConfirmDialog({ title, message, confirmText, onConfirm });
  }

  function applyData(newData: EditorData) {
    setData(newData);
    setHasUnsavedChanges(true);
    pushHistory(newData);
  }

  function updatePages(newPages: PagesData) {
    applyData({ ...data, pages: newPages });
  }

  function addComponent(type: ComponentType) {
    const newComponent: Component = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      props: JSON.parse(JSON.stringify(DEFAULT_PROPS[type])),
      style: {},
    };
    updatePages({
      ...pages,
      [currentPageKey]: { ...currentPage, components: [...components, newComponent] },
    });
    setSelectedId(newComponent.id);
    setRightTab("properties");
  }

  function duplicateComponent(id: string) {
    const idx = components.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const original = components[idx];
    const copy: Component = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: original.type,
      props: JSON.parse(JSON.stringify(original.props)),
      style: JSON.parse(JSON.stringify(original.style || {})),
    };
    const newComps = [...components];
    newComps.splice(idx + 1, 0, copy);
    updatePages({
      ...pages,
      [currentPageKey]: { ...currentPage, components: newComps },
    });
    setSelectedId(copy.id);
    showToast("Component duplicated", "success");
  }

  function moveComponent(from: number, to: number) {
    if (to < 0 || to >= components.length) return;
    const newComps = [...components];
    const [moved] = newComps.splice(from, 1);
    newComps.splice(to, 0, moved);
    updatePages({
      ...pages,
      [currentPageKey]: { ...currentPage, components: newComps },
    });
  }

  function handleReorderDrop(index: number) {
    if (draggedId) {
      const fromIdx = components.findIndex((c) => c.id === draggedId);
      if (fromIdx >= 0 && fromIdx !== index) {
        const newComps = [...components];
        const [moved] = newComps.splice(fromIdx, 1);
        const target = index > fromIdx ? index - 1 : index;
        newComps.splice(target, 0, moved);
        updatePages({
          ...pages,
          [currentPageKey]: { ...currentPage, components: newComps },
        });
      }
      setDraggedId(null);
      setDropIndicator(null);
    } else if (draggedType) {
      const newComponent: Component = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: draggedType,
        props: JSON.parse(JSON.stringify(DEFAULT_PROPS[draggedType])),
        style: {},
      };
      const newComps = [...components];
      newComps.splice(index, 0, newComponent);
      updatePages({
        ...pages,
        [currentPageKey]: { ...currentPage, components: newComps },
      });
      setSelectedId(newComponent.id);
      setRightTab("properties");
      setDraggedType(null);
      setDropIndicator(null);
    }
  }

  function updateComponentProps(id: string, newProps: Record<string, any>) {
    updatePages({
      ...pages,
      [currentPageKey]: {
        ...currentPage,
        components: components.map((c) => (c.id === id ? { ...c, props: newProps } : c)),
      },
    });
  }

  function updateComponentStyle(id: string, newStyle: Record<string, any>) {
    updatePages({
      ...pages,
      [currentPageKey]: {
        ...currentPage,
        components: components.map((c) => (c.id === id ? { ...c, style: newStyle } : c)),
      },
    });
  }

  function deleteComponent(id: string) {
    updatePages({
      ...pages,
      [currentPageKey]: {
        ...currentPage,
        components: components.filter((c) => c.id !== id),
      },
    });
    if (selectedId === id) setSelectedId(null);
  }

  async function handleAIEdit(
    instruction: string
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch("/api/ai/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction, data }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          ok: false,
          error: json.error || "AI failed. Please try again.",
        };
      }

      if (json.data) {
        applyData(json.data);
        return { ok: true };
      }

      return { ok: false, error: "AI returned unexpected data." };
    } catch (e) {
      return {
        ok: false,
        error:
          e instanceof Error ? e.message : "Network error. Check connection.",
      };
    }
  }

  function addPage() {
    const trimmed = newPageName.trim();
    if (!trimmed) {
      showToast("Please enter a page name", "error");
      return;
    }
    const key = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (pages[key]) {
      showToast("A page with similar name already exists", "error");
      return;
    }
    updatePages({
      ...pages,
      [key]: { name: trimmed, path: `/${key}`, components: [] },
    });
    setCurrentPageKey(key);
    setNewPageName("");
    setShowNewPageModal(false);
    showToast(`Page "${trimmed}" created`, "success");
  }

  function deletePage(key: string) {
    if (key === "home") {
      showToast("Home page cannot be deleted", "error");
      return;
    }
    showConfirm(
      "Delete page?",
      `"${pages[key].name}" and all its components will be permanently deleted. This cannot be undone.`,
      () => {
        const np = { ...pages };
        delete np[key];
        updatePages(np);
        if (currentPageKey === key) setCurrentPageKey("home");
        showToast(`Page "${pages[key].name}" deleted`, "success");
      }
    );
  }

  const saveFn = async () => {
    if (!hasUnsavedChanges && lastSavedAt) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/projects/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, pages: data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSaveError(err.error || "Failed to save");
        showToast("Failed to save. Please try again.", "error");
        setSaving(false);
        return;
      }
      setSaved(true);
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setSaveError("Network error");
      showToast("Network error. Check your connection.", "error");
    }
    setSaving(false);
  };

  async function handleSave() {
    await saveFn();
  }

  async function handleExport() {
    if (hasUnsavedChanges) {
      await saveFn();
    }

    setExporting(true);
    try {
      const res = await fetch("/api/projects/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        showToast("Export failed. Please try again.", "error");
        setExporting(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename =
        (settings.siteName || "website")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "website";
      a.download = `${filename}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("Website downloaded! Check your Downloads folder.", "success");
    } catch (e) {
      showToast("Export failed. Check connection.", "error");
    }
    setExporting(false);
  }

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      saveFn();
    }, 30000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges, data]);

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const cmd = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === "Escape" && showPreview) {
        setShowPreview(false);
        return;
      }

      if (cmd && e.key === "s") {
        e.preventDefault();
        saveFn();
        return;
      }

      if (cmd && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }

      if ((cmd && e.shiftKey && e.key === "z") || (cmd && e.key === "y")) {
        e.preventDefault();
        redo();
        return;
      }

      if (cmd && e.key === "d" && selectedId) {
        e.preventDefault();
        duplicateComponent(selectedId);
        return;
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedId &&
        !["INPUT", "TEXTAREA"].includes(
          (e.target as HTMLElement)?.tagName || ""
        )
      ) {
        e.preventDefault();
        deleteComponent(selectedId);
        return;
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hasUnsavedChanges, selectedId, historyIndex, history, showPreview]);

  const rpx = radiusPx(theme.radius);
  const sh = shadowCss(theme.shadow);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/projects" className="rounded-md p-1.5 text-text-muted hover:bg-bg hover:text-text-primary">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-text-primary">
              {settings.favicon} {settings.siteName}
            </h1>
            <p className="text-xs text-text-muted">
              {Object.keys(pages).length} pages
              {hasUnsavedChanges && " • unsaved"}
              {lastSavedAt && !hasUnsavedChanges && ` • saved ${lastSavedAt.toLocaleTimeString()}`}
            </p>
          </div>

          <div className="ml-2 flex items-center gap-1 rounded-md border border-border bg-bg p-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowPreview(true)}
            className="!px-3 !py-1.5 !text-xs"
          >
            <Eye size={14} /> Preview
          </Button>
          <Button variant="secondary" onClick={() => setShowSettingsModal(true)} className="!px-3 !py-1.5 !text-xs">
            <Settings size={14} /> Site
          </Button>
          <div className="flex flex-col items-end">
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={saving}
              className="!px-3 !py-1.5 !text-xs"
            >
              <Save size={14} />
              {saving
                ? "Saving..."
                : saved
                ? "Saved!"
                : hasUnsavedChanges
                ? "Save *"
                : "Save"}
            </Button>
            {saveError && (
              <span className="mt-0.5 text-[10px] text-critical">{saveError}</span>
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={exporting}
            className="!px-3 !py-1.5 !text-xs"
          >
            <Download size={14} /> {exporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </header>

      {/* Page tabs */}
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-2">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="mr-1 flex shrink-0 items-center justify-center rounded-md border border-border bg-bg p-1.5 text-text-muted transition-colors hover:border-accent hover:text-accent"
          title={sidebarCollapsed ? "Show components" : "Hide components"}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {Object.entries(pages).map(([key, page]) => (
          <div
            key={key}
            className={`group flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              currentPageKey === key ? "bg-accent/10 text-accent" : "text-text-muted hover:bg-bg"
            }`}
          >
            <button onClick={() => setCurrentPageKey(key)} className="flex items-center gap-1.5">
              <FileText size={12} /> {page.name}
            </button>
            {key !== "home" && currentPageKey === key && (
              <button onClick={() => deletePage(key)} className="rounded p-0.5 hover:bg-critical/10 hover:text-critical">
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowNewPageModal(true)}
          className="ml-2 flex shrink-0 items-center gap-1 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:border-accent hover:text-accent"
        >
          <Plus size={12} /> Add Page
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`shrink-0 overflow-hidden border-r border-border bg-surface transition-all duration-200 ${
            sidebarCollapsed ? "w-0" : "w-60"
          }`}
        >
          <div className="h-full w-60 overflow-y-auto">
            <div className="p-4">
              <p className="text-xs text-text-muted">Drag onto canvas →</p>
              {GROUPS.map((group) => (
                <div key={group} className="mt-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    {group}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {LIBRARY.filter((c) => c.group === group).map((comp) => {
                      const Icon = comp.icon;
                      return (
                        <div
                          key={comp.type}
                          draggable
                          onDragStart={() => setDraggedType(comp.type)}
                          onDragEnd={() => setDraggedType(null)}
                          className="flex cursor-grab items-center gap-2.5 rounded-lg border border-border bg-bg px-2.5 py-2 text-xs text-text-primary hover:border-accent/50 hover:bg-accent/5"
                        >
                          <Icon size={14} className="text-text-muted" />
                          {comp.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-bg p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs text-text-muted">
                {currentPage?.name} — {components.length} component{components.length !== 1 ? "s" : ""}
              </span>
              <span className="font-mono text-xs text-text-muted">{currentPage?.path}</span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dropIndicator !== null) handleReorderDrop(dropIndicator);
                else handleReorderDrop(components.length);
              }}
              onClick={() => setSelectedId(null)}
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                fontFamily: theme.font,
                borderRadius: rpx,
              }}
              className="min-h-[500px] border-2 border-dashed border-border p-4"
            >
              {components.length === 0 ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Layout size={24} />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold">{currentPage?.name} is empty</h2>
                  <p className="mt-2 max-w-sm text-sm opacity-70">
                    Drag components or ask AI to build it for you.
                  </p>
                </div>
              ) : (
                <div>
                  {components.map((comp, index) => (
                    <div key={comp.id}>
                      <DropZone
                        isActive={dropIndicator === index}
                        show={draggedId !== null || draggedType !== null}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDropIndicator(index);
                        }}
                        onDragLeave={() => setDropIndicator(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReorderDrop(index);
                        }}
                      />
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setDraggedId(comp.id);
                          setDraggedType(null);
                        }}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDropIndicator(null);
                        }}
                      >
                        <ComponentRenderer
                          component={comp}
                          theme={theme}
                          rpx={rpx}
                          sh={sh}
                          isSelected={selectedId === comp.id}
                          onSelect={() => {
                            setSelectedId(comp.id);
                            setRightTab("properties");
                          }}
                          onDelete={() => deleteComponent(comp.id)}
                          onDuplicate={() => duplicateComponent(comp.id)}
                          onMoveUp={() => moveComponent(index, index - 1)}
                          onMoveDown={() => moveComponent(index, index + 1)}
                          allPages={pages}
                          onNavigatePage={setCurrentPageKey}
                        />
                      </div>
                    </div>
                  ))}
                  <DropZone
                    isActive={dropIndicator === components.length}
                    show={draggedId !== null || draggedType !== null}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDropIndicator(components.length);
                    }}
                    onDragLeave={() => setDropIndicator(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReorderDrop(components.length);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-surface">
          <div className="flex border-b border-border">
            {(["properties", "theme", "ai"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex flex-1 items-center justify-center gap-1 px-3 py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                  rightTab === tab
                    ? "border-b-2 border-accent text-accent"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab === "ai" && <Sparkles size={10} />}
                {tab === "theme" && <Settings2 size={10} />}
                {tab === "properties" && <Layers size={10} />}
                {tab}
              </button>
            ))}
          </div>

          {rightTab === "ai" ? (
            <div className="flex-1 overflow-hidden">
              <AIChat onApply={handleAIEdit} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              {rightTab === "properties" ? (
                selectedComponent ? (
                  <PropertiesPanel
                    component={selectedComponent}
                    onChange={(p) => updateComponentProps(selectedComponent.id, p)}
                    onStyleChange={(s) => updateComponentStyle(selectedComponent.id, s)}
                    onDelete={() => deleteComponent(selectedComponent.id)}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-bg p-6 text-center">
                    <p className="text-xs text-text-muted">Click a component to edit</p>
                  </div>
                )
              ) : (
                <ThemePanel
                  theme={theme}
                  onChange={(t) => {
                    applyData({ ...data, theme: t });
                  }}
                />
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-black/90 backdrop-blur-md">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-black/50 px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Preview</span>
              <span className="text-xs text-white/50">
                — {currentPage?.name}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/30 p-0.5">
              {[
                { key: "desktop" as const, icon: Monitor, label: "Desktop" },
                { key: "tablet" as const, icon: Tablet, label: "Tablet" },
                { key: "mobile" as const, icon: Smartphone, label: "Mobile" },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setPreviewDevice(key)}
                  className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    previewDevice === key
                      ? "bg-accent text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                  title={label}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
            >
              <X size={14} />
              Close
            </button>
          </div>

          <div className="flex flex-1 items-start justify-center overflow-auto p-6">
            <div
              className="overflow-y-auto transition-all duration-300"
              style={{
                width:
                  previewDevice === "desktop"
                    ? "100%"
                    : previewDevice === "tablet"
                    ? "768px"
                    : "375px",
                maxWidth: "100%",
                maxHeight: "100%",
                backgroundColor: theme.background,
                color: theme.text,
                fontFamily: theme.font,
                borderRadius:
                  previewDevice === "desktop" ? "8px" : "24px",
                boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
                border:
                  previewDevice === "desktop"
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "8px solid #1a1a1a",
              }}
            >
              <div className="min-h-full">
                {components.length === 0 ? (
                  <div className="flex min-h-[400px] items-center justify-center text-center opacity-50">
                    <p className="text-sm">This page is empty</p>
                  </div>
                ) : (
                  components.map((comp) => (
                    <ComponentPreview
                      key={comp.id}
                      component={comp}
                      theme={theme}
                      rpx={rpx}
                      sh={sh}
                      allPages={pages}
                      onNavigatePage={(key) => setCurrentPageKey(key)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-black/50 px-4 py-2 text-center">
            <p className="text-xs text-white/40">
              Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">ESC</kbd> to close • Try clicking links inside
            </p>
          </div>
        </div>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setShowNewPageModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-text-primary">New Page</h3>
            <p className="mt-1 text-sm text-text-muted">
              Give your new page a name.
            </p>
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPage()}
              placeholder="e.g. About, Contact"
              autoFocus
              className="mt-4 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowNewPageModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={addPage}>
                <Check size={14} /> Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Site Settings Modal */}
      {showSettingsModal && (
        <SiteSettingsModal
          settings={settings}
          onSave={(s) => {
            applyData({ ...data, settings: s });
            showToast("Site settings updated", "success");
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Themed Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title || ""}
        message={confirmDialog?.message || ""}
        confirmText={confirmDialog?.confirmText || "Delete"}
        onConfirm={() => {
          confirmDialog?.onConfirm();
          setConfirmDialog(null);
        }}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* Themed Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function DropZone({
  isActive,
  show,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  isActive: boolean;
  show: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`transition-all ${
        isActive
          ? "my-1 h-16 rounded-lg border-2 border-dashed border-accent bg-accent/10"
          : show
          ? "h-2"
          : "h-0"
      }`}
    />
  );
}

function ComponentRenderer({
  component,
  theme,
  rpx,
  sh,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  allPages,
  onNavigatePage,
}: {
  component: Component;
  theme: Theme;
  rpx: string;
  sh: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  allPages: PagesData;
  onNavigatePage: (key: string) => void;
}) {
  const style = component.style || {};
  const wrapperStyle: React.CSSProperties = {
    borderRadius: rpx,
    textAlign: style.align || "inherit",
    paddingTop: style.paddingTop ? `${style.paddingTop}px` : undefined,
    paddingBottom: style.paddingBottom ? `${style.paddingBottom}px` : undefined,
    backgroundColor: style.bgColor || undefined,
    color: style.textColor || undefined,
    fontSize: style.fontSize ? `${style.fontSize}%` : undefined,
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={wrapperStyle}
      className={`group relative cursor-pointer border-2 p-4 transition-all ${
        isSelected ? "border-accent" : "border-transparent hover:border-white/20"
      }`}
    >
      <div className="absolute left-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical size={12} className="cursor-move text-text-muted" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="rounded bg-bg/80 px-1.5 py-0.5 text-[10px] text-text-muted hover:bg-bg hover:text-accent"
          title="Move up"
        >
          ↑
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="rounded bg-bg/80 px-1.5 py-0.5 text-[10px] text-text-muted hover:bg-bg hover:text-accent"
          title="Move down"
        >
          ↓
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="rounded bg-bg/80 p-1 text-text-muted hover:bg-bg hover:text-accent"
          title="Duplicate (Ctrl+D)"
        >
          <Copy size={10} />
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 top-2 z-10 rounded-md bg-critical/20 p-1.5 text-critical opacity-0 group-hover:opacity-100"
        title="Delete (Del)"
      >
        <Trash2 size={12} />
      </button>

      <ComponentPreview
        component={component}
        theme={theme}
        rpx={rpx}
        sh={sh}
        allPages={allPages}
        onNavigatePage={onNavigatePage}
      />
    </div>
  );
}

function ComponentPreview({
  component,
  theme,
  rpx,
  sh,
  allPages,
  onNavigatePage,
}: {
  component: Component;
  theme: Theme;
  rpx: string;
  sh: string;
  allPages: PagesData;
  onNavigatePage: (key: string) => void;
}) {
  const { type, props } = component;
  const sp = theme.spacing === "compact" ? 12 : theme.spacing === "spacious" ? 32 : 20;

  if (type === "navbar") {
    return (
      <div className="flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.text}20`, paddingBottom: sp }}>
        <span className="font-bold" style={{ color: theme.text }}>{props.logo}</span>
        <div className="flex gap-4 text-sm">
          {props.links?.map((l: any, i: number) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (l.pageKey && allPages[l.pageKey]) onNavigatePage(l.pageKey);
              }}
              style={{ color: theme.text, opacity: 0.8 }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className="text-center" style={{ padding: `${sp}px 0` }}>
        <h1 className="text-2xl font-bold" style={{ color: theme.text }}>{props.heading}</h1>
        <p className="mt-2 text-sm" style={{ color: theme.text, opacity: 0.7 }}>{props.subheading}</p>
        <button
          className="mt-4 px-5 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: theme.primary, borderRadius: rpx, boxShadow: sh }}
        >
          {props.buttonText}
        </button>
      </div>
    );
  }

  if (type === "features") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {props.items?.map((it: any, i: number) => (
            <div key={i} className="border p-3 text-center" style={{ borderColor: `${theme.text}20`, borderRadius: rpx }}>
              <p className="text-sm font-semibold" style={{ color: theme.primary }}>{it.title}</p>
              <p className="mt-1 text-xs" style={{ color: theme.text, opacity: 0.6 }}>{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "pricing") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <p className="mt-1 text-center text-xs" style={{ color: theme.text, opacity: 0.6 }}>{props.subheading}</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {props.plans?.map((plan: any, i: number) => (
            <div
              key={i}
              className="border p-3"
              style={{
                borderColor: plan.highlighted ? theme.primary : `${theme.text}20`,
                borderRadius: rpx,
                backgroundColor: plan.highlighted ? `${theme.primary}10` : "transparent",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: theme.text }}>{plan.name}</p>
              <p className="mt-1.5 text-lg font-bold" style={{ color: theme.primary }}>
                {plan.price}<span className="text-[10px] opacity-60">{plan.period}</span>
              </p>
              <ul className="mt-2 space-y-1">
                {plan.features?.slice(0, 3).map((f: string, j: number) => (
                  <li key={j} className="text-[10px]" style={{ color: theme.text, opacity: 0.7 }}>✓ {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "testimonial") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {props.items?.map((t: any, i: number) => (
            <div key={i} className="border p-3" style={{ borderColor: `${theme.text}20`, borderRadius: rpx }}>
              <p className="text-xs italic" style={{ color: theme.text, opacity: 0.8 }}>"{t.quote}"</p>
              <p className="mt-2 text-[10px] font-semibold" style={{ color: theme.primary }}>{t.author}</p>
              <p className="text-[10px]" style={{ color: theme.text, opacity: 0.5 }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cta") {
    return (
      <div className="text-center" style={{ padding: `${sp + 12}px 16px`, backgroundColor: `${theme.primary}15`, borderRadius: rpx }}>
        <h2 className="text-xl font-bold" style={{ color: theme.text }}>{props.heading}</h2>
        <p className="mt-1.5 text-sm" style={{ color: theme.text, opacity: 0.7 }}>{props.subheading}</p>
        <button className="mt-4 px-5 py-2 text-sm font-medium text-white" style={{ backgroundColor: theme.primary, borderRadius: rpx }}>
          {props.buttonText}
        </button>
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-4 gap-3" style={{ padding: `${sp}px 0` }}>
        {props.items?.map((item: any, i: number) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-bold" style={{ color: theme.primary }}>{item.value}</p>
            <p className="mt-1 text-[10px]" style={{ color: theme.text, opacity: 0.6 }}>{item.label}</p>
          </div>
        ))}
      </div>
    );
  }

  if (type === "gallery") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {props.images?.map((img: any, i: number) => (
            <div
              key={i}
              className="flex h-24 items-center justify-center border border-dashed text-[10px]"
              style={{ borderColor: `${theme.text}30`, color: theme.text, opacity: 0.6, borderRadius: rpx }}
            >
              {img.src ? <img src={img.src} alt={img.alt} className="h-full w-full object-cover" style={{ borderRadius: rpx }} /> : "Image"}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <p className="mt-1 text-center text-xs" style={{ color: theme.text, opacity: 0.6 }}>{props.subheading}</p>
        <div className="mt-4 space-y-2">
          {props.fields?.map((f: string, i: number) => (
            <div key={i}>
              <label className="text-[10px]" style={{ color: theme.text, opacity: 0.6 }}>{f}</label>
              <div className="mt-1 h-8 border" style={{ borderColor: `${theme.text}20`, borderRadius: rpx }} />
            </div>
          ))}
          <button className="mt-2 w-full px-5 py-2 text-sm font-medium text-white" style={{ backgroundColor: theme.primary, borderRadius: rpx }}>
            {props.buttonText}
          </button>
        </div>
      </div>
    );
  }

  if (type === "faq") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <div className="mt-4 space-y-2">
          {props.items?.map((item: any, i: number) => (
            <div key={i} className="border p-3" style={{ borderColor: `${theme.text}20`, borderRadius: rpx }}>
              <p className="text-sm font-medium" style={{ color: theme.text }}>{item.question}</p>
              <p className="mt-1 text-xs" style={{ color: theme.text, opacity: 0.6 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "team") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {props.items?.map((m: any, i: number) => (
            <div key={i} className="text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {m.name?.charAt(0) || "?"}
              </div>
              <p className="mt-2 text-xs font-semibold" style={{ color: theme.text }}>{m.name}</p>
              <p className="text-[10px]" style={{ color: theme.text, opacity: 0.6 }}>{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "logos") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <p className="text-center text-xs" style={{ color: theme.text, opacity: 0.6 }}>{props.heading}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-6">
          {props.items?.map((logo: string, i: number) => (
            <span key={i} className="text-sm font-bold" style={{ color: theme.text, opacity: 0.5 }}>
              {logo}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "video") {
    return (
      <div style={{ padding: `${sp}px 0` }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: theme.text }}>{props.heading}</h2>
        <div
          className="mt-4 flex aspect-video items-center justify-center border border-dashed text-xs"
          style={{ borderColor: `${theme.text}30`, color: theme.text, opacity: 0.6, borderRadius: rpx }}
        >
          {props.url ? "▶ Video" : "Video Placeholder"}
        </div>
      </div>
    );
  }

  if (type === "divider") {
    return (
      <div className="flex items-center" style={{ padding: `${sp / 2}px 0` }}>
        <div className="h-px flex-1" style={{ backgroundColor: `${theme.text}30` }} />
      </div>
    );
  }

  if (type === "text") {
    return <p className="text-sm" style={{ color: theme.text, padding: `${sp}px 0` }}>{props.content}</p>;
  }

  if (type === "image") {
    return (
      <div
        className="flex h-32 items-center justify-center border border-dashed text-xs"
        style={{ borderColor: `${theme.text}30`, color: theme.text, borderRadius: rpx }}
      >
        {props.src ? <img src={props.src} alt={props.alt} className="h-full w-full object-cover" style={{ borderRadius: rpx }} /> : "Image Placeholder"}
      </div>
    );
  }

  if (type === "button") {
    return (
      <div className="flex justify-center" style={{ padding: `${sp}px 0` }}>
        <button className="px-5 py-2 text-sm font-medium text-white" style={{ backgroundColor: theme.primary, borderRadius: rpx }}>
          {props.text}
        </button>
      </div>
    );
  }

  if (type === "footer") {
    return (
      <div
        className="text-center text-xs"
        style={{ borderTop: `1px solid ${theme.text}20`, color: theme.text, opacity: 0.6, padding: `${sp}px 0` }}
      >
        {props.text}
      </div>
    );
  }

  return <div style={{ color: theme.text }}>{type}</div>;
}