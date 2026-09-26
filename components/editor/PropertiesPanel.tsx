"use client";

import { Trash2 } from "lucide-react";

type Component = {
  id: string;
  type: string;
  props: Record<string, any>;
  style?: Record<string, any>;
};

type Props = {
  component: Component;
  onChange: (props: Record<string, any>) => void;
  onStyleChange: (style: Record<string, any>) => void;
  onDelete: () => void;
};

const ALIGNS = ["left", "center", "right"];

export default function PropertiesPanel({
  component,
  onChange,
  onStyleChange,
  onDelete,
}: Props) {
  const style = component.style || {};
  function set(key: string, value: any) {
    onChange({ ...component.props, [key]: value });
  }
  function setStyle(key: string, value: any) {
    onStyleChange({ ...style, [key]: value });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {component.type}
          </p>
          <p className="mt-0.5 text-[10px] text-text-muted">
            {component.id.slice(-6)}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="rounded-md bg-critical/10 p-1.5 text-critical hover:bg-critical/20"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {component.type === "navbar" && (
          <>
            <Field label="Logo">
              <input
                type="text"
                value={component.props.logo || ""}
                onChange={(e) => set("logo", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Links">
              {(component.props.links || []).map((link: any, i: number) => (
                <div key={i} className="flex gap-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const n = [...component.props.links];
                      n[i] = { ...link, label: e.target.value };
                      set("links", n);
                    }}
                    placeholder="Label"
                    className="ipt flex-1"
                  />
                  <input
                    type="text"
                    value={link.pageKey}
                    onChange={(e) => {
                      const n = [...component.props.links];
                      n[i] = { ...link, pageKey: e.target.value };
                      set("links", n);
                    }}
                    placeholder="page"
                    className="ipt flex-1 font-mono text-[10px]"
                  />
                </div>
              ))}
            </Field>
          </>
        )}

        {component.type === "hero" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Subheading">
              <textarea
                value={component.props.subheading || ""}
                onChange={(e) => set("subheading", e.target.value)}
                rows={3}
                className="ipt resize-none"
              />
            </Field>
            <Field label="Button Text">
              <input
                type="text"
                value={component.props.buttonText || ""}
                onChange={(e) => set("buttonText", e.target.value)}
                className="ipt"
              />
            </Field>
          </>
        )}

        {component.type === "features" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Items">
              {(component.props.items || []).map((item: any, i: number) => (
                <div key={i} className="space-y-1 rounded border border-border p-2">
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...item, title: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Title"
                    className="ipt"
                  />
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...item, description: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Description"
                    className="ipt"
                  />
                </div>
              ))}
            </Field>
          </>
        )}

        {component.type === "pricing" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Subheading">
              <input
                type="text"
                value={component.props.subheading || ""}
                onChange={(e) => set("subheading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Plans">
              {(component.props.plans || []).map((plan: any, i: number) => (
                <div key={i} className="space-y-1 rounded border border-border p-2">
                  <input
                    type="text"
                    value={plan.name || ""}
                    onChange={(e) => {
                      const n = [...component.props.plans];
                      n[i] = { ...plan, name: e.target.value };
                      set("plans", n);
                    }}
                    placeholder="Plan name"
                    className="ipt"
                  />
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={plan.price || ""}
                      onChange={(e) => {
                        const n = [...component.props.plans];
                        n[i] = { ...plan, price: e.target.value };
                        set("plans", n);
                      }}
                      placeholder="$9"
                      className="ipt flex-1"
                    />
                    <input
                      type="text"
                      value={plan.period || ""}
                      onChange={(e) => {
                        const n = [...component.props.plans];
                        n[i] = { ...plan, period: e.target.value };
                        set("plans", n);
                      }}
                      placeholder="/mo"
                      className="ipt flex-1"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-[10px] text-text-muted">
                    <input
                      type="checkbox"
                      checked={plan.highlighted || false}
                      onChange={(e) => {
                        const n = [...component.props.plans];
                        n[i] = { ...plan, highlighted: e.target.checked };
                        set("plans", n);
                      }}
                    />
                    Popular
                  </label>
                </div>
              ))}
            </Field>
          </>
        )}

        {component.type === "testimonial" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Items">
              {(component.props.items || []).map((t: any, i: number) => (
                <div key={i} className="space-y-1 rounded border border-border p-2">
                  <textarea
                    value={t.quote || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...t, quote: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Quote"
                    rows={2}
                    className="ipt resize-none"
                  />
                  <input
                    type="text"
                    value={t.author || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...t, author: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Author"
                    className="ipt"
                  />
                  <input
                    type="text"
                    value={t.role || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...t, role: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Role"
                    className="ipt"
                  />
                </div>
              ))}
            </Field>
          </>
        )}

        {component.type === "cta" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Subheading">
              <input
                type="text"
                value={component.props.subheading || ""}
                onChange={(e) => set("subheading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Button">
              <input
                type="text"
                value={component.props.buttonText || ""}
                onChange={(e) => set("buttonText", e.target.value)}
                className="ipt"
              />
            </Field>
          </>
        )}

        {component.type === "stats" && (
          <Field label="Stats">
            {(component.props.items || []).map((item: any, i: number) => (
              <div key={i} className="flex gap-1 rounded border border-border p-2">
                <input
                  type="text"
                  value={item.value || ""}
                  onChange={(e) => {
                    const n = [...component.props.items];
                    n[i] = { ...item, value: e.target.value };
                    set("items", n);
                  }}
                  placeholder="10K+"
                  className="ipt flex-1"
                />
                <input
                  type="text"
                  value={item.label || ""}
                  onChange={(e) => {
                    const n = [...component.props.items];
                    n[i] = { ...item, label: e.target.value };
                    set("items", n);
                  }}
                  placeholder="Users"
                  className="ipt flex-1"
                />
              </div>
            ))}
          </Field>
        )}

        {component.type === "faq" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Questions">
              {(component.props.items || []).map((item: any, i: number) => (
                <div key={i} className="space-y-1 rounded border border-border p-2">
                  <input
                    type="text"
                    value={item.question || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...item, question: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Question"
                    className="ipt"
                  />
                  <textarea
                    value={item.answer || ""}
                    onChange={(e) => {
                      const n = [...component.props.items];
                      n[i] = { ...item, answer: e.target.value };
                      set("items", n);
                    }}
                    placeholder="Answer"
                    rows={2}
                    className="ipt resize-none"
                  />
                </div>
              ))}
            </Field>
          </>
        )}

        {component.type === "contact" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Subheading">
              <input
                type="text"
                value={component.props.subheading || ""}
                onChange={(e) => set("subheading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Button Text">
              <input
                type="text"
                value={component.props.buttonText || ""}
                onChange={(e) => set("buttonText", e.target.value)}
                className="ipt"
              />
            </Field>
          </>
        )}

        {component.type === "team" && (
          <Field label="Members">
            {(component.props.items || []).map((m: any, i: number) => (
              <div key={i} className="space-y-1 rounded border border-border p-2">
                <input
                  type="text"
                  value={m.name || ""}
                  onChange={(e) => {
                    const n = [...component.props.items];
                    n[i] = { ...m, name: e.target.value };
                    set("items", n);
                  }}
                  placeholder="Name"
                  className="ipt"
                />
                <input
                  type="text"
                  value={m.role || ""}
                  onChange={(e) => {
                    const n = [...component.props.items];
                    n[i] = { ...m, role: e.target.value };
                    set("items", n);
                  }}
                  placeholder="Role"
                  className="ipt"
                />
              </div>
            ))}
          </Field>
        )}

        {component.type === "logos" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Logos">
              {(component.props.items || []).map((logo: string, i: number) => (
                <input
                  key={i}
                  type="text"
                  value={logo}
                  onChange={(e) => {
                    const n = [...component.props.items];
                    n[i] = e.target.value;
                    set("items", n);
                  }}
                  placeholder="Brand name"
                  className="ipt"
                />
              ))}
            </Field>
          </>
        )}

        {component.type === "video" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Video URL">
              <input
                type="text"
                value={component.props.url || ""}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://youtube.com/..."
                className="ipt"
              />
            </Field>
          </>
        )}

        {component.type === "text" && (
          <Field label="Content">
            <textarea
              value={component.props.content || ""}
              onChange={(e) => set("content", e.target.value)}
              rows={5}
              className="ipt resize-none"
            />
          </Field>
        )}

        {component.type === "image" && (
          <>
            <Field label="Image URL">
              <input
                type="text"
                value={component.props.src || ""}
                onChange={(e) => set("src", e.target.value)}
                placeholder="https://..."
                className="ipt"
              />
            </Field>
            <Field label="Alt">
              <input
                type="text"
                value={component.props.alt || ""}
                onChange={(e) => set("alt", e.target.value)}
                className="ipt"
              />
            </Field>
          </>
        )}

        {component.type === "gallery" && (
          <>
            <Field label="Heading">
              <input
                type="text"
                value={component.props.heading || ""}
                onChange={(e) => set("heading", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Images">
              {(component.props.images || []).map((img: any, i: number) => (
                <input
                  key={i}
                  type="text"
                  value={img.src || ""}
                  onChange={(e) => {
                    const n = [...component.props.images];
                    n[i] = { ...img, src: e.target.value };
                    set("images", n);
                  }}
                  placeholder="https://..."
                  className="ipt"
                />
              ))}
            </Field>
          </>
        )}

        {component.type === "button" && (
          <>
            <Field label="Text">
              <input
                type="text"
                value={component.props.text || ""}
                onChange={(e) => set("text", e.target.value)}
                className="ipt"
              />
            </Field>
            <Field label="Link to Page">
              <input
                type="text"
                value={component.props.pageKey || ""}
                onChange={(e) => set("pageKey", e.target.value)}
                className="ipt"
              />
            </Field>
          </>
        )}

        {component.type === "footer" && (
          <Field label="Text">
            <input
              type="text"
              value={component.props.text || ""}
              onChange={(e) => set("text", e.target.value)}
              className="ipt"
            />
          </Field>
        )}
      </div>

      {/* Style overrides */}
      <div className="border-t border-border pt-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          Style
        </h3>

        <div className="mt-3 space-y-3">
          <Field label="Text Align">
            <div className="grid grid-cols-3 gap-1">
              {ALIGNS.map((a) => (
                <button
                  key={a}
                  onClick={() => setStyle("align", a)}
                  className={`rounded border py-1.5 text-[10px] capitalize transition-colors ${
                    style.align === a
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </Field>

          <Field label={`Padding Top (${style.paddingTop ?? 0}px)`}>
            <input
              type="range"
              min={0}
              max={120}
              step={4}
              value={style.paddingTop ?? 0}
              onChange={(e) => setStyle("paddingTop", Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </Field>

          <Field label={`Padding Bottom (${style.paddingBottom ?? 0}px)`}>
            <input
              type="range"
              min={0}
              max={120}
              step={4}
              value={style.paddingBottom ?? 0}
              onChange={(e) => setStyle("paddingBottom", Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </Field>

          <Field label={`Font Scale (${style.fontSize ?? 100}%)`}>
            <input
              type="range"
              min={60}
              max={180}
              step={5}
              value={style.fontSize ?? 100}
              onChange={(e) => setStyle("fontSize", Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </Field>

          <Field label="Background Override">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.bgColor || "#000000"}
                onChange={(e) => setStyle("bgColor", e.target.value)}
                className="h-7 w-8 cursor-pointer rounded border border-border"
              />
              <button
                onClick={() => setStyle("bgColor", "")}
                className="text-[10px] text-text-muted hover:text-text-primary"
              >
                Clear
              </button>
            </div>
          </Field>

          <Field label="Text Color Override">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.textColor || "#ffffff"}
                onChange={(e) => setStyle("textColor", e.target.value)}
                className="h-7 w-8 cursor-pointer rounded border border-border"
              />
              <button
                onClick={() => setStyle("textColor", "")}
                className="text-[10px] text-text-muted hover:text-text-primary"
              >
                Clear
              </button>
            </div>
          </Field>
        </div>
      </div>

      <style jsx>{`
        .ipt {
          width: 100%;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--bg);
          padding: 6px 8px;
          font-size: 12px;
          color: var(--text-primary);
          outline: none;
        }
        .ipt:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </label>
      <div className="space-y-1">{children}</div>
    </div>
  );
}