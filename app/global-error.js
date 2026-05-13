"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-zinc-100">
        <main className="mx-auto w-full max-w-3xl px-6 py-16">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/35 p-8">
            <div className="text-sm text-zinc-400">Global error</div>
            <h1 className="mt-2 text-2xl font-semibold">
              The app crashed hard
            </h1>
            <p className="mt-2 text-zinc-300">
              Something failed at the top level. Refresh or retry.
            </p>

            <div className="mt-6">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition border border-zinc-800 bg-zinc-950/55 text-zinc-200 hover:border-zinc-700"
              >
                Try again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
