"use client";
import { useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { CHAPTERS, Surface } from "@/lib/chapters";
import { Canvas, activeChapterAt } from "./Canvas";
import { ChapterPlaque } from "./ChapterPlaque";
import { Stepper } from "./Stepper";

// 7-frame pinned scroll stage: one hero frame + six story chapters.
// A single scrollYProgress feeds everything downstream; storyT is
// scrollYProgress remapped so that all six-chapter math (surfaceState,
// MayaOverlay keyframes, stepper fill, activeChapter) keeps its
// original S = 1/6 basis unchanged — storyT stays at 0 while the hero
// is on screen and animates [0, 1] across the six chapters after.
const STORY_FRAMES = CHAPTERS.length; // 6
const TOTAL_FRAMES = STORY_FRAMES + 1; // 7
const HERO_END = 1 / TOTAL_FRAMES;
const HERO_HANDOFF = 0.04;

// Corner label copy per surface — top-left chip renders as
// "■ {SURFACE} · {CONTEXT}". Matches the tone from the old CornerChrome.
const SURFACE_LABELS: Record<Surface, { surface: string; context: string }> = {
  tiktok: { surface: "TIKTOK", context: "PUBLIC" },
  dm: { surface: "TIKTOK", context: "DM" },
  crm: { surface: "CRM", context: "RECORD" },
  call: { surface: "VOICE", context: "OUTBOUND" },
  email: { surface: "MARKETING", context: "SEQUENCE" },
  system: { surface: "SYSTEM", context: "MAP" },
};

// Centered-surface + headline-plaque template. Every chapter uses the
// same shape: surface centered horizontally (same position as the hero
// phone), bottom melting into the page-bg via a persistent fade, and a
// semi-transparent plaque lying over the lower part of the surface with
// kicker + moderate headline + subcopy + Get-early-access CTA. Stepper
// pinned to the left edge; corner mono labels at the top. Hero →
// chapter-01 is pure vertical continuity — no horizontal jump — because
// both frames render the phone at viewport-center.
export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const storyT = useTransform(scrollYProgress, [0, HERO_END, 1], [0, 0, 1]);

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
  // Story chrome (stepper, corner labels, chapter plaque) fades IN
  // over the hero → ch01 handoff window.
  const storyChromeOpacity = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    [0, 0, 1],
  );

  // Phone stays horizontally centered in both hero and story — the
  // Canvas box is centered on the viewport (max-w mx-auto), so no x
  // translation is needed. Only the vertical rise-from-below during
  // hero remains: the phone starts translated 18 vh DOWN, rises to
  // 0 vh (natural position) as we cross into ch01.
  const phoneY = useTransform(
    scrollYProgress,
    [0, HERO_END - HERO_HANDOFF, HERO_END],
    ["18vh", "18vh", "0vh"],
  );

  // -1 during hero. From ch01 onward the dominance-based derivation
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

  const activeIdx = Math.max(0, activeChapter);
  const chapter = CHAPTERS[activeIdx];
  const label = SURFACE_LABELS[chapter.surface];

  return (
    <section
      ref={stageRef}
      aria-label="Base360 product story"
      className="relative"
      style={{ height: `${TOTAL_FRAMES * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Hero radial glow — soft violet → acid pool behind the phone.
            Fades out with the rest of the hero. */}
        <HeroGlow heroOpacity={heroOpacity} />

        {/* GIANT HEADLINE — hero only. pt-16 keeps it just below the
            nav so both lines fit fully within the viewport at every
            desktop width — no letters cropped left or right — while
            the rising phone still overlaps the bottom of the second
            line at typical heights. */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none flex flex-col items-center px-6 pt-16 z-10"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            transformOrigin: "50% 20%",
          }}
        >
          <GiantHeadline />
        </motion.div>

        {/* PERSISTENT CENTERED SURFACE STACK. Canvas holds all six
            surfaces layered inside a max-w-720 mx-auto box, so the
            active surface is always at viewport center regardless of
            chapter. The motion.div's y translation animates the phone
            "rising from below" during hero, reaching 0 at ch01 —
            because the horizontal position is already correct in both
            frames, the hero → ch01 handoff is pure vertical
            continuity, never a jump. */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <motion.div
            style={{ y: phoneY }}
            className="relative h-full pointer-events-auto"
          >
            <Canvas
              scrollYProgress={storyT}
              activeChapter={activeIdx}
            />
          </motion.div>
        </div>

        {/* Persistent bottom fade. Dissolves any surface's bottom edge
            into the page background so no surface — phone or window —
            ever shows a hard bottom crop. Same treatment as the hero
            phone fade; kept always-on so the visual is continuous
            across the hero → story handoff. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "24vh",
            background:
              "linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,1) 62%)",
            zIndex: 15,
          }}
        />

        {/* STEPPER — left edge, vertical rail. Fades in with story
            chrome. Fixed 72 px column so the rail sits comfortably
            past the left viewport gutter without crowding the
            centered surface. */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
          style={{ opacity: storyChromeOpacity, width: 240 }}
        >
          <Stepper activeChapter={activeChapter} scrollYProgress={storyT} />
        </motion.div>

        {/* CORNER LABELS — top-left "■ SURFACE · CONTEXT",
            top-right "BASE360://MAYA.R". Fade in with story chrome.
            Top offset clears the fixed nav (which is ~64 px tall). */}
        <motion.div
          className="absolute inset-x-0 top-0 z-20 pointer-events-none"
          style={{ opacity: storyChromeOpacity }}
        >
          <CornerLabels label={label} />
        </motion.div>

        {/* HERO plaque — "Base360 catches every comment / WATCH ↓".
            Two-line lower cue. Fades out with the rest of the hero. */}
        <motion.div
          className="absolute inset-x-0 flex justify-center pointer-events-none z-30"
          style={{ bottom: 40, opacity: heroOpacity }}
        >
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div
              className="font-display font-medium"
              style={{
                color: "var(--text-hi)",
                fontSize: 22,
                letterSpacing: "-0.005em",
              }}
            >
              Base360 catches every comment
            </div>
            <div
              className="font-mono uppercase font-bold"
              style={{
                color: "var(--acid)",
                fontSize: 14,
                letterSpacing: "0.22em",
                textShadow: "0 0 12px rgba(223, 255, 0, 0.5)",
              }}
            >
              Watch ↓
            </div>
          </div>
        </motion.div>

        {/* STORY plaque — chapter kicker + moderate headline (with acid
            accent) + one-line subcopy + Get-early-access CTA. Lies
            OVER the lower part of the centered surface, emerging from
            the fade. Semi-transparent dark card, ~560 px wide. */}
        <motion.div
          className="absolute inset-x-0 flex justify-center z-30"
          style={{ bottom: 48, opacity: storyChromeOpacity }}
        >
          <ChapterPlaque activeChapter={activeIdx} />
        </motion.div>
      </div>
    </section>
  );
}

function CornerLabels({
  label,
}: {
  label: { surface: string; context: string };
}) {
  return (
    <div className="flex items-center justify-between px-8 pt-20">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-lo">
        <span className="w-1.5 h-1.5 bg-acid live-dot" />
        <span>
          {label.surface} · {label.context}
        </span>
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo">
        base360://maya.r
      </div>
    </div>
  );
}

// Two-line heavy uppercase grotesk, tight leading. Type is clamped
// by BOTH viewport width and height via min(6vw, 9vh) so the
// longer first line "NEXT BUYER COMMENTED" always fits fully
// within the viewport at every desktop size — the bigger-than-fit
// setting was overflowing horizontally, cropping letters on both
// sides. Max 96 keeps it safely inside padding at ~1024 px widths.
function GiantHeadline() {
  return (
    <div
      className="flex flex-col items-center gap-1 font-display font-bold uppercase"
      style={{
        fontSize: "clamp(50px, min(6.4vw, 9.5vh), 100px)",
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
