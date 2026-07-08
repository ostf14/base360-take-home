"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";

interface Props {
  activeChapter: number;
  scrollYProgress: MotionValue<number>;
}

// Word shown INSIDE the active pill. Uppercase, tight — the longest string
// ("ONE SYSTEM") sets PILL_MIN_WIDTH below so nothing clips.
const NODE_LABELS = [
  "COMMENT",
  "DM",
  "CRM",
  "AI CALL",
  "NURTURE",
  "ONE SYSTEM",
];

// Snap the acid fill to node positions at each chapter boundary. 6 nodes
// distributed evenly [0%..100%]; the fill height reaches node i's center
// exactly when scrollYProgress crosses i/6 — the same instant activeChapter
// flips. Between boundaries the fill interpolates smoothly. This keeps
// advancing across the brief empty midpoints in the surface handoff so
// the reader always sees forward motion on the rail.
const FILL_INPUT = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
const FILL_OUTPUT = ["0%", "20%", "40%", "60%", "80%", "100%", "100%"];

const NODE_HEIGHT = 26;
const SQUARE_WIDTH = 26;
// Fits "ONE SYSTEM" at 10px mono / 0.18em tracking without clipping.
// Overflows the 64px stepper column into copy/canvas padding — well within
// each neighbor's inner padding, so no text collision.
const PILL_MIN_WIDTH = 116;

// The vertical rail. Lives in the middle grid column and IS the divider
// between copy and canvas — no separate seam line needed.
export function Stepper({ activeChapter, scrollYProgress }: Props) {
  const fillHeight = useTransform(scrollYProgress, FILL_INPUT, FILL_OUTPUT);

  return (
    <div className="relative h-full w-full flex justify-center py-20">
      <div className="relative h-full flex flex-col justify-between items-center">
        {/* Rail lines are drawn BEHIND the nodes (default z-index) so the
            opaque background of each square/pill hides the rail beneath
            it — the line meets the node's edge but never crosses the
            number or the word inside. */}
        <div
          aria-hidden
          className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-px"
          style={{ background: "var(--hairline)", opacity: 0.8 }}
        />
        <motion.div
          aria-hidden
          className="absolute top-3 left-1/2 -translate-x-1/2 w-px"
          style={{
            background: "var(--acid)",
            height: fillHeight,
            boxShadow: "0 0 6px rgba(223,255,0,0.55)",
          }}
        />
        {CHAPTERS.map((_, i) => (
          <Node
            key={i}
            index={i}
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
  index,
  active,
  past,
  label,
}: {
  index: number;
  active: boolean;
  past: boolean;
  label: string;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={false}
        animate={{
          width: active ? PILL_MIN_WIDTH : SQUARE_WIDTH,
          borderRadius: active ? NODE_HEIGHT / 2 : 4,
          background: active
            ? "var(--acid)"
            : past
            ? "var(--acid-dim)"
            : "var(--bg)",
          borderColor: active
            ? "var(--acid)"
            : past
            ? "var(--acid-dim)"
            : "var(--hairline)",
          color: active || past ? "#0A0A0B" : "var(--text-lo)",
          boxShadow: active
            ? "0 0 20px rgba(223,255,0,0.35)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-center font-mono uppercase overflow-hidden whitespace-nowrap"
        style={{
          border: "1px solid",
          height: NODE_HEIGHT,
        }}
      >
        {active ? (
          <span className="text-[10px] tracking-[0.18em] font-bold px-3">
            {label}
          </span>
        ) : (
          <span className="text-[10px] tracking-[0.12em] font-medium">
            {num}
          </span>
        )}
      </motion.div>
    </div>
  );
}
