"use client";

import { useState } from "react";
import { Palette, Type, Sparkles, Square, Layers } from "lucide-react";
import {
  Theme,
  THEME_PRESETS,
  FONTS,
  RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  SPACING_OPTIONS,
} from "./theme";

type Props = { theme: Theme; onChange: (t: Theme) => void };

export default function ThemePanel({ theme, onChange }: Props) {
  const [search, setSearch] = useState("");

  function update<K extends keyof Theme>(key: K, value: Theme[K]) {
    onChange({ ...theme, [key]: value });
  }

  const filteredPresets = THEME_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Presets ({THEME_PRESETS.length})
          </h3>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search themes..."
          className="mt-2 w-full rounded-md border border-border bg-bg px-2 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <div className="mt-3 max-h-56 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            {filteredPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => onChange({ ...p.theme })}
                className={`flex flex-col gap-1.5 rounded-lg border p-2 text-left transition-colors ${
                  theme.preset === p.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-bg hover:border-accent/50"
                }`}
              >
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.theme.primary }} />
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.theme.secondary }} />
                  <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: p.theme.background }} />
                </div>
                <span className="text-[10px] font-medium text-text-primary">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Palette size={14} className="text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Colors
          </h3>
        </div>
        <div className="mt-3 space-y-2">
          {(
            [
              { key: "primary", label: "Primary" },
              { key: "secondary", label: "Secondary" },
              { key: "background", label: "Background" },
              { key: "surface", label: "Surface" },
              { key: "text", label: "Text" },
              { key: "textMuted", label: "Muted" },
            ] as { key: keyof Theme; label: string }[]
          ).map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <input
                type="color"
                value={theme[item.key] as string}
                onChange={(e) => update(item.key, e.target.value as any)}
                className="h-7 w-8 cursor-pointer rounded border border-border bg-bg"
              />
              <span className="flex-1 text-xs text-text-primary">{item.label}</span>
              <span className="font-mono text-[10px] text-text-muted">
                {theme[item.key] as string}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Type size={14} className="text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Font
          </h3>
        </div>
        <select
          value={theme.font}
          onChange={(e) => update("font", e.target.value)}
          className="mt-2 w-full rounded-md border border-border bg-bg px-2 py-1.5 text-xs text-text-primary focus:border-accent focus:outline-none"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Square size={14} className="text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Corner Style
          </h3>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("radius", opt.value)}
              className={`rounded-md border py-1.5 text-[10px] font-medium transition-colors ${
                theme.radius === opt.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Shadow
          </h3>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1">
          {SHADOW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("shadow", opt.value)}
              className={`rounded-md border py-1.5 text-[10px] font-medium transition-colors ${
                theme.shadow === opt.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Spacing
        </h3>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {SPACING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("spacing", opt.value)}
              className={`rounded-md border py-1.5 text-[10px] font-medium transition-colors ${
                theme.spacing === opt.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}