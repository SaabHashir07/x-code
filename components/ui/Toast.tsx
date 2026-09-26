"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Props = {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "text-success border-success/30",
    error: "text-critical border-critical/30",
    info: "text-accent border-accent/30",
  };

  const Icon = icons[type];

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        className={`flex items-center gap-3 rounded-xl border ${colors[type]} bg-surface px-4 py-3 shadow-xl backdrop-blur-md`}
      >
        <Icon size={18} />
        <span className="text-sm font-medium text-text-primary">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded p-0.5 text-text-muted transition-colors hover:text-text-primary"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}