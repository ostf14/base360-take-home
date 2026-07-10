"use client";
import { motion } from "framer-motion";
import {
  IdCard,
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MayaAnchor } from "../MayaOverlay";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

interface RowNode {
  key: string;
  label: string;
  sub: string;
  Icon?: LucideIcon;
  closed?: boolean;
}

// Single-row funnel: five environment nodes + a terminal CLOSED
// pill, with a dashed acid arrow between every adjacent pair. Icons
// echo the surfaces from the story so each box carries its shape
// (Smartphone / MessageCircle / IdCard / Phone / Mail).
const NODES: RowNode[] = [
  { key: "tiktok", label: "TIKTOK", sub: "comment", Icon: Smartphone },
  { key: "dm", label: "DM", sub: "conversation", Icon: MessageCircle },
  { key: "crm", label: "CRM", sub: "record", Icon: IdCard },
  { key: "call", label: "AI CALL", sub: "voice", Icon: Phone },
  { key: "email", label: "EMAIL", sub: "nurture", Icon: Mail },
  { key: "closed", label: "CLOSED · $32", sub: "won", closed: true },
];

// Box height is fixed so the between-node arrow containers can be
// sized to match, and their vertically-centered dashed line + head
// land on the boxes' mid-height instead of floating above them.
// 14 top pad + 14 bottom pad + max(icon 18, text 15 × 1.2 = 18) +
// 2 px border = 48 px.
const BOX_HEIGHT = 48;
const ARROW_WIDTH = 44;

// Reveal thresholds spaced across the chapter's progress so the row
// draws in TikTok → CLOSED as the reader scrolls: node — arrow —
// node — arrow — …, ending just before the chapter boundary.
const NODE_THRESHOLDS = [0.0, 0.14, 0.28, 0.42, 0.56, 0.7];
const ARROW_THRESHOLDS = [0.07, 0.21, 0.35, 0.49, 0.63];

export function SystemSurface({ progress, anchorRef }: Props) {
  return (
    <div className="absolute inset-0 px-6 pt-24 pb-16 flex">
      <div
        className="relative flex-1 rounded-xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          boxShadow: "var(--specimen-shadow)",
        }}
      >
        {/* Chrome — top-left "SYSTEM VIEW / ZOOM 1:1", top-right
            "MAYA.R · ONE THREAD". */}
        <div className="absolute top-4 left-5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-text-lo z-10">
          <span>base360 / system view</span>
          <span
            className="w-px h-3"
            style={{ background: "var(--hairline)" }}
          />
          <span className="text-text-lo/70">zoom · 1:1</span>
        </div>
        <div className="absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono uppercase text-text-lo/70 z-10">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--text-lo)" }}
          />
          maya.r · one thread
        </div>

        {/* Grid backdrop — faint uniform lines, no reticle so the
            row layout reads as the primary structure. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Single-row funnel. Outer flex uses items-start so every
            column's TOP aligns; arrows have an explicit BOX_HEIGHT
            so their dashed line — vertically centered inside — sits
            at the same y as the box mid-heights. Sublabels sit
            below the boxes and don't shift the arrow row. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="flex items-start">
            {NODES.map((n, i) => (
              <div key={n.key} className="flex items-start">
                {i > 0 && (
                  <RowArrow
                    revealed={progress > ARROW_THRESHOLDS[i - 1]}
                  />
                )}
                <NodeCol
                  n={n}
                  revealed={progress > NODE_THRESHOLDS[i] - 0.03}
                  anchorRef={n.closed ? anchorRef : undefined}
                />
              </div>
            ))}
          </div>

          {/* Bottom tagline. Kept small and muted so the row stays
              the primary read of the frame. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: progress > 0.7 ? 1 : 0,
              y: progress > 0.7 ? 0 : 8,
            }}
            transition={{ duration: 0.35 }}
            className="mt-12 text-[10px] font-mono uppercase tracking-widest text-text-lo text-center"
          >
            one operating system
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function NodeCol({
  n,
  revealed,
  anchorRef,
}: {
  n: RowNode;
  revealed: boolean;
  anchorRef?: React.RefObject<HTMLDivElement>;
}) {
  const Icon = n.Icon;
  const isClosed = !!n.closed;
  return (
    <div className="relative flex flex-col items-center gap-2.5">
      {/* MayaAnchor for the CLOSED node — absolutely positioned so
          the persistent MayaOverlay docks a bit above the pill
          without shifting the pill down. The overlay reads this
          slot's rect via getBoundingClientRect. */}
      {isClosed && anchorRef && (
        <div
          aria-hidden
          className="absolute"
          style={{
            left: "50%",
            top: -48,
            transform: "translateX(-50%)",
          }}
        >
          <MayaAnchor anchorRef={anchorRef} />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: revealed ? 1 : 0.15, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center rounded-md whitespace-nowrap font-mono font-bold uppercase tracking-wider"
        style={{
          // 14 / 18 px snap to --space-3 (12) / --space-5 (20) as the
          // closest scale steps, with BOX_HEIGHT recomputed above.
          padding: "var(--space-3) var(--space-5)",
          height: BOX_HEIGHT,
          // 9 px snaps to --space-2 (8) — the icon → label gap.
          gap: "var(--space-2)",
          fontSize: 15,
          boxSizing: "border-box",
          color: isClosed ? "#0A0A0B" : "var(--text-hi)",
          background: isClosed ? "var(--acid)" : "rgba(28,28,31,0.92)",
          border: `1px solid ${
            isClosed ? "var(--acid)" : "rgba(255,255,255,0.22)"
          }`,
          boxShadow: isClosed
            ? "0 0 26px rgba(223,255,0,0.55)"
            : "0 4px 12px rgba(0,0,0,0.45)",
        }}
      >
        {Icon && !isClosed && (
          <Icon
            size={18}
            strokeWidth={1.2}
            color="#DFFF00"
            style={{
              filter:
                "drop-shadow(0 0 5px rgba(223,255,0,0.55)) drop-shadow(0 0 12px rgba(223,255,0,0.22))",
            }}
            aria-hidden
          />
        )}
        <span>{n.label}</span>
      </motion.div>
      <div className="text-[9px] font-mono uppercase text-text-lo/90 tracking-widest whitespace-nowrap">
        {n.sub}
      </div>
    </div>
  );
}

function RowArrow({ revealed }: { revealed: boolean }) {
  const midY = BOX_HEIGHT / 2;
  return (
    <div
      aria-hidden
      className="flex items-center justify-center shrink-0"
      style={{ height: BOX_HEIGHT, width: ARROW_WIDTH }}
    >
      <svg
        width={ARROW_WIDTH}
        height={BOX_HEIGHT}
        viewBox={`0 0 ${ARROW_WIDTH} ${BOX_HEIGHT}`}
        style={{
          overflow: "visible",
          filter: "drop-shadow(0 0 5px rgba(223,255,0,0.4))",
        }}
      >
        {/* Dashed acid line + arrowhead grow together, anchored to
            the LEFT edge (transform-origin 0 50%) so the reveal
            reads as "the line pushes into the next node". */}
        <motion.g
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: revealed ? 1 : 0,
            opacity: revealed ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "0 50%" }}
        >
          <line
            x1={2}
            y1={midY}
            x2={ARROW_WIDTH - 8}
            y2={midY}
            stroke="var(--acid)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
          <polyline
            points={`${ARROW_WIDTH - 12},${midY - 4} ${ARROW_WIDTH - 4},${midY} ${ARROW_WIDTH - 12},${midY + 4}`}
            fill="none"
            stroke="var(--acid)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}
