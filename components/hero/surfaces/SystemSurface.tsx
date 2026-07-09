"use client";
import { motion } from "framer-motion";
import {
  createRef,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

// Straight polyline through every node center in order. Endpoints
// come from measured DOM refs, not hardcoded coords, so each
// segment lands exactly on the actual rendered node box center.
function polylinePath(points: Array<[number, number]>): string {
  if (points.length < 2) return "";
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`,
    )
    .join(" ");
}

export function SystemSurface({ progress, anchorRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // One ref per node — attached to a childless, absolutely
  // positioned 0 × 0 marker span placed at each node's canonical
  // (x %, y %) point. Because the span has NO children, its
  // getBoundingClientRect can't be inflated by the sibling label /
  // shell glyph / sub caption's rendered area — the rect is a
  // pure point at the node's center.
  const nodeRefs = useMemo(
    () =>
      Array.from({ length: NODES.length }, () =>
        createRef<HTMLSpanElement>(),
      ),
    [],
  );
  // Node centers in viewBox (0..100) space, measured from the DOM.
  // Null until the first useLayoutEffect pass has read every ref;
  // the funnel path is not rendered before then — the alternative
  // would be drawing with hardcoded fallback coords, which is
  // exactly what the "line must land on the boxes" fix rules out.
  const [points, setPoints] = useState<Array<[number, number]> | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const c = container.getBoundingClientRect();
      if (!c.width || !c.height) return;
      // The SVG lives at `absolute inset-0` inside the container,
      // whose containing block is the container's PADDING box —
      // i.e. inside the 1 px border. Path coords in viewBox 100×100
      // stretch across the SVG's rendered dimensions, which are the
      // padding box's dimensions. Measuring / converting against the
      // padding box (not the border box getBoundingClientRect
      // returns) is what makes the path endpoints land exactly on
      // the node marker centers instead of ~1 px off.
      const style = window.getComputedStyle(container);
      const bl = parseFloat(style.borderLeftWidth) || 0;
      const bt = parseFloat(style.borderTopWidth) || 0;
      const br = parseFloat(style.borderRightWidth) || 0;
      const bb = parseFloat(style.borderBottomWidth) || 0;
      const pbLeft = c.left + bl;
      const pbTop = c.top + bt;
      const pbW = c.width - bl - br;
      const pbH = c.height - bt - bb;
      if (pbW <= 0 || pbH <= 0) return;
      // Read every ref up front. If ANY is missing we bail — the
      // path stays hidden until the next resize / re-mount produces
      // a full measurement pass.
      const nextRaw = nodeRefs.map((ref) => {
        const el = ref.current;
        if (!el) return null;
        return el.getBoundingClientRect();
      });
      if (nextRaw.some((r) => r === null)) return;
      const next: Array<[number, number]> = (
        nextRaw as DOMRect[]
      ).map((r) => {
        // r is DOMRect of the childless marker span. Its rect
        // origin IS the node's visual center. Convert
        // viewport-space (px) → padding-box-space (px) →
        // viewBox-space (0..100).
        const cx = r.left + r.width / 2 - pbLeft;
        const cy = r.top + r.height / 2 - pbTop;
        return [(cx / pbW) * 100, (cy / pbH) * 100];
      });
      setPoints(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [nodeRefs]);

  const pathD = points ? polylinePath(points) : "";
  // Reveal 0 → 1 across the chapter. Slight *1.1 so the last
  // stretch completes just before the chapter boundary — feels
  // more decisive than trailing to the very last frame.
  const revealOffset = 1 - Math.min(1, Math.max(0, progress * 1.1));

  return (
    <div className="absolute inset-0 px-6 pt-24 pb-16 flex">
      <div
        ref={containerRef}
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

        {/* Nodes. Each node has TWO absolutely positioned children:
              (1) a childless span placed at (0, 0) of the outer
                  wrapper — that's the measurement marker for the
                  funnel line's endpoint at this node.
              (2) the motion.div containing the visible label,
                  which is transform-centered on the same point
                  via translate(-50%, -50%).
            Keeping (1) as its own element with no descendants means
            its bounding rect is a clean 0 × 0 point at (n.x %, n.y %)
            — sibling label / shell glyph / sub caption can't inflate
            the marker's rect, so the measured funnel endpoints land
            exactly on the labels' visible centers. */}
        {NODES.map((n, i) => {
          const revealed = progress > i / NODES.length - 0.05;
          const isClosed = n.key === "closed";
          return (
            <div
              key={n.key}
              className="absolute"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
              }}
            >
              {/* Measurement marker — childless, 0 × 0, at the outer
                  wrapper's origin (which IS (n.x %, n.y %) of the
                  container). Its DOMRect is a pure point at that
                  location, safe from any label-cluster inflation. */}
              <span
                ref={nodeRefs[i]}
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  pointerEvents: "none",
                }}
              />
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
