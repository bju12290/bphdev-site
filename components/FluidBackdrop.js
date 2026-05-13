"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function supportsHardwareGoo() {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  const attributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  };

  try {
    const gl =
      canvas.getContext("webgl", attributes) ||
      canvas.getContext("experimental-webgl", attributes);

    if (!gl) return false;

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function pickBackdropMode() {
  if (prefersReducedMotion()) return "static";
  return supportsHardwareGoo() ? "goo" : "fallback";
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

const FALLBACK_TEMPLATES = [
  { x: [18, 34], y: [18, 34], size: [700, 920], driftX: [18, 28], driftY: [12, 22], speed: [0.08, 0.12] },
  { x: [64, 82], y: [20, 38], size: [680, 900], driftX: [16, 26], driftY: [12, 24], speed: [0.08, 0.11] },
  { x: [44, 58], y: [54, 68], size: [920, 1140], driftX: [14, 22], driftY: [10, 18], speed: [0.07, 0.10] },
  { x: [24, 42], y: [64, 82], size: [620, 820], driftX: [14, 24], driftY: [10, 18], speed: [0.08, 0.11] },
  { x: [60, 80], y: [56, 78], size: [560, 760], driftX: [12, 20], driftY: [8, 16], speed: [0.09, 0.12] },
];

const DEFAULT_FALLBACK_BLOBS = [
  { x: 26, y: 28, size: 810, driftX: 22, driftY: 16, speed: 0.10, phase: 0.5 },
  { x: 72, y: 30, size: 780, driftX: 20, driftY: 18, speed: 0.09, phase: 1.8 },
  { x: 51, y: 60, size: 1030, driftX: 17, driftY: 13, speed: 0.08, phase: 2.9 },
  { x: 33, y: 73, size: 710, driftX: 18, driftY: 12, speed: 0.10, phase: 4.0 },
];

function createFallbackBlobs() {
  const templates = [...FALLBACK_TEMPLATES];
  const count = Math.random() > 0.45 ? 5 : 4;

  return templates
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((template, i) => ({
      x: randomBetween(...template.x),
      y: randomBetween(...template.y),
      size: randomBetween(...template.size),
      driftX: randomBetween(...template.driftX),
      driftY: randomBetween(...template.driftY),
      speed: randomBetween(...template.speed),
      phase: randomBetween(0, Math.PI * 2) + i * 0.35,
    }));
}

function getBlobGradient(rgbBlobs) {
  if (!rgbBlobs) {
    return "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.11) 18%, rgba(255,255,255,0.07) 36%, rgba(255,255,255,0.035) 56%, rgba(255,255,255,0.014) 72%, rgba(255,255,255,0.004) 84%, transparent 96%)";
  }

  return "radial-gradient(circle at 50% 50%, hsl(var(--fallback-hue) 100% 58% / 0.18) 0%, hsl(var(--fallback-hue) 100% 58% / 0.14) 18%, hsl(var(--fallback-hue) 100% 58% / 0.10) 36%, hsl(var(--fallback-hue) 100% 58% / 0.055) 56%, hsl(var(--fallback-hue) 100% 58% / 0.022) 72%, hsl(var(--fallback-hue) 100% 58% / 0.006) 84%, transparent 96%)";
}

const GOO_CIRCLE_COUNT = 7;

export default function FluidBackdrop({ rgbTopGlow = false, rgbBlobs = false } = {}) {
  const [mode, setMode] = useState("fallback");
  const [fallbackSeeds, setFallbackSeeds] = useState(DEFAULT_FALLBACK_BLOBS);

  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const circleEls = useRef([]);
  const gooGroupRef = useRef(null);
  const gooHiFilterRef = useRef(null);
  const gooLoFilterRef = useRef(null);

  const fallbackLayerRef = useRef(null);
  const fallbackBlobEls = useRef([]);

  useEffect(() => {
    setMode(pickBackdropMode());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.backdropMode = mode;

    return () => {
      delete document.documentElement.dataset.backdropMode;
    };
  }, [mode]);

  useEffect(() => {
    setFallbackSeeds(createFallbackBlobs());
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const circles = circleEls.current.slice(0, GOO_CIRCLE_COUNT);
    const fallbackLayer = fallbackLayerRef.current;
    const fallbackBlobs = fallbackBlobEls.current.slice(0, fallbackSeeds.length);

    const isGoo = mode === "goo";
    const isStatic = mode === "static";

    if (isGoo && (!svg || !circles.some(Boolean))) return;
    if (!isGoo && (!fallbackLayer || !fallbackBlobs.some(Boolean))) return;

    const backdropNode = isGoo ? svg : fallbackLayer;
    const W = 1200;
    const H = 800;

    const calcIntensity = (scrollY) => {
      const progress = Math.min(scrollY / 900, 1);
      const intensity = 1 - progress * 0.85;
      return { progress, intensity };
    };

    const baseOpacity = isGoo ? 0.22 : isStatic ? 0.18 : 0.34;
    const applyOpacity = (scrollY) => {
      const { intensity } = calcIntensity(scrollY);
      backdropNode.style.opacity = String(baseOpacity * intensity);
    };

    backdropNode.style.willChange = "opacity";
    backdropNode.style.transition = "opacity 120ms linear";

    let scrollYTarget = window.scrollY || 0;
    let scrollYForMotion = scrollYTarget;

    const onScroll = () => {
      scrollYTarget = window.scrollY || 0;
      applyOpacity(scrollYTarget);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    applyOpacity(scrollYTarget);

    if (root) {
      root.style.setProperty("--fallback-hue", "345deg");
    }

    if (isGoo) {
      const TIME_SCALE = 0.35;
      const HERO_MOTION_BOOST = 0.65;

      const updateFilterRes = () => {
        const viewportWidth = Math.min(window.innerWidth || W, 1600);
        const viewportHeight = Math.min(window.innerHeight || H, 1200);
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        const hiWidth = Math.max(360, Math.round(viewportWidth * 0.55 * dpr));
        const hiHeight = Math.max(240, Math.round(viewportHeight * 0.55 * dpr));
        const loWidth = Math.max(240, Math.round(viewportWidth * 0.36 * dpr));
        const loHeight = Math.max(180, Math.round(viewportHeight * 0.36 * dpr));

        gooHiFilterRef.current?.setAttribute("filterRes", `${hiWidth} ${hiHeight}`);
        gooLoFilterRef.current?.setAttribute("filterRes", `${loWidth} ${loHeight}`);
      };

      updateFilterRes();
      window.addEventListener("resize", updateFilterRes);

      const seeds = Array.from({ length: GOO_CIRCLE_COUNT }, (_, i) => {
        const x0 = 0.15 + (i / GOO_CIRCLE_COUNT) * 0.75;
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

      const renderCircles = (timeMs, scrollY) => {
        const t = (timeMs / 1000) * TIME_SCALE;
        const { progress, intensity } = calcIntensity(scrollY);

        const motionFactor =
          HERO_MOTION_BOOST + (1 - HERO_MOTION_BOOST) * (1 - intensity);

        for (let i = 0; i < seeds.length; i += 1) {
          const circle = circles[i];
          const s = seeds[i];
          if (!circle) continue;

          const x =
            W *
            (s.x0 +
              s.sx * motionFactor * Math.sin(t * s.sp + s.px) +
              0.015 * motionFactor * Math.sin(t * 0.6 + s.px * 0.3));

          const y =
            H *
            (s.y0 +
              s.sy * intensity * motionFactor * Math.cos(t * (s.sp * 0.9) + s.py) +
              0.1 * progress);

          const r =
            s.r0 *
            (0.85 + 0.15 * Math.sin(t * (s.sp * 1.1) + s.py)) *
            (0.65 + 0.35 * intensity);

          circle.setAttribute("cx", x.toFixed(1));
          circle.setAttribute("cy", y.toFixed(1));
          circle.setAttribute("r", r.toFixed(1));
        }
      };

      let forceLowUntil = 0;
      const onGooScroll = () => {
        scrollYTarget = window.scrollY || 0;
        forceLowUntil = performance.now() + 250;
        applyOpacity(scrollYTarget);
      };

      window.removeEventListener("scroll", onScroll);
      window.addEventListener("scroll", onGooScroll, { passive: true });

      renderCircles(0, scrollYForMotion);

      let raf = 0;
      let running = false;

      const BAD_FPS = 48;
      const BAD_HOLD_MS = 1200;
      const PROBE_MS = 1800;
      const PROBE_COOLDOWN_MS = 10000;
      const SCROLL_FREEZE_FPS = 26;

      let quality = "HIGH";
      let targetFps = 60;

      let nextProbeAt = 0;
      let probeEndsAt = 0;

      let lastFrameMs = 0;
      let simMs = 0;
      let fpsEma = 60;

      let smoothScrollUntil = 0;
      let prevScrollFreeze = false;
      let badSince = 0;
      let lastRenderMs = 0;

      let currentFilterId = null;
      const setFilter = (id) => {
        if (currentFilterId === id) return;
        currentFilterId = id;
        gooGroupRef.current?.setAttribute("filter", `url(#${id})`);
      };

      const setQuality = (q, nowMs) => {
        if (quality === q) return;
        quality = q;
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

      const stop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      const tick = (ms) => {
        if (document.visibilityState !== "visible") {
          stop();
          return;
        }

        const frameDt = lastFrameMs ? ms - lastFrameMs : 16.7;
        lastFrameMs = ms;

        const measuredDt = Math.min(frameDt, 80);
        const fps = 1000 / Math.max(1, measuredDt);
        fpsEma = fpsEma * 0.9 + fps * 0.1;

        const clampedDt = Math.min(frameDt, 50);
        const scrollDelta = Math.abs(scrollYTarget - scrollYForMotion);
        if (frameDt > 150 && scrollDelta > 40) {
          smoothScrollUntil = ms + 1000;
        }

        const scrolling = ms < forceLowUntil;
        const scrollDegrading = scrolling && (quality === "LOW" || fpsEma < SCROLL_FREEZE_FPS);
        const scrollFreeze = scrollDegrading;

        if (prevScrollFreeze && !scrollFreeze) {
          smoothScrollUntil = ms + 450;
        }
        prevScrollFreeze = scrollFreeze;

        if (!scrollFreeze) {
          const deltaY = scrollYTarget - scrollYForMotion;
          const absDeltaY = Math.abs(deltaY);

          if (absDeltaY < 0.5) {
            scrollYForMotion = scrollYTarget;
          } else {
            const tau = ms < smoothScrollUntil ? 220 : 140;
            const alpha = 1 - Math.exp(-clampedDt / tau);
            const maxStep = ms < smoothScrollUntil ? 60 : 120;
            const step = Math.sign(deltaY) * Math.min(absDeltaY * alpha, maxStep);
            scrollYForMotion += step;
          }
        }

        if (!scrollFreeze) {
          simMs += clampedDt;
        }

        const effectiveTargetFps = scrollDegrading ? Math.min(targetFps, 24) : targetFps;
        setFilter(quality === "LOW" || scrollDegrading ? "gooLo" : "gooHi");

        if (quality === "HIGH" || quality === "PROBE") {
          if (fpsEma < BAD_FPS) {
            badSince = badSince || ms;
          } else {
            badSince = 0;
          }

          if (badSince && ms - badSince > BAD_HOLD_MS) {
            setQuality("LOW", ms);
          }
        }

        if (quality === "LOW" && ms > nextProbeAt && ms > forceLowUntil + 400) {
          setQuality("PROBE", ms);
        }

        if (quality === "PROBE" && ms > probeEndsAt) {
          setQuality("HIGH", ms);
        }

        if (!scrollFreeze) {
          const minDt = 1000 / effectiveTargetFps;
          if (!lastRenderMs || ms - lastRenderMs >= minDt) {
            lastRenderMs = ms;
            renderCircles(simMs, scrollYForMotion);
          }
        }

        raf = requestAnimationFrame(tick);
      };

      const start = () => {
        if (running) return;
        running = true;
        lastFrameMs = 0;
        lastRenderMs = 0;
        fpsEma = 60;
        raf = requestAnimationFrame(tick);
      };

      const onVisibilityChange = () => {
        if (document.visibilityState !== "visible") {
          stop();
        } else {
          renderCircles(simMs, scrollYForMotion);
          start();
        }
      };

      if (document.visibilityState === "visible") start();
      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        stop();
        window.removeEventListener("resize", updateFilterRes);
        window.removeEventListener("scroll", onGooScroll);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    const renderFallback = (timeMs, scrollY) => {
      const t = timeMs / 1000;
      const { progress, intensity } = calcIntensity(scrollY);

      if (rgbBlobs && root) {
        const hue = (345 + timeMs * 0.012) % 360;
        root.style.setProperty("--fallback-hue", `${hue.toFixed(1)}deg`);
      }

      for (let i = 0; i < fallbackSeeds.length; i += 1) {
        const blob = fallbackBlobs[i];
        const seed = fallbackSeeds[i];
        if (!blob) continue;

        const dx =
          seed.driftX * Math.sin(t * seed.speed + seed.phase) +
          seed.driftX * 0.35 * Math.sin(t * seed.speed * 0.6 + seed.phase * 1.7);
        const dy =
          seed.driftY * Math.cos(t * seed.speed * 0.92 + seed.phase) +
          seed.driftY * 0.28 * Math.sin(t * seed.speed * 0.48 + seed.phase * 1.2) +
          progress * 22;
        const scale =
          1 +
          intensity * 0.08 +
          0.025 * Math.sin(t * seed.speed * 1.1 + seed.phase * 0.8);

        blob.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      }
    };

    renderFallback(0, scrollYForMotion);

    if (isStatic) {
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }

    let raf = 0;
    let running = false;
    let lastFrameMs = 0;
    let lastRenderMs = 0;
    let simMs = 0;

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const tick = (ms) => {
      if (document.visibilityState !== "visible") {
        stop();
        return;
      }

      const frameDt = lastFrameMs ? ms - lastFrameMs : 16.7;
      lastFrameMs = ms;

      const clampedDt = Math.min(frameDt, 40);
      const deltaY = scrollYTarget - scrollYForMotion;
      if (Math.abs(deltaY) < 0.5) {
        scrollYForMotion = scrollYTarget;
      } else {
        const alpha = 1 - Math.exp(-clampedDt / 170);
        scrollYForMotion += deltaY * alpha;
      }

      simMs += clampedDt;

      if (!lastRenderMs || ms - lastRenderMs >= 1000 / 30) {
        lastRenderMs = ms;
        renderFallback(simMs, scrollYForMotion);
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastFrameMs = 0;
      lastRenderMs = 0;
      raf = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        stop();
      } else {
        renderFallback(simMs, scrollYForMotion);
        start();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fallbackSeeds, mode, rgbBlobs]);

  const animateRgbHue = mode === "goo";
  const showSvg = mode === "goo";
  const showFallback = mode !== "goo";

  return (
    <div
      ref={rootRef}
      className="no-view-transition pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ "--fallback-hue": "345deg" }}
    >
      <div
        className={
          showFallback
            ? "absolute inset-0 [background:linear-gradient(to_bottom,rgba(9,9,11,0.44)_0%,rgba(9,9,11,0.50)_18%,rgba(9,9,11,0.64)_42%,rgba(0,0,0,0.82)_100%)]"
            : "absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black opacity-80"
        }
      />

      <div
        className={[
          "absolute inset-0",
          rgbTopGlow && animateRgbHue
            ? "rgb-hue opacity-80 [background:radial-gradient(900px_circle_at_50%_-120px,rgba(255,0,128,0.14)_0%,rgba(0,255,255,0.10)_35%,rgba(34,197,94,0.07)_60%,transparent_72%)]"
            : rgbTopGlow
              ? rgbBlobs
                ? "opacity-90 [background:radial-gradient(340px_180px_at_50%_-42px,hsl(var(--fallback-hue)_100%_58%_/_0.20)_0%,hsl(var(--fallback-hue)_100%_58%_/_0.14)_34%,hsl(var(--fallback-hue)_100%_58%_/_0.08)_58%,transparent_76%)]"
                : "opacity-90 [background:radial-gradient(340px_180px_at_50%_-42px,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.10)_34%,rgba(255,255,255,0.05)_58%,transparent_76%)]"
              : showFallback
                ? "[background:radial-gradient(320px_170px_at_50%_-40px,rgba(255,255,255,0.08),transparent_64%)]"
                : "[background:radial-gradient(900px_circle_at_50%_-120px,rgba(255,255,255,0.08),transparent_60%)]",
        ].join(" ")}
      />

      <div className="absolute inset-0 opacity-80 [background:radial-gradient(1200px_circle_at_50%_35%,transparent_40%,rgba(0,0,0,0.55)_85%)]" />

      {showFallback ? (
        <div ref={fallbackLayerRef} className="absolute inset-0" style={{ opacity: 0.30 }}>
          {fallbackSeeds.map((blob, i) => (
            <div
              key={`fb-${i}`}
              ref={(el) => {
                fallbackBlobEls.current[i] = el;
              }}
              className="absolute rounded-full"
              style={{
                left: `${blob.x}%`,
                top: `${blob.y}%`,
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                marginLeft: `${-blob.size / 2}px`,
                marginTop: `${-blob.size / 2}px`,
                background: getBlobGradient(rgbBlobs),
                willChange: mode === "fallback" ? "transform" : "opacity",
                transform: "translate3d(0, 0, 0)",
                opacity: 0.86,
              }}
            />
          ))}
        </div>
      ) : null}

      {showSvg ? (
        <div
          className={[
            "absolute inset-0",
            rgbBlobs && animateRgbHue ? "rgb-hue [will-change:filter]" : "",
          ].join(" ")}
        >
          <svg
            ref={svgRef}
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.12 }}
            aria-hidden="true"
          >
            <defs>
              <filter
                ref={gooHiFilterRef}
                id="gooHi"
                x="-14%"
                y="-14%"
                width="128%"
                height="128%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
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

              <filter
                ref={gooLoFilterRef}
                id="gooLo"
                x="-12%"
                y="-12%"
                width="124%"
                height="124%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
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

              <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            <g>
              <g ref={gooGroupRef} filter="url(#gooHi)" opacity="1">
                {Array.from({ length: GOO_CIRCLE_COUNT }).map((_, i) => (
                  <circle
                    key={`c-${i}`}
                    ref={(el) => {
                      circleEls.current[i] = el;
                    }}
                    cx="0"
                    cy="0"
                    r="0"
                    fill={rgbBlobs ? "rgba(255,0,128,0.9)" : "rgba(255,255,255,0.9)"}
                  />
                ))}
              </g>
            </g>

            <g filter="url(#soft)" opacity="0.12">
              <ellipse cx="600" cy="720" rx="520" ry="240" fill="black" />
            </g>
          </svg>
        </div>
      ) : null}
    </div>
  );
}
