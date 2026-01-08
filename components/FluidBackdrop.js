"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function hasHardwareWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      c.getContext("webgl", { failIfMajorPerformanceCaveat: true })
    );
  } catch {
    return false;
  }
}

export default function FluidBackdrop({ rgbTopGlow = false, rgbBlobs = false } = {}) {
  const svgRef = useRef(null);
  const circleEls = useRef([]);

  // reset refs on render
  circleEls.current = [];

  const addCircleRef = (el) => {
    if (el) circleEls.current.push(el);
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const circles = circleEls.current;
    const svg = svgRef.current;
    if (!circles.length || !svg) return;

    const W = 1200;
    const H = 800;

    // ---------- TUNING KNOBS ----------
    // Overall animation speed (1 = current, 0.5 = half speed, 0.35 = very slow)
    const TIME_SCALE = 0.35;

    // How much extra motion you get near the top (1 = current boost, lower = calmer hero)
    const HERO_MOTION_BOOST = 0.65;
    // ---------------------------------

    // seed circles (stable positions + phases)
    const seeds = circles.map((_, i) => {
      const x0 = 0.15 + (i / circles.length) * 0.75;
      const y0 = 0.2 + ((i % 3) / 3) * 0.55;
      return {
        x0,
        y0,
        r0: 120 + (i % 4) * 45,
        sx: 0.06 + (i % 3) * 0.02,
        sy: 0.05 + (i % 4) * 0.02,
        sp: 0.35 + i * 0.07,
        px: i * 1.7,
        py: i * 2.3,
      };
    });

    const renderFrame = (ms, scrollY = 0) => {
    const t = (ms / 1000) * TIME_SCALE;

    const progress = Math.min(scrollY / 900, 1);
    const intensity = 1 - progress * 0.85;

    // If we're freezing, we want it a bit more visible than your animated "calm" state
    svg.style.opacity = String(0.16);

    const motionFactor =
      HERO_MOTION_BOOST + (1 - HERO_MOTION_BOOST) * (1 - intensity);

    for (let i = 0; i < circles.length; i++) {
      const s = seeds[i];

      const x =
        W *
        (s.x0 +
          (s.sx * motionFactor) * Math.sin(t * s.sp + s.px) +
          (0.015 * motionFactor) * Math.sin(t * 0.6 + s.px * 0.3));

      const y =
        H *
        (s.y0 +
          (s.sy * intensity * motionFactor) *
            Math.cos(t * (s.sp * 0.9) + s.py) +
          0.10 * progress);

      const r =
        s.r0 *
        (0.85 + 0.15 * Math.sin(t * (s.sp * 1.1) + s.py)) *
        (0.65 + 0.35 * intensity);

      circles[i].setAttribute("cx", x.toFixed(2));
      circles[i].setAttribute("cy", y.toFixed(2));
      circles[i].setAttribute("r", r.toFixed(2));
    }
  };

    // Always render ONE frame so "frozen" mode still shows goo
    renderFrame(0, window.scrollY || 0);

    // Decide whether to animate
    const animate = hasHardwareWebGL();

    if (!animate) {
      // Freeze: no rAF, no scroll listener. Background stays present and static.
      return;
    }

    let scrollY = window.scrollY || 0;
    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const tick = (ms) => {
      renderFrame(ms, scrollY);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="no-view-transition pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black opacity-80" />
      <div
        className={[
            "absolute inset-0",
            rgbTopGlow
            ? "rgb-hue opacity-80 [background:radial-gradient(900px_circle_at_50%_-120px,rgba(255,0,128,0.14)_0%,rgba(0,255,255,0.10)_35%,rgba(34,197,94,0.07)_60%,transparent_72%)]"
            : "[background:radial-gradient(900px_circle_at_50%_-120px,rgba(255,255,255,0.08),transparent_60%)]",
        ].join(" ")}
      />

      {/* edge vignette (used to live only in the hero — move it here so there are no seams) */}
      <div className="absolute inset-0 opacity-80 [background:radial-gradient(1200px_circle_at_50%_35%,transparent_40%,rgba(0,0,0,0.55)_85%)]" />

      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.12 }}
        aria-hidden="true"
      >
        <defs>
          {/* Gooey metaball filter */}
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          {/* extra softness */}
          <filter id="soft">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* RGB gradient (used only when rgbMode is enabled) */}
            <linearGradient id="rgbGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff2d55" stopOpacity="0.9" />
                <stop offset="20%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#22c55e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ff2d55" stopOpacity="0.9" />
            </linearGradient>
        </defs>

        {/* light blob layer */}
        <g className={rgbBlobs ? "rgb-hue" : ""}>
            <g filter="url(#goo)" opacity="1">
                {Array.from({ length: 7 }).map((_, i) => (
                <circle
                    key={`c-${i}`}
                    ref={addCircleRef}
                    cx="0"
                    cy="0"
                    r="0"
                    fill={rgbBlobs ? "rgba(255,0,128,0.9)" : "rgba(255,255,255,0.9)"}
                />
                ))}
            </g>
        </g>

        {/* faint shadow layer for depth */}
        <g filter="url(#soft)" opacity="0.12">
          <ellipse cx="600" cy="720" rx="520" ry="240" fill="black" />
        </g>
      </svg>
    </div>
  );
}
