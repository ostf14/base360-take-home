"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";
import { PhoneShell } from "../shells/PhoneShell";

interface Props {
  igniteProgress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

export function TikTokSurface({ igniteProgress, anchorRef }: Props) {
  const active = igniteProgress > 0.15;
  return (
    <PhoneShell platform="tiktok">
      {/* Video area — kept lean for the hero: video + @northbloom.co
          caption line only. No right-rail icons, no filler chrome —
          the eye should track down to Maya's comment. */}
      <div className="relative flex-[1] overflow-hidden">
        <VideoBackdrop />
        <BrandOverlay />
      </div>

      {/* Comments drawer — equal flex share with the video so it has
          real vertical space. Header pinned at top; Maya's comment
          vertically centered in the remaining space via a flex-1
          middle track. That keeps her row in the BODY of the phone
          with clear air above and below, well clear of the bottom
          crop. Nothing else: no filler comments, no composer. */}
      <div
        className="relative flex flex-col px-4 pt-3 pb-4 flex-[1] overflow-hidden"
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

        <div className="flex-1 flex items-center">
        <motion.div
          initial={false}
          animate={{ filter: active ? "brightness(1.02)" : "brightness(0.9)" }}
          transition={{ duration: 0.4 }}
          className="relative w-full"
        >
          <div
            className="absolute -inset-1.5 rounded-lg pointer-events-none"
            style={{
              boxShadow: `0 0 24px ${active ? "rgba(223,255,0,0.08)" : "transparent"}`,
              border: `1px solid ${active ? "rgba(223,255,0,0.18)" : "transparent"}`,
              transition: "all 400ms ease",
            }}
          />
          {/* Animated acid rectangle highlight around Maya's comment
              — the "the system noticed THIS one" hook for the hero.
              Draws its outline in from one corner, sits BEHIND the
              text via zIndex layering, fades out once the chapter-01
              ignite border takes over so the two don't stack. */}
          <AcidRectHighlight active={active} />
          {/* zIndex: 2 keeps the comment content painted ON TOP of the
              acid rectangle; the outline traces the outside of the
              text, letters stay fully legible. */}
          <div
            className="relative flex gap-2 items-start py-1.5"
            style={{ zIndex: 2 }}
          >
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

// The "system noticed this" annotation. A rounded-rect acid outline
// that draws its stroke around Maya's comment from one corner and
// travels the perimeter. Implemented as an SVG <rect> (not a CSS
// border) so we can animate the outline via stroke-dashoffset —
// pathLength="100" normalises the perimeter so the same 100 →
// 0 offset works at any comment dimensions. Positioned with inset
// -10 px + width/height calc so the rect sits just outside the text
// with a small padding gap. The whole SVG carries a drop-shadow
// filter so the drawn stroke itself glows. Content row (parent
// zIndex: 2) sits ON TOP — the outline is BEHIND the letters.
// Fades to 0 once igniteProgress > 0.15 so it doesn't stack with
// the chapter-01 highlight border above.
function AcidRectHighlight({ active }: { active: boolean }) {
  return (
    <motion.svg
      aria-hidden
      style={{
        position: "absolute",
        inset: "-10px",
        width: "calc(100% + 20px)",
        height: "calc(100% + 20px)",
        overflow: "visible",
        pointerEvents: "none",
        filter:
          "drop-shadow(0 0 6px rgba(223,255,0,0.7)) drop-shadow(0 0 14px rgba(223,255,0,0.35))",
        zIndex: 1,
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: active ? 0 : 1 }}
      transition={{ duration: 0.35 }}
    >
      <rect
        x="2"
        y="2"
        rx="10"
        ry="10"
        fill="none"
        stroke="#DFFF00"
        strokeWidth={2}
        pathLength={100}
        strokeDasharray="100"
        strokeDashoffset="100"
        style={{
          width: "calc(100% - 4px)",
          height: "calc(100% - 4px)",
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="100"
          to="0"
          dur="0.8s"
          fill="freeze"
          begin="0.3s"
        />
      </rect>
    </motion.svg>
  );
}
