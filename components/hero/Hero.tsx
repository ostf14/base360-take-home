"use client";
import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";
import { Canvas } from "./Canvas";
import { CopyColumn } from "./CopyColumn";

// The scroll-story hero. Owns the single source of scroll truth
// (scrollYProgress) and derives the active chapter. Everything downstream —
// surfaces, copy, stepper, and the shared-layout Maya morph — is driven off
// this one value.
export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const [activeChapter, setActiveChapter] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor(v * CHAPTERS.length))
    );
    setActiveChapter((prev) => (next === prev ? prev : next));
  });

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
