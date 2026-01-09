"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function FluidBackdrop({ rgbTopGlow = false, rgbBlobs = false } = {}) {
  const svgRef = useRef(null);
  const circleEls = useRef([]);

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

    const TIME_SCALE = 0.35;
    const HERO_MOTION_BOOST = 0.65;

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

    const calcIntensity = (scrollY) => {
      const progress = Math.min(scrollY / 900, 1);
      const intensity = 1 - progress * 0.85; // 1 -> ~0.15 (same as before)
      return { progress, intensity };
    };

    // EXACT original "darken over scroll" behavior
    const applyOpacity = (scrollY) => {
      const { intensity } = calcIntensity(scrollY);
      svg.style.opacity = String(0.22 * intensity); // <-- back exactly as it was
    };

    const renderCircles = (ms, scrollY) => {
      const t = (ms / 1000) * TIME_SCALE;
      const { progress, intensity } = calcIntensity(scrollY);

      applyOpacity(scrollY);

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
            (s.sy * intensity * motionFactor) * Math.cos(t * (s.sp * 0.9) + s.py) +
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

    let scrollY = window.scrollY || 0;

    let rafScroll = 0;
    const onScroll = () => {
      scrollY = window.scrollY || 0;
      if (rafScroll) return;
      rafScroll = requestAnimationFrame(() => {
        rafScroll = 0;
        // In frozen mode this will just update opacity.
        applyOpacity(scrollY);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Render once so blobs exist even if we freeze (circles start at r=0 otherwise)
    renderCircles(0, scrollY);

    const animate = hasHardwareWebGL();

    let raf = 0;
    let running = false;

    const start = () => {
      if (!animate || running) return;
      //console.log("[FluidBackdrop] start");
      running = true;

      const tick = (ms) => {
        // If the tab becomes hidden between frames, bail.
        if (document.visibilityState !== "visible") {
          stop();
          return;
        }

        renderCircles(ms, scrollY);
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      console.log("[FluidBackdrop] stop");
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        stop();
      } else {
        // Re-render once immediately so it "snaps back" nicely, then resume.
        renderCircles(performance.now(), scrollY);
        start();
      }
    };

    // Always keep opacity correct (even if not animating)
    applyOpacity(scrollY);

    if (animate) {
      // Only start the heavy loop if we’re actually visible.
      if (document.visibilityState === "visible") start();
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      stop();
      if (rafScroll) cancelAnimationFrame(rafScroll);
      window.removeEventListener("scroll", onScroll);
      if (animate) document.removeEventListener("visibilitychange", onVisibilityChange);
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

      {/* edge vignette */}
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

          {/* RGB gradient */}
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
