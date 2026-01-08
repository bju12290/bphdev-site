"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Lightbox({
  src,
  alt = "",
  caption,
  className,
  children,
}) {
  const [open, setOpen] = useState(false);

  const overlay = (
    <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onMouseDown={() => setOpen(false)}
        role="dialog"
        aria-modal="true"
    >
        <div
        className="relative max-h-[90vh] max-w-[96vw]"
        onMouseDown={(e) => e.stopPropagation()}
        >
        <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer absolute -top-3 -right-3 rounded-full border border-zinc-700 bg-zinc-950/85 px-3 py-1 text-sm text-zinc-200 shadow-lg hover:bg-zinc-900"
        >
            Close
        </button>

        <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[96vw] rounded-2xl border border-zinc-700 bg-black/75 shadow-2xl"
        />

        {alt ? (
            <p className="mt-3 text-center text-sm text-zinc-200/90">{alt}</p>
        ) : null}
        </div>
    </div>
    );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Open image: ${alt}` : "Open image"}
        className={cx(
          // baseline
          "group relative block w-full cursor-zoom-in text-left",
          className
        )}
      >
        {children}
        {caption ? (
          <span className="mt-2 block text-sm text-zinc-500">{caption}</span>
        ) : null}
      </button>

      {open && typeof document !== "undefined" ? createPortal(overlay, document.body) : null}
    </>
  );
}
