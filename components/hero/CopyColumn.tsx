"use client";
import { AnimatePresence, motion, MotionValue } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";
import { Stepper } from "./Stepper";

interface Props {
  activeChapter: number;
  scrollYProgress: MotionValue<number>;
}

export function CopyColumn({ activeChapter, scrollYProgress }: Props) {
  const chapter = CHAPTERS[activeChapter];

  return (
    <div className="relative h-full flex flex-col justify-between py-16 pl-8 pr-6 gap-10">
      {/* top: kicker + headline + subcopy that swap on active chapter */}
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
            <div
              className="text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
              style={{ color: "var(--acid)" }}
            >
              <span className="w-1.5 h-1.5 bg-acid inline-block" />
              {chapter.kicker}
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

      {/* bottom: persistent vertical stepper */}
      <Stepper activeChapter={activeChapter} scrollYProgress={scrollYProgress} />
    </div>
  );
}
