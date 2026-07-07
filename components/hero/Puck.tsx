"use client";
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import { PUCK_KEYFRAMES, PUCK_X, PUCK_Y } from "./dockPositions";

interface Props {
  scrollYProgress: MotionValue<number>;
  activeChapter: number;
  glitching: boolean;
}

export function Puck({ scrollYProgress, activeChapter, glitching }: Props) {
  // Puck position: interpolate between the dock positions across the entire
  // 0..1 scroll range. Keyframes include a per-chapter dwell so the puck reads
  // as PARKED on a surface before it takes off to the next one.
  // ONE element, ONE motion source, ONE lifetime.
  const xPct = useTransform(scrollYProgress, PUCK_KEYFRAMES, PUCK_X);
  const yPct = useTransform(scrollYProgress, PUCK_KEYFRAMES, PUCK_Y);
  const left = useMotionTemplate`${xPct}%`;
  const top = useMotionTemplate`${yPct}%`;

  return (
    <motion.div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      {/* Halo */}
      <motion.div
        className="absolute inset-0 -m-3 rounded-md"
        animate={{
          boxShadow: [
            "0 0 0 rgba(223,255,0,0)",
            "0 0 28px rgba(223,255,0,0.55)",
            "0 0 0 rgba(223,255,0,0)",
          ],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Corner ticks — pixel chip */}
      <PixelCorners />
      {/* Chip body */}
      <div
        className={`relative w-8 h-8 flex items-center justify-center overflow-hidden ${
          glitching ? "glitch" : ""
        }`}
        style={{
          background: "var(--acid)",
          clipPath:
            "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))",
        }}
      >
        <div
          className="absolute inset-1"
          style={{
            background:
              "linear-gradient(135deg, #F5A9D0 0%, #B37AE8 55%, #4A2B7A 100%)",
            clipPath:
              "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
          }}
        />
        <div className="relative text-[10px] font-mono font-bold text-white z-10">
          M
        </div>
      </div>
      {/* Label — chapter-aware but the puck itself does not remount */}
      <ChapterBadge index={activeChapter} />
    </motion.div>
  );
}

function PixelCorners() {
  const dots = [
    { top: -6, left: -6 },
    { top: -6, right: -6 },
    { bottom: -6, left: -6 },
    { bottom: -6, right: -6 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 bg-acid"
          style={d as React.CSSProperties}
        />
      ))}
    </>
  );
}

function ChapterBadge({ index }: { index: number }) {
  const label = ["MAYA.R", "MAYA.R", "LEAD #001", "LIVE", "RECIPIENT", "CUSTOMER"][
    index
  ];
  return (
    <div
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5"
      style={{
        color: "var(--acid)",
        background: "rgba(10,10,11,0.75)",
        border: "1px solid var(--acid)",
      }}
    >
      {label}
    </div>
  );
}
