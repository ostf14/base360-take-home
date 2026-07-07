"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";
import { Canvas } from "./Canvas";
import { CopyColumn } from "./CopyColumn";

// The scroll-story hero. Owns the single source of scroll truth
// (scrollYProgress) and derives the active chapter. Everything downstream —
// surfaces, copy, stepper, and the single always-mounted Maya overlay — is
// driven off this one value.
export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const [activeChapter, setActiveChapter] = useState(0);
  const [glitching, setGlitching] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor(v * CHAPTERS.length))
    );
    setActiveChapter((prev) => {
      if (next !== prev) setGlitching(true);
      return next;
    });
  });

  useEffect(() => {
    if (!glitching) return;
    const id = window.setTimeout(() => setGlitching(false), 220);
    return () => window.clearTimeout(id);
  }, [glitching]);

  return (
    <section
      ref={stageRef}
      aria-label="Base360 product story"
      className="relative"
      style={{ height: `${CHAPTERS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full grid grid-cols-[minmax(420px,42%)_1fr]">
          <CopyColumn
            activeChapter={activeChapter}
            scrollYProgress={scrollYProgress}
          />
          <Canvas
            scrollYProgress={scrollYProgress}
            activeChapter={activeChapter}
            glitching={glitching}
          />
          {/* Single 1px acid hairline at the seam between copy and canvas —
              a static, honest continuity marker, no dashed debris. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-16 bottom-16 left-[42%] w-px"
            style={{ background: "var(--acid)", opacity: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
}
