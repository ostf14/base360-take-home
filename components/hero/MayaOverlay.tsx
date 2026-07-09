"use client";
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import { MayaAvatar } from "./MayaAvatar";

// The overlay is a SINGLE, always-mounted element. Because it never mounts
// or unmounts across chapter changes, it can never disappear mid-transition —
// which was the failure mode of the shared-layout approach. Its position is a
// pure function of scrollYProgress, interpolated across measured anchor centers.

// Dwell/travel cadence. Each chapter (i) gets a slot [i/6, (i+1)/6].
// Maya DWELLS on anchor i for the first ~85% of the slot, then TRAVELS to
// anchor (i+1) during the last ~15%. That short travel window is aligned
// with the surface-handoff window in Canvas.tsx (const H there), so the
// avatar arrives on the incoming surface at the exact moment it becomes
// fully visible — no floating over an empty chapter, and the swap and the
// dock happen together.
const S = 1 / 6;
const H = 0.15 * S;
export const OVERLAY_KEYFRAMES = [
  0.0,        1 * S - H,
  1 * S,      2 * S - H,
  2 * S,      3 * S - H,
  3 * S,      4 * S - H,
  4 * S,      5 * S - H,
  5 * S,      1.0,
];

// One consistent size across surfaces. Anchor slots are 40×40 to match.
const AVATAR_SIZE = 40;

export interface Anchor {
  x: number;
  y: number;
}

interface Props {
  scrollYProgress: MotionValue<number>;
  anchors: (Anchor | null)[];
  fallback: Anchor[];
  // Flips to true after the first useLayoutEffect measurement pass in
  // Canvas has read every anchor's real getBoundingClientRect. Until
  // then the overlay stays fully transparent — it must never paint at
  // the (0,0) / server-HTML fallback pose and then teleport to its
  // measured spot when hydration kicks in.
  measured: boolean;
}

export function MayaOverlay({
  scrollYProgress,
  anchors,
  fallback,
  measured,
}: Props) {
  // Resolve: prefer measured anchors, fall back to hand-calibrated positions
  // (px in canvas coords). Always yields exactly 6 non-null positions.
  const resolved = anchors.map((a, i) => a ?? fallback[i]);

  // Duplicate each position to match the dwell/travel keyframe cadence
  // (12 keyframes for 6 anchors: [a0, a0, a1, a1, ..., a5, a5]).
  const xValues = resolved.flatMap((p) => [p.x, p.x]);
  const yValues = resolved.flatMap((p) => [p.y, p.y]);

  const xTrans = useTransform(scrollYProgress, OVERLAY_KEYFRAMES, xValues);
  const yTrans = useTransform(scrollYProgress, OVERLAY_KEYFRAMES, yValues);

  const left = useMotionTemplate`${xTrans}px`;
  const top = useMotionTemplate`${yTrans}px`;

  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      style={{ left, top }}
      initial={{ opacity: 0 }}
      animate={{ opacity: measured ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-hidden
    >
      {/* Second wrapper hosts the -50% centering so the outer motion.div's
          left/top drive the CENTER of the avatar, not its top-left corner. */}
      <div style={{ transform: "translate(-50%, -50%)" }}>
        <div className="relative">
          {/* Tight acid ring hugging the avatar + compact glow. Blur radius
              matches the avatar (~40px), NOT 2-3× it — the glow used to
              wash over adjacent text; this stays inside a ~80px footprint. */}
          <div
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -3,
              border: "1px solid rgba(223,255,0,0.85)",
              boxShadow:
                "0 0 12px rgba(223,255,0,0.45), 0 0 40px rgba(223,255,0,0.18)",
            }}
          />
          <MayaAvatar size={AVATAR_SIZE} />
        </div>
      </div>
    </motion.div>
  );
}

// Anchor slot component — surfaces embed this to mark where Maya belongs.
// Invisible; reserves 40×40 space so the overlay lands on the right spot.
export function MayaAnchor({
  anchorRef,
  className,
}: {
  anchorRef: React.RefObject<HTMLDivElement>;
  className?: string;
}) {
  return (
    <div
      ref={anchorRef}
      aria-hidden
      className={`shrink-0 ${className ?? ""}`}
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    />
  );
}
