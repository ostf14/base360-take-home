"use client";
import { motion, MotionValue, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { TikTokSurface } from "./surfaces/TikTokSurface";
import { DmSurface } from "./surfaces/DmSurface";
import { CrmSurface } from "./surfaces/CrmSurface";
import { CallSurface } from "./surfaces/CallSurface";
import { EmailSurface } from "./surfaces/EmailSurface";
import { SystemSurface } from "./surfaces/SystemSurface";
import { Puck } from "./Puck";
import { Thread } from "./Thread";

interface Props {
  scrollYProgress: MotionValue<number>;
  activeChapter: number;
  glitching: boolean;
}

// Each chapter has a "dwell" (puck parked, surface at full opacity) followed
// by a "travel" (puck moving to next dock, this surface fading out while the
// next fades in). Times align exactly with PUCK_KEYFRAMES.
interface Range {
  fadeInStart: number;
  plateauStart: number;
  plateauEnd: number;
  fadeOutEnd: number;
}

const S = 1 / 6; // slot size ≈ 0.1667

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

// The right-column stage. Contains the 6 surfaces (behind) whose opacity
// crossfades on scrollYProgress ranges, and the persistent overlay (front):
// ONE thread + ONE puck. Nothing here remounts across chapters.
export function Canvas({ scrollYProgress, activeChapter, glitching }: Props) {
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

        <SurfaceSlot opacity={opacityForRange(t, RANGES[0])}>
          <TikTokSurface
            active={activeChapter === 0}
            igniteProgress={localProgress(t, RANGES[0])}
          />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[1])}>
          <DmSurface progress={localProgress(t, RANGES[1])} />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[2])}>
          <CrmSurface progress={localProgress(t, RANGES[2])} />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[3])}>
          <CallSurface progress={localProgress(t, RANGES[3])} />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[4])}>
          <EmailSurface progress={localProgress(t, RANGES[4])} />
        </SurfaceSlot>
        <SurfaceSlot opacity={opacityForRange(t, RANGES[5])}>
          <SystemSurface progress={localProgress(t, RANGES[5])} />
        </SurfaceSlot>

        {/* Persistent overlay — never remounts */}
        <Thread scrollYProgress={scrollYProgress} />
        <Puck
          scrollYProgress={scrollYProgress}
          activeChapter={activeChapter}
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
  // Plain div. React re-renders on every scroll frame with a fresh opacity
  // value — we don't want Framer's animate lane fighting the style lane.
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
    "INSTAGRAM · DM",
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
      <CornerTicks />
    </>
  );
}

function CornerTicks() {
  const corners = [
    { className: "top-2 left-2", borders: "border-t border-l" },
    { className: "top-2 right-2", borders: "border-t border-r" },
    { className: "bottom-2 left-2", borders: "border-b border-l" },
    { className: "bottom-2 right-2", borders: "border-b border-r" },
  ];
  return (
    <>
      {corners.map((c) => (
        <span
          key={c.className}
          className={`pointer-events-none absolute ${c.className} z-40 w-3 h-3 ${c.borders}`}
          style={{ borderColor: "var(--acid)", opacity: 0.5 }}
        />
      ))}
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
