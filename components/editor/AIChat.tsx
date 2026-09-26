"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, Bot, User, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "pending" | "done" | "error";
  retry?: string;
};

type Props = {
  onApply: (instruction: string) => Promise<{ ok: boolean; error?: string }>;
};

const SUGGESTIONS = [
  "Make the primary color blue",
  "Add a pricing section with 3 tiers",
  "Change hero heading to 'Build Faster'",
  "Add testimonials with 3 quotes",
  "Make it look more modern",
  "Add a stats section with 4 numbers",
  "Add a contact form",
  "Add an FAQ section",
];

export default function AIChat({ onApply }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string, isRetry = false) {
    const instruction = (text || input).trim();
    if (!instruction || loading) return;

    if (!isRetry) {
      const userMsg: Message = {
        id: `u_${Date.now()}`,
        role: "user",
        content: instruction,
      };
      setMessages((m) => [...m, userMsg]);
      setInput("");
    }

    setLoading(true);

    const result = await onApply(instruction);

    setLoading(false);

    if (result.ok) {
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: "Done! Check the canvas.",
        status: "done",
      };
      setMessages((m) => [...m, assistantMsg]);
    } else {
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: result.error || "AI is busy. Please try again.",
        status: "error",
        retry: instruction,
      };
      setMessages((m) => [...m, assistantMsg]);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-bg p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Sparkles size={14} />
                AI Assistant
              </div>
              <p className="mt-1.5 text-xs text-text-muted">
                Tell me what to change. I'll edit your design.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Try asking
              </p>
              <div className="mt-2 space-y-1">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="block w-full rounded-md border border-border bg-bg px-2.5 py-2 text-left text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-2">
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user"
                    ? "bg-accent/10 text-accent"
                    : m.status === "error"
                    ? "bg-critical/10 text-critical"
                    : "bg-success/10 text-success"
                }`}
              >
                {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div
                className={`flex-1 rounded-lg p-2.5 text-xs ${
                  m.role === "user"
                    ? "bg-bg text-text-primary"
                    : m.status === "error"
                    ? "bg-critical/10 text-critical"
                    : "bg-success/10 text-text-primary"
                }`}
              >
                <div>{m.content}</div>
                {m.status === "error" && m.retry && (
                  <button
                    onClick={() => send(m.retry, true)}
                    className="mt-2 flex items-center gap-1 rounded-md border border-critical/30 bg-critical/10 px-2 py-1 text-[10px] font-medium text-critical hover:bg-critical/20"
                  >
                    <RefreshCw size={10} /> Retry
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-2">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
              <Bot size={12} />
            </div>
            <div className="flex-1 rounded-lg bg-success/10 p-2.5 text-xs text-text-muted">
              <Loader2 size={12} className="inline animate-spin" /> Thinking...
              (may take 10-15s)
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask AI to edit..."
            disabled={loading}
            className="flex-1 rounded-lg border border-border bg-bg px-2.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="rounded-lg bg-accent px-3 text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}