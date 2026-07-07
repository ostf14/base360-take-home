"use client";
import { LayoutGroup, motion, MotionValue, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { TikTokSurface } from "./surfaces/TikTokSurface";
import { DmSurface } from "./surfaces/DmSurface";
import { CrmSurface } from "./surfaces/CrmSurface";
import { CallSurface } from "./surfaces/CallSurface";
import { EmailSurface } from "./surfaces/EmailSurface";
import { SystemSurface } from "./surfaces/SystemSurface";

interface Props {
  scrollYProgress: MotionValue<number>;
  activeChapter: number;
}

// Each chapter has a "dwell" (surface at full opacity) followed by a "travel"
// (this surface fading out while the next fades in). Chapter i owns the slot
// [i/6, (i+1)/6] of the scroll timeline; peak opacity lives on the first half
// of that slot, crossfade to the next surface fills the second half.
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

// The right-column stage. Surfaces crossfade on scrollYProgress ranges. Each
// active surface renders Maya's identity inside a motion.div layoutId="maya-lead";
// when the active flips, Framer's shared-layout system morphs that element
// from its outgoing position/size to the incoming one — that morph IS the
// through-line of the story. No overlay, no floating chip.
export function Canvas({ scrollYProgress, activeChapter }: Props) {
  const [t, setT] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setT(v));

  return (
    <div className="relative h-full flex items-stretch justify-stretch p-6">
      <div
        className="relative flex-1 overflow-hidden rounded-2xl"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          boxShadow:
            "inset 0 0 120px rgba(0,0,0,0.6), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        <AmbientGlow activeChapter={activeChapter} />

        <LayoutGroup id="maya-lead-group">
          <SurfaceSlot opacity={opacityForRange(t, RANGES[0])}>
            <TikTokSurface
              isActive={activeChapter === 0}
              igniteProgress={localProgress(t, RANGES[0])}
            />
          </SurfaceSlot>
          <SurfaceSlot opacity={opacityForRange(t, RANGES[1])}>
            <DmSurface
              isActive={activeChapter === 1}
              progress={localProgress(t, RANGES[1])}
            />
          </SurfaceSlot>
          <SurfaceSlot opacity={opacityForRange(t, RANGES[2])}>
            <CrmSurface
              isActive={activeChapter === 2}
              progress={localProgress(t, RANGES[2])}
            />
          </SurfaceSlot>
          <SurfaceSlot opacity={opacityForRange(t, RANGES[3])}>
            <CallSurface
              isActive={activeChapter === 3}
              progress={localProgress(t, RANGES[3])}
            />
          </SurfaceSlot>
          <SurfaceSlot opacity={opacityForRange(t, RANGES[4])}>
            <EmailSurface
              isActive={activeChapter === 4}
              progress={localProgress(t, RANGES[4])}
            />
          </SurfaceSlot>
          <SurfaceSlot opacity={opacityForRange(t, RANGES[5])}>
            <SystemSurface
              isActive={activeChapter === 5}
              progress={localProgress(t, RANGES[5])}
            />
          </SurfaceSlot>
        </LayoutGroup>

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
  const visible = opacity > 0.02;
  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        opacity,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
        visibility: visible ? "visible" : "hidden",
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
  const xs = [20, 72, 30, 32, 72, 55];
  const ys = [48, 25, 32, 45, 15, 75];
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
