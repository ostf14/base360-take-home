"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CHAPTERS, Chapter } from "@/lib/chapters";

interface Props {
  activeChapter: number;
}

// Splits a headline around chapter.accent so the accent phrase renders
// in --acid and everything else in --text-hi. Falls back to plain if
// the accent isn't found so a bad copy edit never crashes the render.
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

// The centered chapter plaque — semi-transparent dark card lying over
// the lower part of the centered surface. Content is STRIPPED to just
// two rows: the one-line chapter headline (with one acid accent
// phrase) and a one-line subcopy. No kicker, no CTA — the plaque
// exists to summarize the step in the fewest possible words. Content
// swaps with AnimatePresence keyed on chapter.id so both rows
// crossfade together at each boundary.
export function ChapterPlaque({ activeChapter }: Props) {
  const idx = Math.max(0, Math.min(activeChapter, CHAPTERS.length - 1));
  const chapter = CHAPTERS[idx];
  return (
    <div
      className="relative"
      style={{
        width: 620,
        borderRadius: 14,
        background: "rgba(15,15,18,0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow:
          "0 10px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "18px 24px",
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
  const { pre, hit, post } = splitAccent(chapter.headline, chapter.accent);
  return (
    <div className="flex flex-col gap-1.5">
      {/* Headline — ONE LINE guaranteed. nowrap + trimmed copy in
          lib/chapters.ts means the headline never wraps at 24 px. */}
      <div
        className="font-display font-bold whitespace-nowrap"
        style={{
          color: "var(--text-hi)",
          fontSize: 24,
          lineHeight: 1.2,
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
      {/* Subcopy — muted supporting line. Kept short (already tuned
          in lib/chapters.ts) so it also stays on one line at this
          width; if a future edit overflows, it wraps to two, no
          hard clip. */}
      <div
        className="text-[13px] leading-snug"
        style={{ color: "var(--text-lo)" }}
      >
        {chapter.subcopy}
      </div>
    </div>
  );
}
