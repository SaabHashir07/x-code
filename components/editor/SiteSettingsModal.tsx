"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import Button from "@/components/Button";

type SiteSettings = {
  siteName: string;
  tagline: string;
  favicon: string;
};

type Props = {
  settings: SiteSettings;
  onSave: (s: SiteSettings) => void;
  onClose: () => void;
};

export default function SiteSettingsModal({ settings, onSave, onClose }: Props) {
  const [form, setForm] = useState(settings);

  function set<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setForm({ ...form, [k]: v });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Site Settings
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Configure your website&apos;s identity
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-muted hover:bg-bg hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Site Name
            </label>
            <input
              type="text"
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
              placeholder="My Awesome Site"
              autoFocus
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="A short description"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-muted">
              Favicon (emoji or URL)
            </label>
            <input
              type="text"
              value={form.favicon}
              onChange={(e) => set("favicon", e.target.value)}
              placeholder="🚀 or https://..."
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            <Check size={14} />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}