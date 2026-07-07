"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

const TIMELINE = [
  { t: "12:03", label: "Comment ignited · TikTok" },
  { t: "12:03", label: "AI reply posted · public" },
  { t: "12:04", label: "DM initiated · @maya.r" },
  { t: "12:06", label: "Objection handled · size + price" },
  { t: "12:07", label: "Cart link delivered · $32" },
];

export function CrmSurface({ progress, anchorRef }: Props) {
  return (
    <div className="absolute inset-0 p-6 pt-12 flex">
      <div
        className="relative flex-1 rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
        style={{
          background: "var(--surface-panel)",
          border: "1px solid var(--hairline)",
          boxShadow: "var(--specimen-shadow)",
        }}
      >
        {/* Chrome */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-lo">
            base360 / crm / contact
          </span>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-text-lo/70">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--text-lo)" }}
            />
            live record
          </div>
        </div>

        {/* Header — anchor slot reserves space for the overlay Maya */}
        <div className="flex items-start gap-4">
          <MayaAnchor anchorRef={anchorRef} />
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-display text-text-hi leading-tight">
              Maya R.
            </div>
            <div className="text-xs font-mono text-text-lo">
              maya.r · toronto, ca
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <IntentBadge progress={progress} />
              <Badge label="Source: TikTok comment" />
              <Badge label="Channel: DM" />
            </div>
          </div>
        </div>

        {/* Body — 2 col */}
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          {/* Timeline */}
          <div
            className="rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
            style={{
              background: "var(--surface-panel-2)",
              border: "1px solid var(--hairline)",
            }}
          >
            <div className="text-[10px] font-mono uppercase text-text-lo">
              activity
            </div>
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
              {TIMELINE.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{
                    opacity: progress > 0.1 + i * 0.12 ? 1 : 0.15,
                    x: 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 text-xs"
                >
                  <span className="font-mono text-text-lo shrink-0">
                    {row.t}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                    style={{ background: "var(--text-lo)" }}
                  />
                  <span className="text-text-hi/85">{row.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column — controls */}
          <div className="flex flex-col gap-3">
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{
                background: "var(--surface-panel-2)",
                border: "1px solid var(--hairline)",
              }}
            >
              <div className="text-[10px] font-mono uppercase text-text-lo">
                automation
              </div>
              <Toggle label="Surfaced to sales" on={progress > 0.55} />
              <Toggle label="Nurture sequence: Bloom-01" on={progress > 0.7} />
              <Toggle label="AI voice callback on intent spike" on={progress > 0.85} />
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--surface-panel-2)",
                border: "1px solid var(--hairline)",
              }}
            >
              <div className="text-[10px] font-mono uppercase text-text-lo mb-2">
                next best action
              </div>
              {/* Depicted, not operable: outlined, muted — not the page's CTA. */}
              <div
                className="flex items-center justify-between text-xs px-3 py-2 rounded-md"
                style={{
                  background: "transparent",
                  color: "var(--text-hi)",
                  border: "1px dashed var(--acid-dim)",
                  fontWeight: 500,
                }}
              >
                <span>Trigger AI call</span>
                <span className="font-mono text-[10px] text-text-lo">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntentBadge({ progress }: { progress: number }) {
  const level = progress > 0.5 ? "High" : progress > 0.25 ? "Medium" : "New";
  const isHigh = level === "High";
  // The one acid moment in this surface — the intent going High is a story
  // beat. Kept smaller than before and only the High state ignites.
  return (
    <motion.span
      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm inline-flex items-center gap-1"
      animate={{
        color: isHigh ? "#0A0A0B" : "var(--text-lo)",
        background: isHigh ? "var(--acid)" : "transparent",
        borderColor: isHigh ? "var(--acid)" : "var(--hairline)",
      }}
      transition={{ duration: 0.4 }}
      style={{ border: "1px solid" }}
    >
      Intent: {level}
      <span className="w-1 h-1 rounded-full bg-current" />
    </motion.span>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm text-text-lo"
      style={{ border: "1px solid var(--hairline)" }}
    >
      {label}
    </span>
  );
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  // Kept as an acid moment because a toggle flipping on IS the story beat.
  // Smaller footprint than the button used to be.
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-text-hi/85">{label}</span>
      <motion.div
        animate={{
          background: on ? "var(--acid)" : "var(--surface)",
          borderColor: on ? "var(--acid)" : "var(--hairline)",
        }}
        transition={{ duration: 0.25 }}
        className="w-8 h-4 rounded-full relative shrink-0"
        style={{ border: "1px solid" }}
      >
        <motion.div
          animate={{ x: on ? 16 : 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0.5 w-3 h-3 rounded-full"
          style={{ background: on ? "#0A0A0B" : "var(--text-lo)" }}
        />
      </motion.div>
    </div>
  );
}
