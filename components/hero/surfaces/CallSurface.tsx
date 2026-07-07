"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

const TRANSCRIPT = [
  { who: "ai", text: "Hi Maya, this is Base from Northbloom — you asked about the black bottle?" },
  { who: "maya", text: "yeah, does it keep drinks cold on hikes?" },
  { who: "ai", text: "18 hours cold, 12 hot. Double-vacuum steel — walking you through it now on the site." },
  { who: "maya", text: "ok show me" },
];

export function CallSurface({ progress, anchorRef }: Props) {
  return (
    <div className="absolute inset-0 p-6 pt-12 flex">
      <div
        className="flex-1 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "var(--hairline)" }}
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo">
            base360 / voice / outbound
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-acid live-dot" />
            <span className="text-[10px] font-mono uppercase text-acid">
              connected · 00:47
            </span>
          </div>
        </div>

        {/* Call body */}
        <div className="flex-1 grid grid-cols-[220px_1fr] gap-4 p-6 min-h-0">
          {/* Left — callee. Anchor slot marks where the overlay Maya lands. */}
          <div className="flex flex-col items-center gap-3">
            <MayaAnchor anchorRef={anchorRef} />
            <div className="text-lg font-display text-text-hi">Maya R.</div>
            <div className="text-[10px] font-mono text-text-lo">+1 · 416 · ●●● ●●●●</div>
            <div className="mt-2 text-[10px] font-mono uppercase text-text-lo">
              agent
            </div>
            <div
              className="text-xs font-mono uppercase px-2 py-1 rounded-sm"
              style={{
                color: "var(--acid)",
                border: "1px solid var(--acid)",
                background: "var(--acid-soft)",
              }}
            >
              AI VOICE
            </div>
          </div>

          {/* Right — waveform + transcript */}
          <div className="flex flex-col gap-3 min-h-0">
            <Waveform progress={progress} />
            <div
              className="flex-1 rounded-xl p-4 overflow-hidden flex flex-col gap-2"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
              }}
            >
              <div className="text-[10px] font-mono uppercase text-text-lo">
                live transcript
              </div>
              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {TRANSCRIPT.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{
                      opacity: progress > 0.15 + i * 0.18 ? 1 : 0.15,
                      y: 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span
                      className="font-mono uppercase text-[9px] px-1 py-0.5 rounded-sm shrink-0"
                      style={{
                        color: line.who === "ai" ? "var(--acid)" : "var(--text-lo)",
                        border:
                          line.who === "ai"
                            ? "1px solid var(--acid)"
                            : "1px solid var(--hairline)",
                      }}
                    >
                      {line.who === "ai" ? "AI" : "MAYA"}
                    </span>
                    <span className="text-text-hi">{line.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Waveform({ progress }: { progress: number }) {
  const bars = 44;
  return (
    <div
      className="rounded-xl p-4 flex items-end justify-between gap-[3px] h-24"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rand = seed / 233280;
        const active = progress > i / bars - 0.05;
        const h = active ? 20 + rand * 60 : 6;
        return (
          <motion.span
            key={i}
            animate={{
              height: h,
              background: active ? "var(--acid)" : "rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.4 }}
            className="w-[3px] rounded-sm"
            style={{ height: 6 }}
          />
        );
      })}
    </div>
  );
}
