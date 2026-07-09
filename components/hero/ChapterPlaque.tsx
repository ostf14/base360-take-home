"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CHAPTERS, Chapter } from "@/lib/chapters";

interface Props {
  activeChapter: number;
}

// Splits "> STEP 01 / 06 — THE COMMENT" into ("01 / 06", "THE COMMENT").
// Same shape used in the old CopyColumn kicker split — keeps the copy in
// lib/chapters.ts untouched.
function splitKicker(kicker: string): { counter: string; name: string } {
  const parts = kicker.split(" — ");
  if (parts.length < 2) return { counter: "", name: kicker };
  const counter = parts[0]
    .replace(/^>\s*/, "")
    .replace(/^STEP\s+/i, "");
  return { counter, name: parts.slice(1).join(" — ") };
}

// Splits headline around chapter.accent so the accent word/phrase renders
// in acid and everything else stays in --text-hi. Falls back to plain if
// the accent isn't found.
function splitAccent(headline: string, accent?: string) {
  if (!accent) return { pre: headline, hit: "", post: "" };
  const i = headline.indexOf(accent);
  if (i < 0) return { pre: headline, hit: "", post: "" };
  return {
    pre: headline.slice(0, i),
    hit: headline.slice(i, i + accent.length),
    post: headline.slice(i + accent.length),
  };
}

// The centered chapter plaque — semi-transparent dark card that lies over
// the lower part of the centered surface. Kicker + moderate headline (with
// one acid accent word) + one-line subcopy on the left, "Get early access"
// CTA on the right. Content swaps with AnimatePresence keyed on chapter.id
// so every field crossfades together on step change.
export function ChapterPlaque({ activeChapter }: Props) {
  const idx = Math.max(0, Math.min(activeChapter, CHAPTERS.length - 1));
  const chapter = CHAPTERS[idx];
  return (
    <div
      className="relative"
      style={{
        width: 560,
        borderRadius: 14,
        background: "rgba(15,15,18,0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow:
          "0 10px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "16px 20px",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <PlaqueBody chapter={chapter} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PlaqueBody({ chapter }: { chapter: Chapter }) {
  const { counter, name } = splitKicker(chapter.kicker);
  const { pre, hit, post } = splitAccent(chapter.headline, chapter.accent);
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div
          className="text-[10px] font-mono uppercase tracking-[0.22em] inline-flex items-center gap-2"
          style={{ color: "var(--acid)" }}
        >
          <span
            aria-hidden
            className="inline-block"
            style={{ width: 6, height: 6, background: "var(--acid)" }}
          />
          <span style={{ color: "var(--text-lo)" }}>{counter}</span>
          <span style={{ color: "var(--text-lo)" }}>—</span>
          <span
            style={{
              color: "var(--acid)",
              textShadow: "0 0 12px rgba(223,255,0,0.28)",
              fontWeight: 700,
            }}
          >
            {name}
          </span>
        </div>
        <div
          className="font-display font-bold"
          style={{
            color: "var(--text-hi)",
            fontSize: 28,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
          }}
        >
          {pre}
          {hit && (
            <span
              style={{
                color: "var(--acid)",
                textShadow: "0 0 18px rgba(223,255,0,0.35)",
              }}
            >
              {hit}
            </span>
          )}
          {post}
        </div>
        <div
          className="text-[13px] leading-snug"
          style={{ color: "var(--text-lo)" }}
        >
          {chapter.subcopy}
        </div>
      </div>
      <a
        href="#waitlist"
        className="group shrink-0 inline-flex items-center gap-2 font-mono uppercase text-[11px] px-4 py-2.5 tracking-wider self-center"
        style={{
          background: "var(--acid)",
          color: "#0A0A0B",
          boxShadow: "0 0 24px rgba(223,255,0,0.35)",
          fontWeight: 700,
        }}
      >
        Get early access
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </a>
    </div>
  );
}
