"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";
import { WindowShell } from "../shells/WindowShell";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

const EMAILS = [
  {
    step: "01",
    subject: "Welcome to Northbloom, Maya",
    preview: "You just joined 12,400 people who are picky about their bottle.",
    when: "12:12",
    events: [
      { label: "Sent" },
      { label: "Opened" },
    ],
  },
  {
    step: "02",
    subject: "The story behind the black finish",
    preview: "One prototype in a garage, three years of iteration.",
    when: "Day 2",
    events: [
      { label: "Sent" },
      { label: "Opened" },
      { label: "Clicked → PDP" },
    ],
  },
  {
    step: "03",
    subject: "Ready when you are 🖤",
    preview: "Your cart still has the black 22oz. Code MAYA10 saved.",
    when: "Day 5",
    events: [
      { label: "Sent" },
      { label: "Opened · Clicked" },
      { label: "Purchased · $32", ignite: true },
    ],
  },
];

export function EmailSurface({ progress, anchorRef }: Props) {
  return (
    <WindowShell
      url="base360.app / marketing / sequences / bloom-01"
      tabs={[
        { label: "Sequence", active: true },
        { label: "Audience" },
        { label: "Analytics" },
        { label: "Settings" },
      ]}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sequence meta strip */}
        <div
          className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-4 border-b"
          style={{ borderColor: "var(--hairline)" }}
        >
          <div>
            <div className="text-2xs font-mono uppercase tracking-widest text-text-lo">
              sequence
            </div>
            <div className="text-base font-display text-text-hi">
              Bloom-01 · Post-conversation nurture
            </div>
            <div className="text-xs font-mono text-text-lo mt-0.5">
              3 steps · avg 47% open · 12% ctr
            </div>
          </div>
          <div />
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-2 py-1 rounded-sm"
              style={{ border: "1px solid var(--hairline)" }}
            >
              <span className="text-2xs font-mono uppercase text-text-lo">
                recipient
              </span>
              <MayaAnchor anchorRef={anchorRef} />
              <span className="text-xs text-text-hi">Maya R.</span>
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid grid-cols-[60px_1fr_120px_260px_100px] px-5 py-2 text-2xs font-mono uppercase tracking-widest text-text-lo border-b"
          style={{ borderColor: "var(--hairline)" }}
        >
          <span>step</span>
          <span>subject / preview</span>
          <span>when</span>
          <span>events</span>
          <span className="text-right">status</span>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-hidden">
          {EMAILS.map((email, i) => {
            const localStart = i / EMAILS.length;
            const localEnd = (i + 1) / EMAILS.length;
            const localP = Math.min(
              1,
              Math.max(0, (progress - localStart) / (localEnd - localStart))
            );
            const revealed = progress > localStart - 0.05;
            const status =
              localP >= 1 ? "Complete" : localP > 0.05 ? "Running" : "Queued";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-[60px_1fr_120px_260px_100px] items-center px-5 py-3 border-b"
                style={{ borderColor: "var(--hairline)" }}
              >
                <span className="font-mono text-xs text-text-lo">
                  {email.step}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0 pr-4">
                  <span className="text-sm text-text-hi font-medium truncate">
                    {email.subject}
                  </span>
                  <span className="text-xs text-text-lo truncate">
                    {email.preview}
                  </span>
                </div>
                <span className="font-mono text-xs text-text-lo">
                  {email.when}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {email.events.map((ev, j) => {
                    const evP = (j + 1) / email.events.length;
                    const on = localP > evP - 0.1;
                    const isIgnite = ev.ignite && on;
                    return (
                      <motion.span
                        key={j}
                        animate={{
                          opacity: on ? 1 : 0.28,
                          scale: isIgnite ? 1.03 : 1,
                        }}
                        className="inline-flex items-center gap-1 text-2xs font-mono uppercase px-1.5 py-0.5 rounded-sm"
                        style={{
                          color: isIgnite ? "#0A0A0B" : "var(--text-lo)",
                          background: isIgnite ? "var(--acid)" : "transparent",
                          border: `1px solid ${
                            isIgnite ? "var(--acid)" : "var(--hairline)"
                          }`,
                          boxShadow: isIgnite
                            ? "0 0 18px rgba(223,255,0,0.45)"
                            : "none",
                        }}
                      >
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{
                            background: isIgnite
                              ? "#0A0A0B"
                              : "var(--text-lo)",
                          }}
                        />
                        {ev.label}
                      </motion.span>
                    );
                  })}
                </div>
                <span
                  className="text-right text-xs font-mono uppercase tracking-widest"
                  style={{
                    color:
                      status === "Complete"
                        ? "var(--text-hi)"
                        : "var(--text-lo)",
                  }}
                >
                  {status}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Footer strip */}
        <div
          className="flex items-center justify-between px-5 py-2 border-t text-2xs font-mono uppercase tracking-widest text-text-lo"
          style={{
            borderColor: "var(--hairline)",
            background: "var(--surface-2)",
          }}
        >
          <span>3 rows · 1 recipient</span>
          <span>auto-refresh · 10s</span>
        </div>
      </div>
    </WindowShell>
  );
}
