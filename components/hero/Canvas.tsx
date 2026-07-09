"use client";
import {
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
// INCOMING surface start fading up in the SECOND half. No two surfaces
// are ever both above ~0 at the same scroll position.
const HALF_H = H / 2;

interface SurfaceState {
  opacity: number;
}

function surfaceState(t: number, i: number, total: number): SurfaceState {
  const slotStart = i * S;
  const slotEnd = (i + 1) * S;
  const inStart = slotStart - H;
  const outStart = slotEnd - H;
  const isFirst = i === 0;
  const isLast = i === total - 1;

  if (!isFirst && t < inStart) return { opacity: 0 };
  if (!isLast && t >= slotEnd) return { opacity: 0 };

  if (!isFirst && t < slotStart) {
    const halfStart = inStart + HALF_H;
    if (t < halfStart) return { opacity: 0 };
    return { opacity: (t - halfStart) / HALF_H };
  }

  if (!isLast && t >= outStart) {
    const halfEnd = outStart + HALF_H;
    if (t >= halfEnd) return { opacity: 0 };
    return { opacity: 1 - (t - outStart) / HALF_H };
  }

  return { opacity: 1 };
}

// 0 → 1 across the VISIBLE life of surface `i`. Used to drive per-surface
// reveal animations (typewriters, ticks, etc.).
function localProgress(t: number, i: number, total: number): number {
  const lifeStart = i === 0 ? 0 : i * S - HALF_H;
  const lifeEnd = i === total - 1 ? 1 : (i + 1) * S - HALF_H;
  const span = lifeEnd - lifeStart;
  if (span <= 0) return 0;
  return Math.max(0, Math.min(1, (t - lifeStart) / span));
}

// Sequential handoff means chapter (i+1) takes over exactly when the
// outgoing surface hits 0 and the incoming starts fading up.
export function activeChapterAt(v: number, total: number = TOTAL): number {
  return Math.min(
    total - 1,
    Math.max(0, Math.floor((v + HALF_H) * total)),
  );
}

// Hand-calibrated fallback anchors as % of canvas box (not viewport).
// Used only for the first paint before measurement runs. Once
// useLayoutEffect measures the real MayaAnchor slots the overlay locks
// onto those instead.
const FALLBACK_PCT: Anchor[] = [
  { x: 50, y: 62 },   // 0 tiktok — Maya's comment row on the phone
  { x: 50, y: 32 },   // 1 dm — header contact avatar
  { x: 22, y: 22 },   // 2 crm — record header
  { x: 50, y: 40 },   // 3 call — callee card
  { x: 78, y: 18 },   // 4 email — recipient chip
  { x: 55, y: 74 },   // 5 system — closed node
];

// The centered-surface stage. All six surfaces are absolute-positioned
// inside a max-w container centered on the viewport. Their bottoms melt
// into the page-bg via a fade owned by Hero.tsx (not Canvas), so surfaces
// no longer carry their own chrome frame — they float directly on the
// dark page. Corner labels also live in Hero.tsx now.
export function Canvas({
  scrollYProgress,
  activeChapter,
}: Props) {
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
    FALLBACK_PCT.map((p) => ({ x: (p.x / 100) * 800, y: (p.y / 100) * 700 }))
  );
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const box = canvasBoxRef.current?.getBoundingClientRect();
      if (!box) return;
      const nextAnchors: (Anchor | null)[] = anchorRefs.map((ref) => {
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
      setAnchors(nextAnchors);
      setFallback(nextFallback);
      setMeasured(true);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [anchorRefs, canvasBoxRef, activeChapter]);

  return (
    <div className="relative h-full w-full">
      {/* Centered canvas box — same horizontal center as the hero phone
          so the hero → ch01 slide is pure vertical continuity. Width is
          capped so the wider window surfaces (CRM, Call, Email, System)
          center at viewport-middle instead of filling the entire right
          side. Phone surfaces (PhoneShell = 320 px) center themselves
          within this same box; the phone visually sits at viewport
          center regardless of which surface owns the frame. */}
      <div
        ref={canvasBoxRef}
        className="relative h-full mx-auto"
        style={{ maxWidth: 720, width: "100%" }}
      >
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

        {/* ONE Maya. Mounted once. Never conditionally rendered. Kept
            invisible until `measured` flips so no first-paint teleport. */}
        <MayaOverlay
          scrollYProgress={scrollYProgress}
          anchors={anchors}
          fallback={fallback}
          measured={measured}
        />
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
        // Fully-faded surfaces stop drawing but keep layout so
        // MayaAnchor's getBoundingClientRect still returns real coords.
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      {children}
    </div>
  );
}
