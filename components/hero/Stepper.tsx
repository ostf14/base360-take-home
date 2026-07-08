"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";

interface Props {
  activeChapter: number;
  scrollYProgress: MotionValue<number>;
}

// Names paired with each chapter's index. Shown in the active label to
// the LEFT of the rail. Uppercase, mono — designed to be read as the
// current step name, not as chrome.
const NODE_LABELS = [
  "COMMENT",
  "DM",
  "CRM",
  "AI CALL",
  "NURTURE",
  "ONE SYSTEM",
];

// Snap the acid fill to node positions at each chapter boundary. 6 nodes
// evenly distributed [0%..100%]; the fill reaches node i's row exactly
// when scrollYProgress crosses i/6. Left unshifted on purpose — the fill
// keeps advancing across the brief empty midpoints in the surface
// handoff, so the reader always sees forward motion on the rail even
// during the sub-frame gap where both surfaces are 0.
const FILL_INPUT = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
const FILL_OUTPUT = ["0%", "20%", "40%", "60%", "80%", "100%", "100%"];

const NODE_SIZE = 12;

// The vertical rail. Lives in the 64px middle grid column and IS the
// divider between copy and canvas. NOTHING crosses the rail line: all
// six nodes are the same-shape square sitting ON the rail, labels sit
// to the LEFT of the rail with a clear gap, and each node's opaque
// background hides the segment of rail directly behind it so the line
// meets each square's top/bottom edge without piercing it.
export function Stepper({ activeChapter, scrollYProgress }: Props) {
  const fillHeight = useTransform(scrollYProgress, FILL_INPUT, FILL_OUTPUT);

  return (
    <div className="relative h-full w-full flex justify-center py-20">
      <div className="relative h-full flex flex-col justify-between items-center">
        {/* Faint hairline running the full node range. Rendered behind
            the nodes (default z-index) so each square's own background
            hides the piece of rail directly behind it. */}
        <div
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-1/2 -translate-x-1/2 w-px"
          style={{ background: "var(--hairline)", opacity: 0.8 }}
        />
        {/* Acid fill — grows top-down as we scroll. */}
        <motion.div
          aria-hidden
          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-px"
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
  active,
  past,
  label,
}: {
  index: number;
  active: boolean;
  past: boolean;
  label: string;
}) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Label sits to the LEFT of the rail, right-anchored a gap-width
          past the square's left edge. Absolute positioning lets it
          overflow into the copy column's right padding without widening
          the 64px stepper column or pushing the canvas. Only the ACTIVE
          node's label is opaque; the others sit at opacity 0 so the
          label follows the current chapter without any label clutter.
          Just the step NAME — the step number is already carried by
          the kicker in the copy column, no need to repeat it here. */}
      <motion.div
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-right font-mono uppercase pointer-events-none text-[10px] font-bold"
        style={{
          right: "calc(100% + 14px)",
          letterSpacing: "0.18em",
          color: "var(--acid)",
          textShadow: "0 0 12px rgba(223,255,0,0.32)",
        }}
      >
        {label}
      </motion.div>

      {/* Node square. Same shape across all six positions — state comes
          through fill / border / scale / glow only. Future nodes use
          --bg (same as canvas) as background so the rail behind them is
          hidden while the border reads as a clean hairline outline. */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? 1.35 : 1,
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
          boxShadow: active
            ? "0 0 14px rgba(223,255,0,0.65)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          border: "1px solid",
        }}
      />
    </div>
  );
}
