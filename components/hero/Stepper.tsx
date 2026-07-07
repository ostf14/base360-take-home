"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";

interface Props {
  activeChapter: number;
  scrollYProgress: MotionValue<number>;
}

// Short caption for the active node — kept tight so the rail stays narrow.
const NODE_LABELS = ["Comment", "DM", "CRM", "Call", "Nurture", "System"];

// Snap the acid fill to node positions at each chapter boundary. 6 nodes
// distributed evenly [0%..100%]; the fill height reaches node i's center
// exactly when scrollYProgress crosses i/6 — the same instant activeChapter
// flips. Between boundaries the fill interpolates smoothly.
const FILL_INPUT = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
const FILL_OUTPUT = ["0%", "20%", "40%", "60%", "80%", "100%", "100%"];

// The vertical rail. Lives in the middle grid column and IS the divider
// between copy and canvas — no separate seam line needed.
export function Stepper({ activeChapter, scrollYProgress }: Props) {
  const fillHeight = useTransform(scrollYProgress, FILL_INPUT, FILL_OUTPUT);

  return (
    <div className="relative h-full w-full flex justify-center py-20">
      <div className="relative h-full flex flex-col justify-between items-center">
        {/* Faint hairline running the full node range */}
        <div
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-1/2 -translate-x-1/2 w-px"
          style={{ background: "var(--hairline)", opacity: 0.8 }}
        />
        {/* Acid fill — grows top-down as we scroll */}
        <motion.div
          aria-hidden
          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-px"
          style={{
            background: "var(--acid)",
            height: fillHeight,
            boxShadow: "0 0 6px rgba(223,255,0,0.55)",
          }}
        />
        {/* Six evenly-spaced nodes */}
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
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={false}
        animate={{
          background: active || past ? "var(--acid)" : "var(--bg)",
          borderColor: active || past ? "var(--acid)" : "var(--hairline)",
          scale: active ? 1.4 : 1,
          opacity: active ? 1 : past ? 0.75 : 1,
          boxShadow: active
            ? "0 0 12px rgba(223,255,0,0.7)"
            : "0 0 0 rgba(223,255,0,0)",
        }}
        transition={{ duration: 0.28 }}
        className="w-3 h-3 relative z-10"
        style={{ border: "1px solid" }}
      />
      {active && (
        <div
          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono uppercase tracking-widest pointer-events-none"
          style={{
            color: "var(--acid)",
            textShadow: "0 0 10px rgba(223,255,0,0.35)",
          }}
        >
          {String(index + 1).padStart(2, "0")} · {label}
        </div>
      )}
    </div>
  );
}
