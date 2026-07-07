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

// Dwell/travel cadence — same shape the puck used to have.
// Each chapter (i) gets a slot [i/6, (i+1)/6]. First half of the slot is a
// dwell (Maya sits on the current anchor); second half is a travel (Maya
// interpolates to the next anchor). Repeating each anchor twice at the slot's
// boundaries is what encodes the dwell.
export const OVERLAY_KEYFRAMES = [
  0.0, 0.083,
  0.166, 0.25,
  0.333, 0.416,
  0.5, 0.583,
  0.666, 0.75,
  0.833, 1.0,
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
  glitching: boolean;
}

export function MayaOverlay({
  scrollYProgress,
  anchors,
  fallback,
  glitching,
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
      aria-hidden
    >
      {/* Second wrapper hosts the -50% centering so the outer motion.div's
          left/top drive the CENTER of the avatar, not its top-left corner. */}
      <div style={{ transform: "translate(-50%, -50%)" }}>
        <div className="relative">
          {/* Wide spotlight — the environment falls off, Maya lights up.
              This is the biggest saturated-acid moment on the page. */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 480,
              height: 480,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(223,255,0,0.10) 0%, rgba(223,255,0,0.03) 30%, transparent 65%)",
            }}
          />
          {/* Tight halo close in to Maya. */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -14,
              boxShadow:
                "0 0 60px rgba(223,255,0,0.55), 0 0 22px rgba(223,255,0,0.7)",
              background:
                "radial-gradient(circle, rgba(223,255,0,0.24) 0%, transparent 62%)",
            }}
          />
          <div className={glitching ? "glitch" : ""}>
            <MayaAvatar size={AVATAR_SIZE} />
          </div>
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
