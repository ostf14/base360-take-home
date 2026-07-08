"use client";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { createRef, useLayoutEffect, useMemo, useState } from "react";
import { TikTokSurface } from "./surfaces/TikTokSurface";
import { DmSurface } from "./surfaces/DmSurface";
import { CrmSurface } from "./surfaces/CrmSurface";
import { CallSurface } from "./surfaces/CallSurface";
import { EmailSurface } from "./surfaces/EmailSurface";
import { SystemSurface } from "./surfaces/SystemSurface";
import { Anchor, MayaOverlay } from "./MayaOverlay";

interface Props {
  scrollYProgress: MotionValue<number>;
  activeChapter: number;
}

// Six chapters, each occupying an equal 1/6 slice of scrollYProgress.
const TOTAL = 6;
const S = 1 / TOTAL;
// Handoff window at each chapter boundary — the last ~15% of each slot.
// Kept in sync with MayaOverlay#OVERLAY_KEYFRAMES so the avatar's travel
// window matches the surface swap.
const H = 0.15 * S;
// Sequential-opacity handoff: within the H-wide window at each boundary,
// the OUTGOING surface fades to 0 in the FIRST half; only then does the
// INCOMING surface start fading up in the SECOND half. Consequently no
// two surfaces are ever both above ~0 at the same scroll position — no
// double-exposure of two legible screens.
//
// At the exact midpoint of every handoff (t = (i+1)*S - H/2) BOTH the
// outgoing and incoming surfaces are 0. That brief empty moment is
// deliberate — it's covered by (1) the always-mounted MayaOverlay,
// which is exactly mid-flight between anchors at that instant, and
// (2) the stepper acid fill, which keeps advancing. The camera carries
// the lead across the gap; nothing blinks into void.
const HALF_H = H / 2;

interface SurfaceState {
  opacity: number;
}

// Compute the visual state of surface `i` at scroll position `t`.
//
// Life of one surface along the scroll axis:
//   [i*S - H     .. i*S - H/2]     silent — before its fade-in has begun
//   [i*S - H/2   .. i*S]            fade-in 0 → 1 (second half of handoff)
//   [i*S         .. (i+1)*S - H]    full-opacity dwell — owns the frame
//   [(i+1)*S - H .. (i+1)*S - H/2]  fade-out 1 → 0 (first half of handoff)
//   [(i+1)*S - H/2 .. (i+1)*S]      silent — after its fade-out has ended
//
// Chapter 0 skips the fade-in; chapter (TOTAL-1) skips the fade-out.
// CRITICAL: surfaces are never unmounted and never removed from layout —
// only their opacity/visibility changes. That way the MayaOverlay anchor
// measurements (getBoundingClientRect on MayaAnchor) stay valid whether
// or not a surface is currently visible.
function surfaceState(t: number, i: number, total: number): SurfaceState {
  const slotStart = i * S;
  const slotEnd = (i + 1) * S;
  const inStart = slotStart - H;
  const outStart = slotEnd - H;
  const isFirst = i === 0;
  const isLast = i === total - 1;

  // Fully before this surface's fade-in even begins.
  if (!isFirst && t < inStart) return { opacity: 0 };
  // Fully after this surface has left the frame.
  if (!isLast && t >= slotEnd) return { opacity: 0 };

  // Fade-in: only during the SECOND half of the boundary window.
  if (!isFirst && t < slotStart) {
    const halfStart = inStart + HALF_H;
    if (t < halfStart) return { opacity: 0 };
    return { opacity: (t - halfStart) / HALF_H };
  }

  // Fade-out: only during the FIRST half of the boundary window.
  if (!isLast && t >= outStart) {
    const halfEnd = outStart + HALF_H;
    if (t >= halfEnd) return { opacity: 0 };
    return { opacity: 1 - (t - outStart) / HALF_H };
  }

  // Dwell — this surface owns the frame at opacity 1.
  return { opacity: 1 };
}

// 0 → 1 across the VISIBLE life of surface `i`. Used to drive per-surface
// reveal animations (typewriters, ticks, etc.). Anchored to the fade
// midpoints so progress ~ 0 at fade-in start and ~ 1 at fade-out end.
function localProgress(t: number, i: number, total: number): number {
  const lifeStart = i === 0 ? 0 : i * S - HALF_H;
  const lifeEnd = i === total - 1 ? 1 : (i + 1) * S - HALF_H;
  const span = lifeEnd - lifeStart;
  if (span <= 0) return 0;
  return Math.max(0, Math.min(1, (t - lifeStart) / span));
}

// Which chapter is currently DOMINANT on the canvas at scroll `v`.
// Sequential handoff means chapter (i+1) takes over exactly when the
// outgoing surface hits 0 and the incoming starts fading up — i.e.
// at t = (i+1)*S - H/2. Offsetting the raw floor(v * total) by +H/2
// gives that flip point without shifting chapter 0's own entry.
// Exported so Hero.tsx keeps a single source of truth for the
// handoff timing (H) and its Stepper active node / CopyColumn text
// swap stay in sync with the surface actually on screen.
export function activeChapterAt(v: number, total: number = TOTAL): number {
  return Math.min(
    total - 1,
    Math.max(0, Math.floor((v + HALF_H) * total)),
  );
}

// Hand-calibrated fallback anchors as % of canvas. Used when measurement
// hasn't happened yet (first paint) or if a ref is null.
const FALLBACK_PCT: Anchor[] = [
  { x: 12, y: 34 },   // 0 tiktok — Maya's comment row
  { x: 60, y: 15 },   // 1 dm — header contact avatar
  { x: 10, y: 20 },   // 2 crm — record header
  { x: 22, y: 30 },   // 3 call — callee card
  { x: 78, y: 11 },   // 4 email — recipient chip
  { x: 55, y: 74 },   // 5 system — closed node
];

// The right-column stage. Surfaces crossfade on scrollYProgress ranges.
// One always-mounted MayaOverlay sits above the surface stack; its position
// is driven from measured anchor centers plus scrollYProgress. Because the
// overlay never mounts/unmounts, there is no race — it can't disappear.
export function Canvas({ scrollYProgress, activeChapter }: Props) {
  const [t, setT] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setT(v));

  const [canvasBoxRef] = useState(() => createRef<HTMLDivElement>());
  const anchorRefs = useMemo(
    () => Array.from({ length: 6 }, () => createRef<HTMLDivElement>()),
    []
  );

  const [anchors, setAnchors] = useState<(Anchor | null)[]>(() =>
    Array(6).fill(null)
  );
  const [fallback, setFallback] = useState<Anchor[]>(() =>
    // Sensible pre-measurement guess so the overlay doesn't render at 0,0.
    FALLBACK_PCT.map((p) => ({ x: (p.x / 100) * 800, y: (p.y / 100) * 700 }))
  );

  useLayoutEffect(() => {
    const measure = () => {
      const box = canvasBoxRef.current?.getBoundingClientRect();
      if (!box) return;
      const measured: (Anchor | null)[] = anchorRefs.map((ref) => {
        const el = ref.current;
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: b.left + b.width / 2 - box.left,
          y: b.top + b.height / 2 - box.top,
        };
      });
      const nextFallback = FALLBACK_PCT.map((p) => ({
        x: (p.x / 100) * box.width,
        y: (p.y / 100) * box.height,
      }));
      setAnchors(measured);
      setFallback(nextFallback);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [anchorRefs, canvasBoxRef]);

  return (
    <div className="relative h-full flex items-stretch justify-stretch p-6">
      <div
        ref={canvasBoxRef}
        className="relative flex-1 overflow-hidden rounded-2xl"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          boxShadow:
            "inset 0 0 120px rgba(0,0,0,0.6), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        <AmbientGlow activeChapter={activeChapter} />
        <EdgeVignette />

        <SurfaceSlot state={surfaceState(t, 0, TOTAL)}>
          <TikTokSurface
            igniteProgress={localProgress(t, 0, TOTAL)}
            anchorRef={anchorRefs[0]}
          />
        </SurfaceSlot>
        <SurfaceSlot state={surfaceState(t, 1, TOTAL)}>
          <DmSurface
            progress={localProgress(t, 1, TOTAL)}
            anchorRef={anchorRefs[1]}
          />
        </SurfaceSlot>
        <SurfaceSlot state={surfaceState(t, 2, TOTAL)}>
          <CrmSurface
            progress={localProgress(t, 2, TOTAL)}
            anchorRef={anchorRefs[2]}
          />
        </SurfaceSlot>
        <SurfaceSlot state={surfaceState(t, 3, TOTAL)}>
          <CallSurface
            progress={localProgress(t, 3, TOTAL)}
            anchorRef={anchorRefs[3]}
          />
        </SurfaceSlot>
        <SurfaceSlot state={surfaceState(t, 4, TOTAL)}>
          <EmailSurface
            progress={localProgress(t, 4, TOTAL)}
            anchorRef={anchorRefs[4]}
          />
        </SurfaceSlot>
        <SurfaceSlot state={surfaceState(t, 5, TOTAL)}>
          <SystemSurface
            progress={localProgress(t, 5, TOTAL)}
            anchorRef={anchorRefs[5]}
          />
        </SurfaceSlot>

        {/* ONE Maya. Mounted once. Never conditionally rendered. */}
        <MayaOverlay
          scrollYProgress={scrollYProgress}
          anchors={anchors}
          fallback={fallback}
        />

        <CornerChrome activeChapter={activeChapter} />
      </div>
    </div>
  );
}

function SurfaceSlot({
  state,
  children,
}: {
  state: SurfaceState;
  children: React.ReactNode;
}) {
  const hidden = state.opacity <= 0.001;
  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        opacity: state.opacity,
        pointerEvents: state.opacity > 0.5 ? "auto" : "none",
        // Fully-faded surfaces stop drawing. visibility: hidden keeps the
        // element in layout so MayaAnchor's getBoundingClientRect still
        // returns real coords — that's how the overlay knows where to
        // dock on the next chapter's surface even while it's invisible.
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      {children}
    </div>
  );
}

function CornerChrome({ activeChapter }: { activeChapter: number }) {
  const label = [
    "TIKTOK · PUBLIC",
    "TIKTOK · DM",
    "CRM · RECORD",
    "VOICE · OUTBOUND",
    "MARKETING · SEQUENCE",
    "SYSTEM · MAP",
  ][activeChapter];
  return (
    <>
      <div className="pointer-events-none absolute top-4 left-4 z-40 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-lo">
        <span className="w-1.5 h-1.5 bg-acid live-dot" />
        {label}
      </div>
      <div className="pointer-events-none absolute top-4 right-4 z-40 text-[10px] font-mono uppercase tracking-widest text-text-lo">
        base360://maya.r
      </div>
    </>
  );
}

function AmbientGlow({ activeChapter }: { activeChapter: number }) {
  const xs = [12, 60, 10, 22, 78, 55];
  const ys = [34, 15, 20, 30, 11, 74];
  const x = xs[activeChapter] ?? 50;
  const y = ys[activeChapter] ?? 50;
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0"
      animate={{
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(223,255,0,0.11), transparent 55%)`,
      }}
      transition={{ duration: 0.6 }}
    />
  );
}

// Darkens the canvas corners so the eye is pulled toward the center where
// Maya's spotlight lives. Sits ABOVE surfaces (z-10) but BELOW the overlay
// (z-30), so environments recede while Maya stays clear.
function EdgeVignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
      }}
    />
  );
}
