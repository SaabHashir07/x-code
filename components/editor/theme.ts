export type Theme = {
  preset: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  font: string;
  radius: "sm" | "md" | "lg" | "xl";
  shadow: "none" | "soft" | "medium" | "strong";
  spacing: "compact" | "normal" | "spacious";
};

export const DEFAULT_THEME: Theme = {
  preset: "modern",
  primary: "#4F6EF7",
  secondary: "#8B5CF6",
  background: "#0B0E14",
  surface: "#121620",
  text: "#F5F7FA",
  textMuted: "#8B92A5",
  font: "Inter",
  radius: "lg",
  shadow: "soft",
  spacing: "normal",
};

const base = DEFAULT_THEME;

export const THEME_PRESETS: { id: string; name: string; theme: Theme }[] = [
  { id: "modern", name: "Modern", theme: { ...base } },
  {
    id: "minimal",
    name: "Minimal",
    theme: { ...base, preset: "minimal", primary: "#000000", secondary: "#666666", background: "#FFFFFF", surface: "#F8F8F8", text: "#111111", textMuted: "#666666" },
  },
  {
    id: "bold",
    name: "Bold",
    theme: { ...base, preset: "bold", primary: "#F97316", secondary: "#EF4444", background: "#0A0A0A", surface: "#171717", text: "#FFFFFF", textMuted: "#9CA3AF", font: "Poppins", radius: "xl", shadow: "strong" },
  },
  {
    id: "elegant",
    name: "Elegant",
    theme: { ...base, preset: "elegant", primary: "#B8860B", secondary: "#8B7355", background: "#1A1614", surface: "#26201D", text: "#F5F0E8", textMuted: "#A89B8C", font: "Manrope" },
  },
  {
    id: "playful",
    name: "Playful",
    theme: { ...base, preset: "playful", primary: "#EC4899", secondary: "#8B5CF6", background: "#FEF3C7", surface: "#FFFFFF", text: "#1F2937", textMuted: "#6B7280", font: "Poppins", radius: "xl" },
  },
  {
    id: "forest",
    name: "Forest",
    theme: { ...base, preset: "forest", primary: "#16A34A", secondary: "#65A30D", background: "#0F1F14", surface: "#1A2E22", text: "#ECFDF5", textMuted: "#86EFAC" },
  },
  {
    id: "ocean",
    name: "Ocean",
    theme: { ...base, preset: "ocean", primary: "#0EA5E9", secondary: "#06B6D4", background: "#0C1424", surface: "#162033", text: "#E0F2FE", textMuted: "#7DD3FC" },
  },
  {
    id: "neon",
    name: "Neon",
    theme: { ...base, preset: "neon", primary: "#F0FF00", secondary: "#00FFC2", background: "#000000", surface: "#0A0A0A", text: "#FFFFFF", textMuted: "#888888", font: "Geist", shadow: "strong" },
  },
  {
    id: "sunset",
    name: "Sunset",
    theme: { ...base, preset: "sunset", primary: "#F97316", secondary: "#EC4899", background: "#1F0F0A", surface: "#2E1A13", text: "#FFF7ED", textMuted: "#FDBA74", font: "Poppins" },
  },
  {
    id: "glass",
    name: "Glass",
    theme: { ...base, preset: "glass", primary: "#A5B4FC", secondary: "#C4B5FD", background: "#0F172A", surface: "#1E293B", text: "#F1F5F9", textMuted: "#94A3B8" },
  },
  {
    id: "corporate",
    name: "Corporate",
    theme: { ...base, preset: "corporate", primary: "#1E40AF", secondary: "#3B82F6", background: "#FFFFFF", surface: "#F9FAFB", text: "#111827", textMuted: "#6B7280", radius: "sm" },
  },
  {
    id: "vintage",
    name: "Vintage",
    theme: { ...base, preset: "vintage", primary: "#92400E", secondary: "#A16207", background: "#FEF9E7", surface: "#FFFEF5", text: "#292524", textMuted: "#78716C", font: "Manrope" },
  },
  {
    id: "pastel",
    name: "Pastel",
    theme: { ...base, preset: "pastel", primary: "#A78BFA", secondary: "#F0ABFC", background: "#FAF5FF", surface: "#FFFFFF", text: "#3B0764", textMuted: "#7E22CE", font: "Poppins", radius: "xl" },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    theme: { ...base, preset: "monochrome", primary: "#FFFFFF", secondary: "#9CA3AF", background: "#0A0A0A", surface: "#1A1A1A", text: "#FFFFFF", textMuted: "#666666" },
  },
  {
    id: "coffee",
    name: "Coffee",
    theme: { ...base, preset: "coffee", primary: "#C08552", secondary: "#8B5A2B", background: "#2C1810", surface: "#3E2418", text: "#FFF8F0", textMuted: "#C4A484", font: "Manrope" },
  },
  {
    id: "cyber",
    name: "Cyber",
    theme: { ...base, preset: "cyber", primary: "#00F0FF", secondary: "#FF00E5", background: "#0A0014", surface: "#15002E", text: "#F0E5FF", textMuted: "#A080C0", font: "Geist", shadow: "strong" },
  },
  {
    id: "medical",
    name: "Medical",
    theme: { ...base, preset: "medical", primary: "#0891B2", secondary: "#22D3EE", background: "#FFFFFF", surface: "#F0FDFF", text: "#164E63", textMuted: "#64748B" },
  },
  {
    id: "startup",
    name: "Startup",
    theme: { ...base, preset: "startup", primary: "#7C3AED", secondary: "#EC4899", background: "#0F0A1F", surface: "#1A1035", text: "#F5F3FF", textMuted: "#A78BFA", font: "Geist" },
  },
  {
    id: "food",
    name: "Food",
    theme: { ...base, preset: "food", primary: "#DC2626", secondary: "#F59E0B", background: "#FFFBF5", surface: "#FFFFFF", text: "#1F2937", textMuted: "#6B7280", font: "Poppins" },
  },
  {
    id: "nature",
    name: "Nature",
    theme: { ...base, preset: "nature", primary: "#059669", secondary: "#84CC16", background: "#F0FDF4", surface: "#FFFFFF", text: "#14532D", textMuted: "#4D7C0F", font: "Manrope" },
  },
  {
    id: "royal",
    name: "Royal",
    theme: { ...base, preset: "royal", primary: "#6D28D9", secondary: "#7C3AED", background: "#1E1B4B", surface: "#312E81", text: "#EEF2FF", textMuted: "#A5B4FC", font: "Manrope" },
  },
];

export const FONTS = ["Inter", "Poppins", "Roboto", "Manrope", "Geist"];

export const RADIUS_OPTIONS: { value: Theme["radius"]; label: string }[] = [
  { value: "sm", label: "Sharp" },
  { value: "md", label: "Small" },
  { value: "lg", label: "Medium" },
  { value: "xl", label: "Round" },
];

export const SHADOW_OPTIONS: { value: Theme["shadow"]; label: string }[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
];

export const SPACING_OPTIONS: { value: Theme["spacing"]; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "spacious", label: "Spacious" },
];

export function radiusPx(r: Theme["radius"]) {
  return r === "sm" ? "4px" : r === "md" ? "8px" : r === "lg" ? "12px" : "20px";
}

export function shadowCss(s: Theme["shadow"]) {
  return s === "none" ? "none"
    : s === "soft" ? "0 2px 8px rgba(0,0,0,0.08)"
    : s === "medium" ? "0 6px 20px rgba(0,0,0,0.15)"
    : "0 12px 32px rgba(0,0,0,0.25)";
}