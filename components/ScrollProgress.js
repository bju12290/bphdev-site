"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const p = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      el.style.transform = `scaleX(${p})`;
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 h-[2px] w-full">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-zinc-200/60"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
