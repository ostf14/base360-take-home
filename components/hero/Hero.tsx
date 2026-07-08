"use client";
import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";
import { Canvas, activeChapterAt } from "./Canvas";
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

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Dominance-based flip: chapter (i+1) becomes "current" when the
    // outgoing surface has faded to 0 and the incoming is just starting
    // to fade up (midpoint of the handoff window in Canvas). Fixes the
    // lag where node 01 stayed lit while DM was already on screen.
    const next = activeChapterAt(v, CHAPTERS.length);
    setActiveChapter((prev) => (next !== prev ? next : prev));
  });

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
          />
        </div>
      </div>
    </section>
  );
}
