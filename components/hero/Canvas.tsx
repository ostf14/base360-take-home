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

interface Range {
  fadeInStart: number;
  plateauStart: number;
  plateauEnd: number;
  fadeOutEnd: number;
}

const S = 1 / 6;

const RANGES: Range[] = [
  { fadeInStart: 0.0,        plateauStart: 0.0,        plateauEnd: 0 * S + 0.083, fadeOutEnd: 1 * S },
  { fadeInStart: 0 * S + 0.083, plateauStart: 1 * S,    plateauEnd: 1 * S + 0.083, fadeOutEnd: 2 * S },
  { fadeInStart: 1 * S + 0.083, plateauStart: 2 * S,    plateauEnd: 2 * S + 0.083, fadeOutEnd: 3 * S },
  { fadeInStart: 2 * S + 0.083, plateauStart: 3 * S,    plateauEnd: 3 * S + 0.083, fadeOutEnd: 4 * S },
  { fadeInStart: 3 * S + 0.083, plateauStart: 4 * S,    plateauEnd: 4 * S + 0.083, fadeOutEnd: 5 * S },
  { fadeInStart: 4 * S + 0.083, plateauStart: 5 * S,    plateauEnd: 1.0,           fadeOutEnd: 1.01 },
];

function opacityForRange(t: number, r: Range) {
  if (t <= r.fadeInStart) return t < r.fadeInStart ? 0 : 1;
  if (t < r.plateauStart) {
    const span = r.plateauStart - r.fadeInStart;
    return span <= 0 ? 1 : (t - r.fadeInStart) / span;
  }
  if (t <= r.plateauEnd) return 1;
  if (t < r.fadeOutEnd) {
    const span = r.fadeOutEnd - r.plateauEnd;
    return span <= 0 ? 0 : 1 - (t - r.plateauEnd) / span;
  }
  return 0;
}

function localProgress(t: number, r: Range) {
  const span = r.fadeOutEnd - r.fadeInStart;
  return Math.min(1, Math.max(0, (t - r.fadeInStart) / span));
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

        <SurfaceSlot opacity={opacityForRange(t, RANGES[0])}>
          <TikTokSurface
            igniteProgress={localProgress(t, RANGES[0])}
            anchorRef={anchorRefs[0]}
          />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[1])}>
          <DmSurface
            progress={localProgress(t, RANGES[1])}
            anchorRef={anchorRefs[1]}
          />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[2])}>
          <CrmSurface
            progress={localProgress(t, RANGES[2])}
            anchorRef={anchorRefs[2]}
          />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[3])}>
          <CallSurface
            progress={localProgress(t, RANGES[3])}
            anchorRef={anchorRefs[3]}
          />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[4])}>
          <EmailSurface
            progress={localProgress(t, RANGES[4])}
            anchorRef={anchorRefs[4]}
          />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[5])}>
          <SystemSurface
            progress={localProgress(t, RANGES[5])}
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
  opacity,
  children,
}: {
  opacity: number;
  children: React.ReactNode;
}) {
  // NOTE: no `visibility: hidden` here anymore — anchors must stay measurable
  // even while their surface is invisible. `opacity: 0` still keeps layout,
  // which is all we need for getBoundingClientRect to return real coords.
  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        opacity,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
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
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(223,255,0,0.09), transparent 55%)`,
      }}
      transition={{ duration: 0.6 }}
    />
  );
}
