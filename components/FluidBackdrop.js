"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function FluidBackdrop({ rgbTopGlow = false, rgbBlobs = false } = {}) {
  const svgRef = useRef(null);
  const circleEls = useRef([]);
  const gooGroupRef = useRef(null);
  const gooLoFilterRef = useRef(null);

  circleEls.current = [];

  const addCircleRef = (el) => {
    if (el) circleEls.current.push(el);
  };

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();

    gooLoFilterRef.current?.setAttribute("filterRes", "600 400");

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

    // Smooth opacity updates on mobile where rAF can be throttled during scroll
    svg.style.willChange = "opacity";
    svg.style.transition = "opacity 120ms linear";

    const renderCircles = (timeMs, scrollY) => {
      const t = (timeMs / 1000) * TIME_SCALE;
      const { progress, intensity } = calcIntensity(scrollY);

      //applyOpacity(scrollY);

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

    let scrollYTarget = window.scrollY || 0; // raw scroll from events
    let scrollYForCircles = scrollYTarget;   // frozen/smoothed scroll used for blob math

    let forceLowUntil = 0;       // set during scroll
    const onScroll = () => {
      scrollYTarget = window.scrollY || 0;
      forceLowUntil = performance.now() + 250;

      // Update opacity directly from scroll events.
      // On mobile browsers rAF can be throttled during scroll, which makes rAF-based opacity updates look jumpy.
      applyOpacity(scrollYTarget);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Render once so blobs exist even if we freeze (circles start at r=0 otherwise)
    renderCircles(0, scrollYForCircles);

    const animate = 
        !reducedMotion;

    let raf = 0;
    let running = false;

    // --- Quality / FPS controller knobs ---
    const BAD_FPS = 48;          // below this = struggling (tune)
    const BAD_HOLD_MS = 1200;    // must be bad for this long to downgrade
    const PROBE_MS = 1800;       // how long we "try high again"
    const PROBE_COOLDOWN_MS = 10000;

    let quality = "HIGH"; // HIGH | LOW | PROBE
    let targetFps = 60;

    let nextProbeAt = 0;
    let probeEndsAt = 0;

    let lastFrameMs = 0;         // measures real rAF cadence
    let simMs = 0;               // animation time accumulator (prevents time-jumps on mobile scroll)
    let fpsEma = 60;             // smoothed fps

    // Scroll smoothing/catch-up: prevents a big blob jump after mobile scroll pauses rAF.
    let smoothScrollUntil = 0;
    let prevScrollFreeze = false;
    let badSince = 0;

    let lastRenderMs = 0;        // your render throttle

    let currentFilterId = null;
    const setFilter = (id) => {
      if (currentFilterId === id) return;
      currentFilterId = id;
      gooGroupRef.current?.setAttribute("filter", `url(#${id})`);
    };

    const setQuality = (q, nowMs) => {
      if (quality === q) return;
      quality = q;

      // reset "bad" detector so we don’t instantly bounce
      badSince = 0;

      if (q === "HIGH") {
        targetFps = 60;
        setFilter("gooHi");
      } else if (q === "LOW") {
        targetFps = 24;
        setFilter("gooLo");
        nextProbeAt = nowMs + PROBE_COOLDOWN_MS;
      } else if (q === "PROBE") {
        targetFps = 60;
        setFilter("gooHi");
        probeEndsAt = nowMs + PROBE_MS;
      }
    };

    const start = () => {
      if (!animate || running) return;
      running = true;

      // reset timing on start
      lastFrameMs = 0;
      lastRenderMs = 0;
      fpsEma = 60;

      const tick = (ms) => {
        if (document.visibilityState !== "visible") { stop(); return; }

        // --- measure real frame cadence (EMA) ---
        const frameDt = lastFrameMs ? (ms - lastFrameMs) : 16.7;
        lastFrameMs = ms;

        const measuredDt = Math.min(frameDt, 80);
        const fps = 1000 / Math.max(1, measuredDt);
        fpsEma = fpsEma * 0.9 + fps * 0.1;

        // iOS Safari (and some mobile browsers) can pause/throttle rAF during scroll.
        // Drive motion from a clamped accumulator so time never jumps.
        const clampedDt = Math.min(frameDt, 50); // cap a single step (~20fps)

        // If rAF was paused (common during mobile scroll), ease to the new scroll target instead of snapping.
        const scrollDelta = Math.abs(scrollYTarget - scrollYForCircles);
        if (frameDt > 150 && scrollDelta > 40) {
          smoothScrollUntil = ms + 1000;
        }

        // --- scrolling behavior ---
        const scrolling = ms < forceLowUntil;

        // Only pause blob motion during scroll when performance is degrading.
        // This preserves the "nice" scrolling animation on fast devices.
        const SCROLL_FREEZE_FPS = 5;
        const scrollDegrading = scrolling && (quality === "LOW" || fpsEma < SCROLL_FREEZE_FPS);
        const scrollFreeze = scrollDegrading;

        // When we stop freezing, ease the blobs toward the new scroll position instead of snapping.
        if (prevScrollFreeze && !scrollFreeze) {
          smoothScrollUntil = ms + 450;
        }
        prevScrollFreeze = scrollFreeze;

        // During freeze we keep scrollYForCircles fixed.
        // After freeze (or after rAF was throttled), we catch up smoothly *without ever snapping*.
        // This prevents the "delayed jump" you noticed (especially on scroll-up where intensity increases and jumps are obvious).
        if (!scrollFreeze) {
          const deltaY = scrollYTarget - scrollYForCircles;
          const absDeltaY = Math.abs(deltaY);

          if (absDeltaY < 0.5) {
            scrollYForCircles = scrollYTarget;
          } else {
            // Time-based smoothing so behavior is consistent across frame rates.
            // Use a slightly slower time constant during the catch-up window.
            const tau = ms < smoothScrollUntil ? 220 : 140; // ms
            const alpha = 1 - Math.exp(-clampedDt / tau);

            // Cap per-tick catch-up to avoid visible "teleport" steps on low FPS devices.
            const maxStep = ms < smoothScrollUntil ? 60 : 120; // px
            const step = Math.sign(deltaY) * Math.min(absDeltaY * alpha, maxStep);
            scrollYForCircles += step;
          }
        }

        if (!scrollFreeze) {
          simMs += clampedDt;
        }

        const effectiveTargetFps = scrollDegrading ? Math.min(targetFps, 24) : targetFps;

        // Only switch to the cheap filter while scrolling if we’re degrading; otherwise keep the nice one.
        setFilter((quality === "LOW" || scrollDegrading) ? "gooLo" : "gooHi");
        // --- downgrade logic (only meaningful when trying HIGH-ish) ---
        const inHighMode = (quality === "HIGH" || quality === "PROBE");
        if (inHighMode) {
          if (fpsEma < BAD_FPS) {
            badSince = badSince || ms;
          } else {
            badSince = 0;
          }

          if (badSince && (ms - badSince) > BAD_HOLD_MS) {
            setQuality("LOW", ms);
          }
        }

        // --- probe logic: occasionally test if we can go back to HIGH ---
        if (quality === "LOW" && ms > nextProbeAt && ms > forceLowUntil + 400) {
          setQuality("PROBE", ms);
        }

        // --- if probe ends and we didn’t trigger downgrade, promote to HIGH ---
        if (quality === "PROBE" && ms > probeEndsAt) {
          setQuality("HIGH", ms);
        }

        // --- render throttle ---
        // If we decided to freeze during scroll (degrading), do *not* push circle updates.
        // Keeping the blobs static avoids the "jumping spheres" look on weak devices.
        if (!scrollFreeze) {
          const minDt = 1000 / effectiveTargetFps;
          if (!lastRenderMs || (ms - lastRenderMs) >= minDt) {
            lastRenderMs = ms;
            renderCircles(simMs, scrollYForCircles);
          }
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      // console.log("[FluidBackdrop] stop");
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        stop();
      } else {
        // Re-render once immediately so it "snaps back" nicely, then resume.
        renderCircles(simMs, scrollYForCircles);
        start();
      }
    };

    // Always keep opacity correct (even if not animating)
    applyOpacity(scrollYTarget);

    if (animate) {
      // Only start the heavy loop if we’re actually visible.
      if (document.visibilityState === "visible") start();
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      stop();      window.removeEventListener("scroll", onScroll);
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
          {/* Gooey metaball filters */}
          <filter id="gooHi">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
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

          <filter ref={gooLoFilterRef} id="gooLo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
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
            <g ref={gooGroupRef} filter="url(#gooHi)" opacity="1">
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
