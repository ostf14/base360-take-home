"use client";
import { motion } from "framer-motion";
import { MayaAvatar } from "../MayaAvatar";

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
  isActive: boolean;
  progress: number;
}

export function DmSurface({ isActive, progress }: Props) {
  return (
    <div className="absolute inset-0 flex items-stretch justify-end p-6 pt-12">
      <div
        className="relative w-[62%] h-full flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
        }}
      >
        {/* DM header — Base360's view of the brand's inbox: Maya is the contact */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "var(--hairline)" }}
        >
          {isActive ? (
            <motion.div layoutId="maya-lead" className="shrink-0">
              <MayaAvatar size={32} />
            </motion.div>
          ) : (
            <MayaAvatar size={32} />
          )}
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-text-hi font-semibold">@maya.r</span>
            <span className="text-[10px] font-mono text-text-lo">
              tiktok · direct message
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-sm"
              style={{
                color: "var(--acid)",
                background: "var(--acid-soft)",
                border: "1px solid var(--acid)",
              }}
            >
              AI Agent
            </span>
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
          {THREAD.map((m, i) => (
            <DmBubble key={i} m={m} show={progress > m.delay / 2.2} />
          ))}
          {progress > 0.85 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[10px] font-mono text-text-lo mt-auto"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-acid live-dot" />
              agent replying · 2.4s avg
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function DmBubble({ m, show }: { m: Msg; show: boolean }) {
  const isMaya = m.from === "maya";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2 items-end ${isMaya ? "justify-end" : "justify-start"}`}
    >
      {!isMaya && (
        <div className="w-6 h-6 rounded-full bg-acid text-black flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
          N
        </div>
      )}
      <div className="max-w-[80%]">
        {!isMaya && (
          <div className="flex items-center gap-1 mb-0.5">
            <span
              className="text-[9px] font-mono uppercase px-1 py-0.5 rounded-sm"
              style={{ color: "var(--acid)", border: "1px solid var(--acid)" }}
            >
              AI
            </span>
          </div>
        )}
        <div
          className={`px-3 py-2 text-sm rounded-2xl ${
            isMaya ? "rounded-br-sm" : "rounded-bl-sm"
          }`}
          style={{
            background: isMaya ? "var(--acid)" : "var(--surface-2)",
            color: isMaya ? "#0A0A0B" : "var(--text-hi)",
          }}
        >
          {m.text}
        </div>
      </div>
      {isMaya && <MayaAvatar size={22} />}
    </motion.div>
  );
}
