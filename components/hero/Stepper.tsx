"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";

interface Props {
  activeChapter: number;
  scrollYProgress: MotionValue<number>;
}

// Step names paired with each chapter's index. Only the ACTIVE step's
// label is opaque; the others sit at opacity 0 so the reader always
// sees exactly one label — the current step — beside the rail.
const NODE_LABELS = [
  "COMMENT",
  "DM",
  "CRM",
  "AI CALL",
  "NURTURE",
  "ONE SYSTEM",
];

// Snap the acid fill to node positions at each chapter boundary. 6
// nodes evenly distributed [0 % .. 100 %]; the fill reaches node i's
// row exactly when scrollYProgress crosses i / 6. Left unshifted on
// purpose so the fill keeps advancing across the brief empty
// midpoints in the surface handoff — the reader always sees forward
// motion on the rail.
const FILL_INPUT = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
const FILL_OUTPUT = ["0%", "20%", "40%", "60%", "80%", "100%", "100%"];

const NODE_SIZE = 12;
const NODE_GAP = 56; // px between adjacent node centers' rows
// 6 nodes + 5 gaps = 6*12 + 5*56 = 352 px — a compact rail that
// reads as a single tight index instead of getting spread thin over
// the full 100 vh viewport.

// Left-edge vertical stepper. Compact (~350 px) column centered
// vertically in the viewport, rail hugging the left gutter with the
// active label to its right. Squares sit CENTERED on the rail; each
// square's opaque background hides the segment of rail directly
// behind it so the line meets the square edge without piercing.
//
// Node states:
//   PAST    → solid dim-acid fill + dim-acid border (traveled)
//   ACTIVE  → bright acid fill, acid border, 1.35× scale, acid glow
//   FUTURE  → --bg fill (hides rail), hairline border, no glow
export function Stepper({ activeChapter, scrollYProgress }: Props) {
  const fillHeight = useTransform(scrollYProgress, FILL_INPUT, FILL_OUTPUT);
  return (
    <div className="relative h-full w-full flex items-center pl-8">
      <div
        className="relative flex flex-col items-center"
        style={{ gap: NODE_GAP - NODE_SIZE }}
      >
        {/* Rail strip — 1 px wide, spanning between the first and
            last node centers. Two children: a faint hairline
            background and an acid fill that grows from top to
            fillHeight. Percentages resolve against this strip so
            fill=100 % exactly reaches the last node's center. */}
        <div
          aria-hidden
          className="absolute w-px z-0"
          style={{
            top: NODE_SIZE / 2,
            bottom: NODE_SIZE / 2,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "var(--hairline)", opacity: 0.8 }}
          />
          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{
              background: "var(--acid)",
              height: fillHeight,
              boxShadow: "0 0 6px rgba(223,255,0,0.55)",
            }}
          />
        </div>
        {CHAPTERS.map((_, i) => (
          <Node
            key={i}
            active={i === activeChapter}
            past={i < activeChapter}
            label={NODE_LABELS[i]}
          />
        ))}
      </div>
    </div>
  );
}

function Node({
  active,
  past,
  label,
}: {
  active: boolean;
  past: boolean;
  label: string;
}) {
  return (
    <div className="relative flex items-center justify-center z-10">
      {/* Active-only label — 14 px past the node's right edge,
          vertically centered. Non-active labels sit at opacity 0
          so exactly one step name is ever legible at a time. */}
      <motion.div
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-left font-mono uppercase pointer-events-none text-[10px] font-bold"
        style={{
          left: "calc(100% + 14px)",
          letterSpacing: "0.18em",
          color: "var(--acid)",
          textShadow: "0 0 12px rgba(223,255,0,0.32)",
        }}
      >
        {label}
      </motion.div>
      {/* The square. Same shape across all six positions — state
          drives fill / border / scale / glow. Future nodes use --bg
          (same as page) so the rail directly behind them is hidden
          and the border reads as a clean hairline outline. */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? 1.35 : 1,
          background: active
            ? "var(--acid)"
            : past
            ? "#6D7C00"
            : "var(--bg)",
          borderColor: active
            ? "var(--acid)"
            : past
            ? "#6D7C00"
            : "var(--hairline)",
          boxShadow: active
            ? "0 0 14px rgba(223,255,0,0.65)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          border: "1px solid",
        }}
      />
    </div>
  );
}
