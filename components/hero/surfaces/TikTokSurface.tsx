"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";
import { PhoneShell } from "../shells/PhoneShell";

interface CommentRow {
  handle: string;
  text: string;
  time: string;
  hue: string;
}

// A single filler comment is enough to give the feed context; adding
// more pushes Maya's row + the acid-tinted AI reply card past the phone
// frame's bottom edge and clips them. Keep @leah.mtl and drop @sam.k so
// the maya → AI-reply pair sits fully inside the shell.
const COMMENTS: CommentRow[] = [
  { handle: "leah.mtl", text: "obsessed 🔥🔥", time: "3m", hue: "#FF8AB4" },
];

interface Props {
  igniteProgress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

export function TikTokSurface({ igniteProgress, anchorRef }: Props) {
  const active = igniteProgress > 0.15;
  return (
    <PhoneShell platform="tiktok">
      {/* Video area — takes upper portion of phone */}
      <div className="relative flex-[1.15] overflow-hidden">
        <VideoBackdrop />
        <BrandOverlay />
        <RightRail />
      </div>

      {/* Comments drawer — slides up over the video's bottom */}
      <div
        className="relative flex flex-col gap-2 px-4 pt-3 pb-4 flex-[0.85] overflow-hidden"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-hi">
            128 comments
          </span>
          <span className="text-[10px] font-mono text-text-lo">latest</span>
        </div>

        {/* Maya's ignited comment sits FIRST — pinned right under the
            "128 comments" header so it stays high on-screen in the hero
            (directly beneath the video area) and the hand-drawn acid
            circle lands on it cleanly without waiting for lower rows
            to scroll into view. */}
        <motion.div
          initial={false}
          animate={{ filter: active ? "brightness(1.02)" : "brightness(0.9)" }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div
            className="absolute -inset-1.5 rounded-lg pointer-events-none"
            style={{
              boxShadow: `0 0 24px ${active ? "rgba(223,255,0,0.08)" : "transparent"}`,
              border: `1px solid ${active ? "rgba(223,255,0,0.18)" : "transparent"}`,
              transition: "all 400ms ease",
            }}
          />
          {/* Hand-drawn acid circle around Maya's comment — the "the
              system noticed THIS one" hook for the hero. Fades out as
              the chapter-01 ignite takes over so it doesn't compete
              with the acid highlight border above. */}
          <HandDrawnCircle active={active} />
          <div className="relative flex gap-2 items-start py-1.5">
            <MayaAnchor anchorRef={anchorRef} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[13px] font-semibold text-text-hi">
                  maya.r
                </span>
                <span className="text-[10px] font-mono text-text-lo">now</span>
              </div>
              <div className="text-[13px] text-text-hi leading-snug">
                how much is this? <span>😍</span>
              </div>
              {/* AI public reply — this is the key beat: the brand
                  replied to her in public. Reads clearly and distinctly
                  from the surrounding comments via an acid-tinted card
                  + acid "AI" chip + full-brightness text. */}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{
                  opacity: igniteProgress > 0.35 ? 1 : 0,
                  y: igniteProgress > 0.35 ? 0 : -4,
                }}
                transition={{ duration: 0.3 }}
                className="mt-2 rounded-md p-2.5"
                style={{
                  background: "rgba(223, 255, 0, 0.06)",
                  border: "1px solid rgba(223, 255, 0, 0.22)",
                  borderLeft: "2px solid var(--acid)",
                  boxShadow: "0 0 20px rgba(223, 255, 0, 0.08)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[12px] font-semibold text-text-hi">
                    @northbloom.co
                  </span>
                  <span
                    className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm tracking-widest"
                    style={{
                      color: "#0A0A0B",
                      background: "var(--acid)",
                    }}
                  >
                    AI
                  </span>
                  <span className="text-[10px] font-mono text-text-lo ml-auto">
                    public reply
                  </span>
                </div>
                <div className="text-[12px] text-text-hi leading-snug">
                  <TypedLine
                    text="just slid into your DMs 💌"
                    show={igniteProgress > 0.35}
                  />
                </div>
              </motion.div>
            </div>
            <div className="flex flex-col items-center text-text-lo shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10z" />
              </svg>
              <span className="text-[9px] font-mono">4</span>
            </div>
          </div>
        </motion.div>

        {/* Other feed comments live BELOW Maya's — surrounding chatter
            that recedes once her comment ignites. */}
        {COMMENTS.map((c, i) => (
          <CommentRow key={c.handle} c={c} dim={active} delay={i * 0.05} />
        ))}

        {/* Composer */}
        <div
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
          }}
        >
          <span className="text-[11px] text-text-lo/70">Add comment…</span>
          <span className="ml-auto text-[12px] text-text-lo">😊</span>
        </div>
      </div>
    </PhoneShell>
  );
}

function VideoBackdrop() {
  // Real looping product video fills the TikTok "for you" area. The
  // dark gradient sits behind as a fallback so the surface never reads
  // as blank while the file is loading (or if /Hero-video.mp4 hasn't
  // been added yet). A soft bottom-to-nothing dark gradient on top of
  // the video keeps the BrandOverlay copy legible.
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #1a0f24 0%, #0f1a24 55%, #050506 100%)",
        }}
      />
      <video
        src="/Hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}

function BrandOverlay() {
  return (
    <div className="absolute bottom-3 left-3 right-16 flex flex-col gap-1 text-text-hi">
      <div className="flex items-center gap-2">
        {/* @northbloom.co brand avatar — warm orange that ties to the
            hoodie in the /Hero-video.mp4 clip. Kept as a soft gradient
            (top-highlight → deep orange) so it reads as a real avatar
            disc, not a flat swatch. Only the BRAND avatar — Maya keeps
            the fox on deep-black. */}
        <div
          className="w-8 h-8 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, #FF8B4A 0%, #FF5F1F 100%)",
          }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold">@northbloom.co</span>
          <span className="text-[10px] text-text-lo/80">128.4K views · 3h</span>
        </div>
        <span
          className="ml-2 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm"
          style={{
            color: "var(--text-hi)",
            border: "1px solid var(--text-hi)",
          }}
        >
          Follow
        </span>
      </div>
      <div className="text-[11px] text-text-hi/85">
        new drop. black finish. only 200 units 🖤
      </div>
      <div className="text-[10px] font-mono text-text-lo/80">
        ♪ original sound — northbloom
      </div>
    </div>
  );
}

function RightRail() {
  const actions: Array<{ icon: string; label: string; count: string }> = [
    { icon: "♡", label: "like", count: "12.4K" },
    { icon: "💬", label: "comments", count: "128" },
    { icon: "↗", label: "share", count: "share" },
    { icon: "⋯", label: "more", count: "" },
  ];
  return (
    <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
      {actions.map((a) => (
        <div key={a.label} className="flex flex-col items-center gap-0.5">
          <span
            className="w-9 h-9 flex items-center justify-center rounded-full text-lg text-text-hi"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {a.icon}
          </span>
          {a.count && (
            <span className="text-[9px] font-mono text-text-hi/80">
              {a.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function CommentRow({
  c,
  dim,
  delay,
}: {
  c: CommentRow;
  dim: boolean;
  delay: number;
}) {
  // Once Maya's comment ignites, the surrounding feed recedes to ~0.4
  // so the Maya-comment → AI-reply pair reads as the clear focus.
  return (
    <motion.div
      initial={false}
      animate={{ opacity: dim ? 0.4 : 0.7 }}
      transition={{ duration: 0.4, delay }}
      className="flex gap-2 items-start py-1"
    >
      <div
        className="w-7 h-7 rounded-full shrink-0"
        style={{ background: c.hue, opacity: 0.7 }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[12px] font-medium text-text-hi/85">
            @{c.handle}
          </span>
          <span className="text-[9px] font-mono text-text-lo">{c.time}</span>
        </div>
        <div className="text-[12px] text-text-hi/70 truncate">{c.text}</div>
      </div>
    </motion.div>
  );
}

function TypedLine({ text, show }: { text: string; show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-block whitespace-nowrap align-bottom"
    >
      {text}
    </motion.span>
  );
}

// The "system noticed this" annotation. A CLOSED, neat-but-slightly-
// irregular ellipse traced in acid — asymmetric Bezier control points
// (12 vs 190 on the sides, 4 vs 54 top vs bottom), slight -1.2° tilt.
// Wraps snugly around Maya's row with just a hair of air. Drawn in
// over ~1.2 s shortly after mount via pathLength; vector-effect keeps
// the stroke at 2.5 CSS px regardless of how much the SVG stretches.
// Closed with Z — no long gaps, no stray tail — a complete loop.
// Fades to 0 once the chapter-01 ignite kicks in so it doesn't stack
// with the acid highlight border that appears above.
function HandDrawnCircle({ active }: { active: boolean }) {
  return (
    <motion.svg
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        top: -8,
        left: -12,
        right: -14,
        bottom: -6,
        overflow: "visible",
        transform: "rotate(-1.2deg)",
      }}
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      initial={{ opacity: 1 }}
      animate={{ opacity: active ? 0 : 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.path
        d="M 10 32 C 6 14, 44 4, 100 4 C 158 3, 194 12, 190 32 C 195 50, 150 56, 100 54 C 44 56, 6 46, 10 32 Z"
        fill="none"
        stroke="var(--acid)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          filter: "drop-shadow(0 0 5px rgba(223, 255, 0, 0.5))",
        }}
      />
    </motion.svg>
  );
}
