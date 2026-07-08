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
  glitching: boolean;
}

// Six chapters, each occupying an equal 1/6 slice of scrollYProgress.
const TOTAL = 6;
const S = 1 / TOTAL;
// Handoff window: last ~15% of each chapter's slot. Everything else is a
// single-surface DWELL at full opacity — so at any scroll position exactly
// one surface reads as sharp and legible. Kept in sync with
// MayaOverlay#OVERLAY_KEYFRAMES so the avatar's travel window matches the
// surface swap.
const H = 0.15 * S;
// Exit-transform strength. Outgoing surface recedes with a slight scale-down
// and a small blur so its text stops being sharply legible before the
// incoming surface finishes fading in — no double-exposure of two crisp
// screens at once.
const EXIT_SCALE = 0.97;
const EXIT_BLUR_PX = 3;

interface SurfaceState {
  opacity: number;
  scale: number;
  blur: number;
}

// Compute the visual state of surface `i` at scroll position `t`.
//
// Life of one surface along the scroll axis:
//   [i*S - H .. i*S]           fade-in from previous chapter's tail
//   [i*S     .. (i+1)*S - H]   full-opacity dwell (owns the frame)
//   [(i+1)*S - H .. (i+1)*S]   fade-out into the next chapter
//
// Chapter 0 skips the fade-in; chapter (TOTAL-1) skips the fade-out.
// Hidden phases return an identity transform so anchor measurements
// (getBoundingClientRect) are never taken through a scale() — the layout
// stays truthful when the layoutEffect runs on mount.
function surfaceState(t: number, i: number, total: number): SurfaceState {
  const slotStart = i * S;
  const slotEnd = (i + 1) * S;
  const inStart = slotStart - H;
  const outStart = slotEnd - H;
  const isFirst = i === 0;
  const isLast = i === total - 1;

  if (!isFirst && t < inStart) {
    return { opacity: 0, scale: 1, blur: 0 };
  }
  if (!isLast && t >= slotEnd) {
    return { opacity: 0, scale: 1, blur: 0 };
  }
  if (!isFirst && t < slotStart) {
    const u = (t - inStart) / H;
    return {
      opacity: u,
      scale: EXIT_SCALE + (1 - EXIT_SCALE) * u,
      blur: EXIT_BLUR_PX * (1 - u),
    };
  }
  if (!isLast && t >= outStart) {
    const u = (t - outStart) / H;
    return {
      opacity: 1 - u,
      scale: 1 - (1 - EXIT_SCALE) * u,
      blur: EXIT_BLUR_PX * u,
    };
  }
  return { opacity: 1, scale: 1, blur: 0 };
}

// 0 → 1 across the visible lifespan of surface `i` (fade-in + dwell +
// fade-out). Used to drive per-surface reveal animations.
function localProgress(t: number, i: number, total: number): number {
  const lifeStart = i === 0 ? 0 : i * S - H;
  const lifeEnd = i === total - 1 ? 1 : (i + 1) * S;
  const span = lifeEnd - lifeStart;
  if (span <= 0) return 0;
  return Math.max(0, Math.min(1, (t - lifeStart) / span));
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
export function Canvas({ scrollYProgress, activeChapter, glitching }: Props) {
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
          glitching={glitching}
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
  // Skip transform/filter strings during the dwell — dwell has scale=1 and
  // blur=0, and emitting undefined lets React drop the property entirely so
  // no filter stacking context is created and no GPU cost is paid.
  const transform = state.scale === 1 ? undefined : `scale(${state.scale})`;
  const filter =
    state.blur > 0.05 ? `blur(${state.blur.toFixed(2)}px)` : undefined;
  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        opacity: state.opacity,
        transform,
        transformOrigin: "50% 50%",
        filter,
        pointerEvents: state.opacity > 0.5 ? "auto" : "none",
        // Fully-faded surfaces stop drawing. visibility: hidden preserves
        // layout so the layout-effect measurement of MayaAnchor's
        // getBoundingClientRect still returns real coords — and hidden
        // phases return an identity transform above (scale 1) so the
        // measured position isn't shifted by scale().
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
