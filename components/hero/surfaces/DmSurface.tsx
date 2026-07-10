"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";
import { PhoneShell } from "../shells/PhoneShell";

interface Msg {
  from: "maya" | "ai";
  text: string;
  delay: number;
}

const THREAD: Msg[] = [
  { from: "ai", text: "hey Maya 👋 saw your comment — it's the 22oz insulated, $32.", delay: 0.15 },
  { from: "maya", text: "wait, got it in black?", delay: 0.45 },
  { from: "ai", text: "black's our top seller — in stock, ships in 24h. code MAYA10 for you.", delay: 0.9 },
  { from: "maya", text: "ok send the link 😍", delay: 1.35 },
  { from: "ai", text: "https://northbloom.co/black · saved to your cart 🛒", delay: 1.8 },
];

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

export function DmSurface({ progress, anchorRef }: Props) {
  return (
    <PhoneShell platform="instagram">
      {/* DM contact header — the LEAD (@maya.r + fox avatar) on the
          left with clear vertical spacing between handle and
          subtitle. No right-side "AI AGENT" chip: it added noise and
          the point (that the reply is from the AI) is carried by the
          acid emphasis on the outgoing bubbles below. */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "var(--hairline)" }}
      >
        <span className="text-[13px] font-mono text-text-lo/70">‹</span>
        <MayaAnchor anchorRef={anchorRef} />
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-text-hi font-semibold leading-none">
            @maya.r
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-lo leading-none">
            tiktok · direct message
          </span>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col gap-2.5 px-3 py-3 overflow-hidden">
        {THREAD.map((m, i) => (
          <DmBubble key={i} m={m} show={progress > m.delay / 2.2} />
        ))}
        {progress > 0.85 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[9px] font-mono text-text-lo mt-2"
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--text-lo)" }}
            />
            agent replying · 2.4s avg
          </motion.div>
        )}
      </div>

      {/* Composer */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-t"
        style={{ borderColor: "var(--hairline)" }}
      >
        <span
          className="w-7 h-7 flex items-center justify-center rounded-full text-text-lo/80 text-sm"
          style={{ background: "var(--surface-2)" }}
        >
          +
        </span>
        <div
          className="flex-1 px-3 py-1.5 rounded-full text-[11px] text-text-lo/70"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
          }}
        >
          Message…
        </div>
        <span className="text-[13px] text-text-lo/70">↑</span>
      </div>
    </PhoneShell>
  );
}

function DmBubble({ m, show }: { m: Msg; show: boolean }) {
  // AI operator's inbox view: Maya's messages come IN on the LEFT
  // (neutral off-white bubble); the AI's replies go OUT on the RIGHT
  // with acid emphasis — acid AI tag over an acid-tinted, acid-bordered
  // bubble, so the eye tracks what the agent is doing.
  const isIncoming = m.from === "maya";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-1.5 items-end ${
        isIncoming ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[76%] flex flex-col gap-0.5 ${
          isIncoming ? "items-start" : "items-end"
        }`}
      >
        {!isIncoming && (
          <span
            className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm tracking-widest"
            style={{
              color: "#0A0A0B",
              background: "var(--acid)",
            }}
          >
            AI
          </span>
        )}
        <div
          className={`px-3 py-1.5 text-[12px] leading-snug rounded-xl ${
            isIncoming ? "rounded-bl-sm" : "rounded-br-sm"
          }`}
          style={
            isIncoming
              ? {
                  background: "rgba(244, 244, 245, 0.92)",
                  color: "#0A0A0B",
                }
              : {
                  background: "rgba(223, 255, 0, 0.10)",
                  color: "var(--text-hi)",
                  border: "1px solid rgba(223, 255, 0, 0.32)",
                  boxShadow: "0 0 16px rgba(223, 255, 0, 0.08)",
                }
          }
        >
          {m.text}
        </div>
      </div>
    </motion.div>
  );
}
