"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";
import { Canvas } from "./Canvas";
import { CopyColumn } from "./CopyColumn";
import { Stepper } from "./Stepper";

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
        {/* Three-column pinned viewport: copy | vertical stepper rail | canvas.
            The rail IS the divider between the reading side and the story
            stage — no separate seam line needed. */}
        <div className="relative h-full grid grid-cols-[minmax(380px,38%)_64px_1fr]">
          <CopyColumn activeChapter={activeChapter} />
          <Stepper
            activeChapter={activeChapter}
            scrollYProgress={scrollYProgress}
          />
          <Canvas
            scrollYProgress={scrollYProgress}
            activeChapter={activeChapter}
            glitching={glitching}
          />
        </div>
      </div>
    </section>
  );
}
