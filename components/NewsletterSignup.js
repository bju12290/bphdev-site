"use client";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const succeeded = status === "success";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-700/60 bg-zinc-950/45 p-7 sm:p-8">
      {/* Glow overlays — same treatment as featured card + contact section */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(700px_circle_at_75%_60%,rgba(255,255,255,0.05),transparent_62%)]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Copy */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-200">New notes, occasionally.</p>
          <p className="text-xs text-zinc-500">No noise. Unsubscribe any time.</p>
        </div>

        {/* Form slot */}
        <div className="relative min-h-[2.5rem] sm:min-w-[22rem]">
          <form
            onSubmit={handleSubmit}
            className={`flex gap-2 transition-opacity duration-300 ${
              succeeded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-w-[6rem] rounded-xl border border-zinc-800 bg-zinc-950/55 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-700 transition disabled:opacity-50 whitespace-nowrap"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>

          <div
            className={`absolute inset-0 flex items-center transition-opacity duration-300 ${
              succeeded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-zinc-200">You&apos;re in.</p>
              <p className="text-xs text-zinc-500">Check your inbox to confirm.</p>
            </div>
          </div>

          {status === "error" && (
            <p className="mt-2 text-xs text-red-400">Something went wrong — try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
