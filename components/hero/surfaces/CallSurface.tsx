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

// The call surface is intentionally NAKED — no window chrome, no panel, no
// bezel. Just a dark canvas with a huge centered waveform and Maya at the top.
// Reads as telephony, not an app. The visual quiet also makes the next
// hand-off to the enterprise Email view feel bigger.
export function CallSurface({ progress, anchorRef }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-24 pb-16">
      {/* HUD row (IN CALL / status / 00:47 timer) removed — it lived
          at navbar height and read as noise stacked on top of the
          nav links. The frame now leads straight with the callee
          identity block. */}

      {/* Callee identity block: Maya + name + phone. */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <MayaAnchor anchorRef={anchorRef} />
        <div className="text-2xl font-display text-text-hi">Maya R.</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo">
          +1 · 416 · ●●● ●●●●
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo/70">
          agent · ai voice
        </div>
      </div>

      {/* Huge centered waveform */}
      <BigWaveform progress={progress} />

      {/* Transcript ticker. The AI voice keeps its acid treatment —
          solid acid "AI" chip + 2 px acid left stripe + bright text —
          so the eye lands on what the agent is saying first. Maya's
          incoming lines stay neutral (no acid), but their text is
          near-white so the back-and-forth rhythm is legible, not a
          bright line answered by an invisible one. gap-6 (24 px)
          gives every turn a clear vertical beat of air. */}
      <div className="mt-6 w-full max-w-2xl flex flex-col gap-6 min-h-[110px]">
        {TRANSCRIPT.map((line, i) => {
          const isAI = line.who === "ai";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{
                opacity: progress > 0.15 + i * 0.18 ? 1 : 0.15,
                y: 0,
              }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2.5 text-[12px]"
              style={
                isAI
                  ? {
                      borderLeft: "2px solid var(--acid)",
                      // 2 px border + 10 px pad = 12 px inset, matches
                      // Maya's `var(--space-3)` padding on the neutral row.
                      paddingLeft: "calc(var(--space-3) - 2px)",
                    }
                  : { paddingLeft: "var(--space-3)" }
              }
            >
              {isAI ? (
                <span
                  className="font-mono uppercase text-[9px] shrink-0 mt-0.5 font-bold px-1.5 py-0.5 rounded-sm tracking-widest"
                  style={{
                    color: "#0A0A0B",
                    background: "var(--acid)",
                  }}
                >
                  AI
                </span>
              ) : (
                <span
                  className="font-mono uppercase text-[10px] shrink-0 mt-0.5 tracking-widest font-bold"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  MAYA
                </span>
              )}
              <span
                className="leading-snug"
                style={{
                  color: isAI ? "var(--text-hi)" : "#D6D6DA",
                }}
              >
                {line.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Call controls — muted, static, no chrome */}
      <div className="mt-auto flex items-center gap-6 text-text-lo/70">
        {["mute", "keypad", "speaker", "add"].map((label) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <span
              className="w-11 h-11 flex items-center justify-center rounded-full text-lg"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--hairline)",
              }}
            >
              ·
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest">
              {label}
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5 ml-4">
          <span
            className="w-11 h-11 flex items-center justify-center rounded-full text-white"
            style={{
              background: "rgba(220,60,60,0.8)",
              border: "1px solid rgba(255,80,80,0.9)",
            }}
          >
            ✕
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-lo">
            end
          </span>
        </div>
      </div>
    </div>
  );
}

function BigWaveform({ progress }: { progress: number }) {
  const bars = 72;
  return (
    <div
      className="w-full max-w-xl flex items-center justify-center gap-[3px]"
      style={{ height: 56 }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Deterministic pseudo-random per-bar heights
        const seed = (i * 9301 + 49297) % 233280;
        const rand = seed / 233280;
        // Center of the bar row is the loudest
        const distFromCenter = Math.abs(i - bars / 2) / (bars / 2);
        const envelope = 1 - distFromCenter * 0.7;
        const active = progress > i / bars - 0.05;
        // Halved from the earlier 12 + 90-envelope spec so the
        // waveform occupies ~half the vertical room it did before,
        // freeing space so the full four-turn transcript below
        // fits above the call-controls foot without clipping the
        // last "ok show me" line.
        const h = active ? 6 + rand * 44 * envelope : 3;
        return (
          <motion.span
            key={i}
            animate={{
              height: h,
              background: active
                ? "rgba(244,244,245,0.35)"
                : "rgba(255,255,255,0.05)",
            }}
            transition={{ duration: 0.35 }}
            className="w-[3px] rounded-sm"
            style={{ height: 3 }}
          />
        );
      })}
    </div>
  );
}
