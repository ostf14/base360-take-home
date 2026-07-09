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
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-16 pb-12">
      {/* Small telephony HUD in the top corner — mono, static, feels like an
          in-call OS overlay, not a dashboard. */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-lo/70">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--text-lo)" }}
          />
          in call
        </div>
        <span className="text-text-lo">
          base360 · ai voice · outbound
        </span>
        <span className="text-text-hi/80">00:47</span>
      </div>

      {/* Callee identity block: Maya + name + phone. */}
      <div className="flex flex-col items-center gap-3 mb-10">
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

      {/* Transcript ticker. The AI voice is the focus of the frame —
          same acid treatment as the DM outgoing bubbles and the TikTok
          public reply: a solid acid "AI" chip + a 2px acid left stripe
          + full-brightness text. Maya's incoming lines stay neutral so
          the eye tracks what the agent is saying. */}
      <div className="mt-10 w-full max-w-2xl flex flex-col gap-2 min-h-[110px]">
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
                      paddingLeft: 10,
                    }
                  : { paddingLeft: 12 }
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
                  className="font-mono uppercase text-[9px] shrink-0 mt-0.5 tracking-widest"
                  style={{ color: "var(--text-lo)" }}
                >
                  MAYA
                </span>
              )}
              <span
                className={`leading-snug ${
                  isAI ? "text-text-hi" : "text-text-hi/70"
                }`}
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
      style={{ height: 120 }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Deterministic pseudo-random per-bar heights
        const seed = (i * 9301 + 49297) % 233280;
        const rand = seed / 233280;
        // Center of the bar row is the loudest
        const distFromCenter = Math.abs(i - bars / 2) / (bars / 2);
        const envelope = 1 - distFromCenter * 0.7;
        const active = progress > i / bars - 0.05;
        const h = active ? 12 + rand * 90 * envelope : 4;
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
            style={{ height: 4 }}
          />
        );
      })}
    </div>
  );
}
