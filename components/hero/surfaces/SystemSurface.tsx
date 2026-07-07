"use client";
import { motion } from "framer-motion";

interface Props {
  progress: number;
}

const NODES = [
  { key: "tiktok", label: "TIKTOK", x: 12, y: 30, sub: "comment" },
  { key: "dm", label: "DM", x: 32, y: 15, sub: "conversation" },
  { key: "crm", label: "CRM", x: 52, y: 40, sub: "record" },
  { key: "call", label: "AI CALL", x: 72, y: 20, sub: "voice" },
  { key: "email", label: "EMAIL", x: 82, y: 55, sub: "nurture" },
  { key: "closed", label: "CLOSED · $128", x: 55, y: 75, sub: "won" },
];

export function SystemSurface({ progress }: Props) {
  return (
    <div className="absolute inset-0 p-6 pt-12 flex">
      <div
        className="relative flex-1 rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
        }}
      >
        <div className="absolute top-4 left-5 text-[10px] font-mono uppercase tracking-widest text-text-lo">
          base360 / system view
        </div>
        <div className="absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono uppercase text-text-lo">
          <span className="w-1.5 h-1.5 rounded-full bg-acid live-dot" />
          maya.r · one thread
        </div>

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Nodes */}
        {NODES.map((n, i) => {
          const revealed = progress > i / NODES.length - 0.05;
          const isClosed = n.key === "closed";
          return (
            <motion.div
              key={n.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: revealed ? 1 : 0.1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider"
                  style={{
                    color: isClosed ? "#0A0A0B" : "var(--acid)",
                    background: isClosed ? "var(--acid)" : "transparent",
                    border: "1px solid var(--acid)",
                    boxShadow: isClosed
                      ? "0 0 32px rgba(223,255,0,0.6)"
                      : revealed
                      ? "0 0 12px rgba(223,255,0,0.2)"
                      : "none",
                  }}
                >
                  {n.label}
                </div>
                <div className="text-[9px] font-mono uppercase text-text-lo">
                  {n.sub}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: progress > 0.6 ? 1 : 0, y: progress > 0.6 ? 0 : 8 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-6 left-0 right-0 text-center"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo mb-1">
            one operating system
          </div>
        </motion.div>
      </div>
    </div>
  );
}
