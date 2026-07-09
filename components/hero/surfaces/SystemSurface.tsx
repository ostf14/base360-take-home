"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

interface MapNode {
  key: string;
  label: string;
  x: number;
  y: number;
  sub: string;
  shell: "phone" | "window" | "call" | "closed";
}

// The system view is the zoom-out. Same environments Maya just travelled
// through, now laid out flat on one map. Each node echoes its surface's shell
// (phone silhouette / window silhouette / naked call ring) so the eye reads
// "these five environments become one thread."
const NODES: MapNode[] = [
  { key: "tiktok", label: "TIKTOK", x: 15, y: 30, sub: "comment", shell: "phone" },
  { key: "dm",     label: "DM",     x: 34, y: 15, sub: "conversation", shell: "phone" },
  { key: "crm",    label: "CRM",    x: 52, y: 42, sub: "record", shell: "window" },
  { key: "call",   label: "AI CALL",x: 72, y: 20, sub: "voice", shell: "call" },
  { key: "email",  label: "EMAIL",  x: 84, y: 52, sub: "nurture", shell: "window" },
  { key: "closed", label: "CLOSED · $32", x: 55, y: 76, sub: "won", shell: "closed" },
];

// Straight polyline through every node center in order. One
// continuous path — no separate segments — so the reveal mask
// below can draw it monotonically from TikTok to CLOSED as scroll
// progress advances. Straight-but-accurate beats curved-but-
// missing: with the earlier Catmull-Rom pass the curve was
// wandering past the labels between nodes; a polyline lands each
// endpoint exactly on the node center, and the labels' opaque
// backgrounds cover the segment of line that crosses beneath them.
function polylinePath(points: [number, number][]): string {
  if (points.length < 2) return "";
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`,
    )
    .join(" ");
}

export function SystemSurface({ progress, anchorRef }: Props) {
  // Straight-line polyline threading every node in order. Because
  // it's one continuous path, the mask below reveals it from start
  // to finish as a single monotonic operation tied to the chapter's
  // scroll progress — the lead's path draws through TikTok → DM →
  // CRM → AI Call → Email → CLOSED in order.
  const pathD = polylinePath(NODES.map((n) => [n.x, n.y] as [number, number]));
  // Reveal 0 → 1 across the chapter. Slight *1.1 so the last
  // stretch completes just before the chapter boundary — feels
  // more decisive than trailing to the very last frame.
  const revealOffset = 1 - Math.min(1, Math.max(0, progress * 1.1));

  return (
    <div className="absolute inset-0 px-6 pt-24 pb-16 flex">
      <div
        className="relative flex-1 rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface-panel)",
          border: "1px solid var(--hairline)",
          boxShadow: "var(--specimen-shadow)",
        }}
      >
        {/* Chrome — reads as a canvas / map view, not a dashboard */}
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

        {/* Grid background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Cross-hair reticle at the visual center to reinforce map read */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent 49.5%, rgba(255,255,255,0.15) 49.5%, rgba(255,255,255,0.15) 50.5%, transparent 50.5%), linear-gradient(to bottom, transparent 49.5%, rgba(255,255,255,0.15) 49.5%, rgba(255,255,255,0.15) 50.5%, transparent 50.5%)",
          }}
        />

        {/* Smooth winding funnel — ONE continuous curve threading
            every environment in order. Two layers, both dashed:
              (1) faint full-length base — always visible so the
                  route reads even before the reveal has drawn.
              (2) bright reveal — dashed acid stroke unmasked
                  progressively via a growing white mask stroke.
            The mask stroke uses pathLength=1 + strokeDasharray "1 1"
            so its offset animates 1 → 0 to reveal the visible dashed
            path from the first node to the last, tied to the
            chapter's own scroll progress. */}
        <svg
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            overflow: "visible",
            filter: "drop-shadow(0 0 5px rgba(223, 255, 0, 0.55))",
          }}
        >
          <defs>
            <mask
              id="funnel-reveal"
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x="-10"
              y="-10"
              width="120"
              height="120"
            >
              <rect x="-10" y="-10" width="120" height="120" fill="black" />
              <path
                d={pathD}
                fill="none"
                stroke="white"
                strokeWidth={5}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={revealOffset}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </mask>
          </defs>
          {/* Faint dashed base — always visible so the eye reads the
              full path before the reveal has drawn through it. */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(223, 255, 0, 0.2)"
            strokeWidth={0.7}
            strokeDasharray="1.6 1.6"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bright dashed reveal — visible only where the mask stroke
              draws white, which grows monotonically with `progress`. */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--acid)"
            strokeWidth={1.4}
            strokeDasharray="2.2 2.2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            mask="url(#funnel-reveal)"
          />
        </svg>

        {/* Nodes. The LABEL is the primary element and sits dead-center
            on (n.x, n.y) so the connector path meets each node exactly
            at its opaque box. The shell-glyph echo and the sub caption
            are absolute-positioned above / below the label so they
            don't shift the label off center. */}
        {NODES.map((n, i) => {
          const revealed = progress > i / NODES.length - 0.05;
          const isClosed = n.key === "closed";
          return (
            <div
              key={n.key}
              className="absolute"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: revealed ? 1 : 0.15, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
                style={{ transformOrigin: "50% 50%" }}
              >
                <div
                  className="relative px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider font-medium whitespace-nowrap"
                  style={{
                    // Center the label on (n.x, n.y). All the shell /
                    // anchor / sub siblings position themselves relative
                    // to THIS label, so the label is the sole thing at
                    // the node's canonical coordinate.
                    transform: "translate(-50%, -50%)",
                    color: isClosed ? "#0A0A0B" : "var(--text-hi)",
                    background: isClosed
                      ? "var(--acid)"
                      : "rgba(28, 28, 31, 0.92)",
                    border: `1px solid ${
                      isClosed ? "var(--acid)" : "rgba(255, 255, 255, 0.22)"
                    }`,
                    boxShadow: isClosed
                      ? "0 0 26px rgba(223,255,0,0.55)"
                      : "0 4px 12px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  {n.label}
                  {/* Shell glyph echo — absolute-positioned above the
                      label so it visually sits ON the node stack but
                      doesn't shift the label center. */}
                  {!isClosed && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ bottom: "calc(100% + 8px)" }}
                    >
                      <ShellGlyph shell={n.shell} />
                    </div>
                  )}
                  {/* MayaAnchor above the CLOSED label — the overlay
                      docks here so 🐼 lands at the end of the funnel. */}
                  {isClosed && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ bottom: "calc(100% + 8px)" }}
                    >
                      <MayaAnchor anchorRef={anchorRef} />
                    </div>
                  )}
                  {/* Sub caption below the label. */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono uppercase text-text-lo/90"
                    style={{ top: "calc(100% + 6px)" }}
                  >
                    {n.sub}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: progress > 0.6 ? 1 : 0, y: progress > 0.6 ? 0 : 8 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-6 left-0 right-0 text-center"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo mb-1">
            one operating system
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Little grey silhouette that echoes the shell used on that node's surface.
// Not clickable, not styled as a control — just a visual rhyme.
function ShellGlyph({ shell }: { shell: MapNode["shell"] }) {
  if (shell === "phone") {
    return (
      <div
        aria-hidden
        style={{
          width: 22,
          height: 34,
          borderRadius: 6,
          border: "1px solid rgba(255, 255, 255, 0.22)",
          background: "rgba(28, 28, 31, 0.92)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 8,
            height: 2,
            borderRadius: 1,
            background: "rgba(255,255,255,0.15)",
          }}
        />
      </div>
    );
  }
  if (shell === "window") {
    return (
      <div
        aria-hidden
        style={{
          width: 42,
          height: 30,
          borderRadius: 4,
          border: "1px solid rgba(255, 255, 255, 0.22)",
          background: "rgba(28, 28, 31, 0.92)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 9,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 15,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        />
      </div>
    );
  }
  if (shell === "call") {
    // Naked ring — echoes the frameless call surface
    return (
      <div
        aria-hidden
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          background: "transparent",
        }}
      />
    );
  }
  return null;
}
