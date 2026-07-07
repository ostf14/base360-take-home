"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/chapters";

interface Props {
  activeChapter: number;
  scrollYProgress: MotionValue<number>;
}

const NODE_LABELS = ["Comment", "DM", "CRM", "AI Call", "Nurture", "One system"];

export function Stepper({ activeChapter, scrollYProgress }: Props) {
  const fillWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo">
        one comment → closed
      </div>
      <div className="relative">
        {/* Track background */}
        <div
          className="absolute top-1.5 left-0 right-0 h-px"
          style={{ background: "var(--hairline)" }}
        />
        {/* Filled acid track — mirrors right-side thread progress */}
        <motion.div
          className="absolute top-1.5 left-0 h-px"
          style={{
            background: "var(--acid)",
            width: fillWidth,
            boxShadow: "0 0 6px rgba(223,255,0,0.6)",
          }}
        />
        <div className="relative flex justify-between">
          {CHAPTERS.map((_, i) => {
            const active = i <= activeChapter;
            const current = i === activeChapter;
            return (
              <div key={i} className="flex flex-col items-center gap-2 relative">
                <motion.div
                  initial={false}
                  animate={{
                    background: active ? "var(--acid)" : "var(--bg)",
                    borderColor: active ? "var(--acid)" : "var(--hairline)",
                    scale: current ? 1.25 : 1,
                    boxShadow: current
                      ? "0 0 12px rgba(223,255,0,0.7)"
                      : "0 0 0 rgba(223,255,0,0)",
                  }}
                  transition={{ duration: 0.28 }}
                  className="w-3 h-3 relative"
                  style={{
                    border: "1px solid",
                  }}
                />
                <span
                  className={`text-[10px] font-mono uppercase transition-colors ${
                    active ? "text-text-hi" : "text-text-lo"
                  }`}
                >
                  {NODE_LABELS[i]}
                </span>
                <span
                  className={`text-[9px] font-mono ${
                    current ? "text-acid" : "text-text-lo/60"
                  }`}
                >
                  0{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
