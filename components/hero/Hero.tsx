"use client";
import { useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";
import { Canvas, activeChapterAt } from "./Canvas";
import { CopyColumn } from "./CopyColumn";
import { Stepper } from "./Stepper";

// The pinned scroll stage now has 7 frames: a NEW chapter-00 hero
// prepended in front of the existing 6 story chapters. The single
// scrollYProgress is remapped so all downstream story math
// (surfaceState, MayaOverlay keyframes, stepper fill, activeChapter)
// keeps its original S = 1/6 basis unchanged — we just feed it a
// story-local time that stays at 0 while the hero is on screen.
const STORY_FRAMES = CHAPTERS.length; // 6
const TOTAL_FRAMES = STORY_FRAMES + 1; // 7
const HERO_END = 1 / TOTAL_FRAMES;
// Width of the hero → story handoff window (as a fraction of full
// scrollYProgress). Short so the giant headline fades cleanly and the
// phone slides to its story dock without a long tween.
const HERO_HANDOFF = 0.04;

// The scroll-story hero. Owns the single source of scroll truth
// (scrollYProgress) and derives the active chapter. Everything downstream —
// surfaces, copy, stepper, and the single always-mounted Maya overlay — is
// driven off this one value, remapped for the +1 hero frame.
export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // Story-local time: 0 during hero, then linearly [0, 1] across the
  // six story chapters. Everything story-side receives storyT, not
  // scrollYProgress, so their S = 1/6 constants stay honest.
  const storyT = useTransform(scrollYProgress, [0, HERO_END, 1], [0, 0, 1]);

  // Hero opacity/scale — fade + slight shrink at the boundary.
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    [1, 1, 0],
  );
  const heroScale = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    [1, 1, 0.92],
  );
  // Story chrome (copy col + stepper) and canvas frame chrome fade IN
  // over the same window so the two swap in one beat.
  const storyChromeOpacity = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    [0, 0, 1],
  );

  // Phone transform. Its NATURAL position is the story dock (right canvas
  // column). During hero it's translated left toward viewport-center and
  // a smaller amount down so its TOP sits higher and the full TikTok feed
  // — video + brand caption + comments row including Maya — is visible
  // above the bottom crop.
  //   -21vw is roughly viewport-center minus canvas-col-center on desktop
  //   widths (1024–1920); +22vh raises the phone (was +40vh) so Maya's
  //   comment sits clearly on-screen, with the very bottom of the shell
  //   still cropping past the viewport foot for the rising-out-of-black
  //   read.
  const phoneX = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    ["-21vw", "-21vw", "0vw"],
  );
  const phoneY = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    ["22vh", "22vh", "0vh"],
  );

  // Chapter tracking. -1 during hero means Stepper renders every node as
  // future (no active) and no copy is fed to CopyColumn's animation key
  // change. From chapter 01 onward the dominance-based derivation
  // matches the surface actually on screen.
  const [activeChapter, setActiveChapter] = useState<number>(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < HERO_END - 0.002) {
      setActiveChapter((prev) => (prev !== -1 ? -1 : prev));
      return;
    }
    const local = (v - HERO_END) / (1 - HERO_END);
    const next = activeChapterAt(local, STORY_FRAMES);
    setActiveChapter((prev) => (next !== prev ? next : prev));
  });

  return (
    <section
      ref={stageRef}
      aria-label="Base360 product story"
      className="relative"
      style={{ height: `${TOTAL_FRAMES * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Story chrome layer (copy col + stepper). Grid layout matches
            the persistent canvas grid below so alignment is identical
            when the chrome fades in. */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: storyChromeOpacity }}
        >
          <div className="relative h-full grid grid-cols-[minmax(380px,38%)_64px_1fr]">
            <CopyColumn activeChapter={Math.max(0, activeChapter)} />
            <Stepper
              activeChapter={activeChapter}
              scrollYProgress={storyT}
            />
            <div />
          </div>
        </motion.div>

        {/* Hero radial glow — soft violet → acid pool behind the phone,
            large blur, low opacity. Reads as light spilling from the
            screen; fades out with the rest of the hero. */}
        <HeroGlow heroOpacity={heroOpacity} />

        {/* GIANT HEADLINE. Sits near the TOP of the viewport just below
            the nav — not vertically centered — so the phone can rise
            below it without competing for the same vertical band.
            Fades and shrinks slightly at the boundary. Rendered BEFORE
            the phone in JSX so the phone paints on top if any overlap
            occurs at compact viewport heights. */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none flex flex-col items-center px-6 pt-24"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            transformOrigin: "50% 20%",
          }}
        >
          <GiantHeadline />
        </motion.div>

        {/* PERSISTENT PHONE. The Canvas contains all six story surfaces
            but only chapter 0 (TikTok) is visible at storyT=0. It slides
            from its hero position (viewport-center, rising from bottom)
            into its story dock (right canvas column) at the 00 → 01
            boundary — one continuous element, never remounted. Canvas
            frame chrome is faded via chromeOpacity so during hero the
            phone reads as a floating device, not a boxed panel. */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full grid grid-cols-[minmax(380px,38%)_64px_1fr]">
            <div />
            <div />
            <motion.div
              style={{ x: phoneX, y: phoneY }}
              className="relative h-full pointer-events-auto"
            >
              <Canvas
                scrollYProgress={storyT}
                activeChapter={Math.max(0, activeChapter)}
                chromeOpacity={storyChromeOpacity}
              />
            </motion.div>
          </div>
        </div>

        {/* Single acid ↓ scroll cue, centered near the bottom. Only
            scroll hint in the hero — no plaque, no text, just the
            arrow. Fades with the rest of the hero. */}
        <motion.div
          className="absolute inset-x-0 flex justify-center pointer-events-none"
          style={{ bottom: 34, opacity: heroOpacity, zIndex: 20 }}
          aria-hidden
        >
          <span
            className="font-mono leading-none"
            style={{
              color: "var(--acid)",
              fontSize: 26,
              textShadow: "0 0 12px rgba(223, 255, 0, 0.5)",
            }}
          >
            ↓
          </span>
        </motion.div>

        {/* Bottom corner marks — no text, just two 12 × 12 outlined
            squares that mirror the inactive-stepper node style. Purely
            visual balance for the corners; the pain-and-solution
            copy already lives in the headline + solution line above. */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-10 pointer-events-none"
          style={{ opacity: heroOpacity }}
        >
          <CornerSquare />
          <CornerSquare />
        </motion.div>
      </div>
    </section>
  );
}

function CornerSquare() {
  return (
    <div
      aria-hidden
      style={{
        width: 12,
        height: 12,
        background: "var(--bg)",
        border: "1px solid var(--hairline)",
      }}
    />
  );
}

// Two-line heavy uppercase grotesk, tight leading, on ONE line each.
// clamp(48, 7vw, 104) keeps the size dramatic across desktop widths.
// The acid textShadow gives line 1 a subtle screen-lit halo without
// resorting to a fill on line 2 (which stays clean white).
function GiantHeadline() {
  return (
    <div
      className="flex flex-col items-center gap-1 font-display font-bold uppercase"
      style={{
        fontSize: "clamp(48px, 7vw, 104px)",
        lineHeight: 0.9,
        letterSpacing: "-0.02em",
      }}
    >
      <div
        className="whitespace-nowrap"
        style={{
          color: "var(--acid)",
          textShadow: "0 0 40px rgba(223,255,0,0.32)",
        }}
      >
        Next buyer commented
      </div>
      <div
        className="whitespace-nowrap"
        style={{ color: "var(--text-hi)" }}
      >
        Nobody replied
      </div>
    </div>
  );
}

function HeroGlow({ heroOpacity }: { heroOpacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: heroOpacity }}
    >
      <div
        className="absolute left-1/2"
        style={{
          bottom: "-18%",
          width: 900,
          height: 900,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle at center, rgba(155,90,220,0.24) 0%, rgba(223,255,0,0.10) 34%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </motion.div>
  );
}
