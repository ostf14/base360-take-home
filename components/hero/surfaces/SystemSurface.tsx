"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

interface Node {
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
const NODES: Node[] = [
  { key: "tiktok", label: "TIKTOK", x: 15, y: 30, sub: "comment", shell: "phone" },
  { key: "dm",     label: "DM",     x: 34, y: 15, sub: "conversation", shell: "phone" },
  { key: "crm",    label: "CRM",    x: 52, y: 42, sub: "record", shell: "window" },
  { key: "call",   label: "AI CALL",x: 72, y: 20, sub: "voice", shell: "call" },
  { key: "email",  label: "EMAIL",  x: 84, y: 52, sub: "nurture", shell: "window" },
  { key: "closed", label: "CLOSED · $32", x: 55, y: 76, sub: "won", shell: "closed" },
];

// Approximate label footprint in viewBox units (viewBox is 100×100 with
// preserveAspectRatio="none" so x units are ~% of container width and y
// units are ~% of container height). The label box is roughly 60×22 CSS
// px on a typical 800×500 map, i.e. ~3.75 x-units by ~2.2 y-units around
// the center. Rounded up a hair for gap: rx=5, ry=3.
const NODE_RX = 5;
const NODE_RY = 3;

export function SystemSurface({ progress, anchorRef }: Props) {
  // Draw FIVE independent segments (one per adjacent-node pair) instead
  // of a single continuous polyline through node centers. Each segment
  // ends at the ellipse-boundary approximation around each node, so the
  // acid line meets every label at its edge cleanly — no stray tails
  // poking past the boxes, no line disappearing into label centers only
  // to re-emerge on the other side. Written into ONE motion.path so the
  // pathLength draw-in animation still runs sequentially through the
  // whole route from TikTok → Closed.
  const pathD = NODES.slice(0, -1)
    .map((a, i) => {
      const b = NODES[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) return "";
      const ux = dx / len;
      const uy = dy / len;
      // Distance from center to ellipse boundary along (ux, uy).
      const inv = Math.sqrt((ux / NODE_RX) ** 2 + (uy / NODE_RY) ** 2);
      const t = inv === 0 ? 0 : 1 / inv;
      const x1 = a.x + ux * t;
      const y1 = a.y + uy * t;
      const x2 = b.x - ux * t;
      const y2 = b.y - uy * t;
      return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="absolute inset-0 p-6 pt-12 flex">
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

        {/* Connector polyline — ONE lead path through every
            environment. This is the payoff frame, so the path is the
            acid accent: a continuous glowing line that draws in as
            `progress` advances, ending at the CLOSED node. */}
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
          {/* Faint full-length base so the route is legible even before
              the animated stroke has drawn all the way through. */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(223, 255, 0, 0.18)"
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--acid)"
            strokeWidth={1.1}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: Math.max(0, Math.min(1, progress * 1.2)),
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
function ShellGlyph({ shell }: { shell: Node["shell"] }) {
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
