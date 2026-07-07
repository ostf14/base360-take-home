"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { useId } from "react";
import { THREAD_PATH_D } from "./dockPositions";

interface Props {
  scrollYProgress: MotionValue<number>;
}

// ONE svg, ONE path. Reveals as scroll progresses.
// Trick: pathLength on the visible dashed path is overwritten by Framer, so we
// render two paths — an ANIMATED solid mask path with pathLength drives what's
// visible, and a static PIXEL-DASHED path lives inside that mask. Pattern
// integrity preserved, reveal driven by one scroll motion value.
export function Thread({ scrollYProgress }: Props) {
  const maskId = useId();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="-2" y="-2" width="104" height="104" fill="black" />
          <motion.path
            d={THREAD_PATH_D}
            fill="none"
            stroke="white"
            strokeWidth={4}
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
        </mask>
      </defs>

      {/* Soft acid glow behind the dotted line (also masked) */}
      <g mask={`url(#${maskId})`}>
        <path
          d={THREAD_PATH_D}
          fill="none"
          stroke="var(--acid)"
          strokeWidth={5}
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.25, filter: "blur(3px)" }}
        />
        {/* Pixel-dotted acid line — square dashes, no rounded ends */}
        <path
          d={THREAD_PATH_D}
          fill="none"
          stroke="var(--acid)"
          strokeWidth={2}
          strokeLinecap="butt"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
