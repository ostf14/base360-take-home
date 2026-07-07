"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

const EMAILS = [
  {
    subject: "Welcome to Northbloom, Maya",
    preview: "You just joined 12,400 people who are picky about their bottle.",
    events: [
      { t: "12:12", label: "Sent" },
      { t: "12:14", label: "Opened" },
    ],
  },
  {
    subject: "The story behind the black finish",
    preview: "One prototype in a garage, three years of iteration.",
    events: [
      { t: "Day 2", label: "Sent" },
      { t: "Day 2", label: "Opened" },
      { t: "Day 2", label: "Clicked → PDP" },
    ],
  },
  {
    subject: "Ready when you are 🖤",
    preview: "Your cart still has the black 22oz. Code MAYA10 saved.",
    events: [
      { t: "Day 5", label: "Sent" },
      { t: "Day 5", label: "Opened · Clicked" },
      { t: "Day 5", label: "Purchased · $32", ignite: true },
    ],
  },
];

export function EmailSurface({ progress, anchorRef }: Props) {
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
            base360 / marketing / sequence bloom-01
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-text-lo">
            recipient
            <span
              className="flex items-center gap-2 px-2 py-1 rounded-sm"
              style={{ border: "1px solid var(--hairline)" }}
            >
              <MayaAnchor anchorRef={anchorRef} />
              <span className="text-text-hi normal-case">Maya R.</span>
            </span>
          </div>
        </div>

        {/* Sequence flow */}
        <div className="flex-1 p-6 flex flex-col gap-3 min-h-0">
          {EMAILS.map((email, i) => {
            const localStart = i / EMAILS.length;
            const localEnd = (i + 1) / EMAILS.length;
            const localP = Math.min(
              1,
              Math.max(0, (progress - localStart) / (localEnd - localStart))
            );
            const revealed = progress > localStart - 0.05;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: revealed ? 1 : 0.1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl p-4 grid grid-cols-[1fr_auto] gap-4"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-text-lo">
                      email {i + 1}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-text-lo" />
                    <span className="text-[10px] font-mono text-text-lo">
                      {email.events[0]?.t}
                    </span>
                  </div>
                  <div className="text-sm text-text-hi font-medium truncate">
                    {email.subject}
                  </div>
                  <div className="text-xs text-text-lo truncate">
                    {email.preview}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {email.events.map((ev, j) => {
                    const evP = (j + 1) / email.events.length;
                    const on = localP > evP - 0.1;
                    const isIgnite = ev.ignite && on;
                    return (
                      <motion.div
                        key={j}
                        animate={{
                          opacity: on ? 1 : 0.25,
                          scale: isIgnite ? 1.05 : 1,
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-1 rounded-sm"
                        style={{
                          color: isIgnite ? "#0A0A0B" : "var(--text-hi)",
                          background: isIgnite
                            ? "var(--acid)"
                            : on
                            ? "var(--acid-soft)"
                            : "transparent",
                          border: `1px solid ${
                            isIgnite || on ? "var(--acid)" : "var(--hairline)"
                          }`,
                          boxShadow: isIgnite
                            ? "0 0 24px rgba(223,255,0,0.6)"
                            : "none",
                        }}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            on && !isIgnite ? "live-dot" : ""
                          }`}
                          style={{
                            background: isIgnite ? "#0A0A0B" : "var(--acid)",
                          }}
                        />
                        {ev.label}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
