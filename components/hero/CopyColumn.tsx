"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";

interface Props {
  activeChapter: number;
}

// The stored kicker is a single flat string like
// "> STEP 01 / 06 — THE COMMENT". Split it into a muted counter that
// recedes ("01 / 06") and a dominant label that reads as the real step
// name ("THE COMMENT"). Falls back gracefully if the em-dash split isn't
// present, so an unusual kicker still renders.
function splitKicker(kicker: string): { counter: string; name: string } {
  const parts = kicker.split(" — ");
  if (parts.length < 2) return { counter: "", name: kicker };
  const counter = parts[0]
    .replace(/^>\s*/, "") // drop the ascii "> "
    .replace(/^STEP\s+/i, ""); // keep just the "NN / 06" pair
  return { counter, name: parts.slice(1).join(" — ") };
}

export function CopyColumn({ activeChapter }: Props) {
  const chapter = CHAPTERS[activeChapter];
  const { counter, name } = splitKicker(chapter.kicker);

  return (
    <div className="relative h-full flex flex-col justify-center gap-8 pl-10 pr-8">
      <div className="flex flex-col gap-6 max-w-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Kicker in two levels:
                 - counter: small, muted mono — recedes as chrome
                 - name:    a step BIGGER, acid, bold — reads as the real
                            label of this step, not part of the code string */}
            <div className="flex flex-col gap-1.5">
              {counter && (
                <div
                  className="text-[10px] font-mono uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-lo)" }}
                >
                  {counter}
                </div>
              )}
              <div
                className="text-sm font-mono uppercase tracking-[0.22em] font-bold inline-flex items-center gap-2"
                style={{
                  color: "var(--acid)",
                  textShadow: "0 0 12px rgba(223,255,0,0.28)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 inline-block"
                  style={{ background: "var(--acid)" }}
                />
                {name}
              </div>
            </div>
            <h1 className="font-display text-5xl leading-[1.02] font-bold text-text-hi tracking-tight">
              {chapter.headline}
            </h1>
            <p className="text-lg text-text-lo leading-snug max-w-[440px]">
              {chapter.subcopy}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Persistent CTA — never moves or changes across chapters */}
        <div className="flex items-center gap-4 mt-2">
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 font-mono uppercase text-xs px-4 py-2.5 tracking-wider"
            style={{
              background: "var(--acid)",
              color: "#0A0A0B",
              boxShadow: "0 0 24px rgba(223,255,0,0.35)",
              fontWeight: 700,
            }}
          >
            Get early access
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
