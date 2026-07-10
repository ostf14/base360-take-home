"use client";
import { motion } from "framer-motion";
import { MayaAnchor } from "../MayaOverlay";
import { WindowShell } from "../shells/WindowShell";

interface Props {
  progress: number;
  anchorRef: React.RefObject<HTMLDivElement>;
}

const TIMELINE = [
  { t: "12:03:11", label: "Comment ignited", src: "TikTok · @northbloom.co" },
  { t: "12:03:12", label: "AI reply posted", src: "Public reply" },
  { t: "12:04:02", label: "DM initiated", src: "IG DM · maya.r" },
  { t: "12:06:41", label: "Objection handled", src: "Size + price" },
  { t: "12:07:28", label: "Cart link delivered", src: "$32.00" },
];

const NAV = [
  { label: "Inbox", count: 214 },
  { label: "Leads", count: 8_412, active: true },
  { label: "Customers", count: 12_461 },
  { label: "Automations", count: 42 },
  { label: "Reports", count: null },
  { label: "Settings", count: null },
];

export function CrmSurface({ progress, anchorRef }: Props) {
  return (
    <WindowShell
      url="base360.app / crm / leads / #001-8412"
      tabs={[
        { label: "Overview", active: true },
        { label: "Activity" },
        { label: "Emails" },
        { label: "Calls" },
        { label: "Notes" },
      ]}
    >
      <div className="flex-1 grid grid-cols-[180px_1fr] min-h-0">
        {/* Left nav rail */}
        <div
          className="flex flex-col border-r py-2"
          style={{ borderColor: "var(--hairline)" }}
        >
          <div className="px-4 py-2 text-2xs font-mono uppercase tracking-widest text-text-lo/70">
            workspace
          </div>
          {NAV.map((n) => (
            <div
              key={n.label}
              className="flex items-center justify-between px-4 py-1.5 text-xs"
              style={{
                color: n.active ? "var(--text-hi)" : "var(--text-lo)",
                background: n.active ? "rgba(255,255,255,0.03)" : "transparent",
                borderLeft: `2px solid ${n.active ? "var(--text-hi)" : "transparent"}`,
              }}
            >
              <span>{n.label}</span>
              {n.count != null && (
                <span className="font-mono text-2xs text-text-lo/60">
                  {n.count.toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Record body */}
        <div className="flex flex-col overflow-hidden">
          {/* Header row — 3-column grid with proper gaps so nothing overlaps.
              Left column reserves 64px for the avatar + its (smaller) glow
              footprint. Center holds the name + meta stacked with real
              spacing. Right holds the intent badge + action buttons, all
              flex-none so a wider row still can't crowd the name. */}
          <div
            className="grid items-center px-5 py-4 border-b gap-x-6"
            style={{
              borderColor: "var(--hairline)",
              gridTemplateColumns: "64px minmax(0, 1fr) auto",
            }}
          >
            <div className="flex items-center justify-center">
              <MayaAnchor anchorRef={anchorRef} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="text-lg font-display text-text-hi leading-tight">
                Maya R.
              </div>
              <div className="text-xs font-mono text-text-lo truncate">
                LEAD #001-8412 · maya.r · toronto, ca · updated just now
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <IntentBadge progress={progress} />
              <Btn label="Message" />
              <Btn label="Call" />
              <Btn label="Assign ▾" />
            </div>
          </div>

          {/* Metric strip */}
          <div
            className="grid grid-cols-4 gap-0 border-b"
            style={{ borderColor: "var(--hairline)" }}
          >
            <Metric label="Intent score" value="94" unit="/100" />
            <Metric label="Touchpoints" value="7" unit="" />
            <Metric label="Time to reply" value="2.4" unit="s avg" />
            <Metric label="Est. LTV" value="$412" unit="" />
          </div>

          {/* Body split */}
          <div className="flex-1 grid grid-cols-[1.6fr_1fr] min-h-0">
            {/* Activity table */}
            <div
              className="flex flex-col border-r overflow-hidden"
              style={{ borderColor: "var(--hairline)" }}
            >
              <div
                className="grid grid-cols-[80px_1fr_auto] px-5 py-2 text-2xs font-mono uppercase tracking-widest text-text-lo border-b"
                style={{ borderColor: "var(--hairline)" }}
              >
                <span>timestamp</span>
                <span>event</span>
                <span>source</span>
              </div>
              <div className="flex-1 overflow-hidden">
                {TIMELINE.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{
                      opacity: progress > 0.1 + i * 0.12 ? 1 : 0.2,
                      x: 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-[80px_1fr_auto] px-5 py-2 text-xs items-center border-b"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <span className="font-mono text-text-lo">{row.t}</span>
                    <span className="text-text-hi/85 flex items-center gap-2">
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: "var(--text-lo)" }}
                      />
                      {row.label}
                    </span>
                    <span className="font-mono text-xs text-text-lo">
                      {row.src}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right rail: automation + next best action */}
            <div className="flex flex-col p-4 gap-3 overflow-hidden">
              <div>
                <div className="text-2xs font-mono uppercase tracking-widest text-text-lo mb-2">
                  automations
                </div>
                <Toggle label="Surfaced to sales" on={progress > 0.55} />
                <Toggle label="Nurture · Bloom-01" on={progress > 0.7} />
                <Toggle label="Voice callback on intent" on={progress > 0.85} />
              </div>
              <div className="mt-2">
                <div className="text-2xs font-mono uppercase tracking-widest text-text-lo mb-2">
                  next best action
                </div>
                <div
                  className="flex items-center justify-between text-xs px-3 py-2 rounded"
                  style={{
                    background: "transparent",
                    color: "var(--text-hi)",
                    border: "1px dashed var(--acid-dim)",
                  }}
                >
                  <span>Trigger AI voice call</span>
                  <span className="font-mono text-xs text-text-lo">→</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xs font-mono uppercase tracking-widest text-text-lo mb-2">
                  attribution
                </div>
                <div
                  className="rounded p-3 text-xs font-mono text-text-lo/85 leading-relaxed"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  Source · TikTok comment
                  <br />
                  Channel · IG DM
                  <br />
                  Campaign · organic
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowShell>
  );
}

function IntentBadge({ progress }: { progress: number }) {
  const level = progress > 0.5 ? "High" : progress > 0.25 ? "Medium" : "New";
  const isHigh = level === "High";
  return (
    <motion.span
      className="text-xs font-mono uppercase px-2 py-0.5 rounded-sm inline-flex items-center gap-1"
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

function Btn({ label }: { label: string }) {
  return (
    <span
      className="text-xs font-mono uppercase px-2 py-1 rounded-sm text-text-lo"
      style={{
        border: "1px solid var(--hairline)",
        background: "var(--surface-2)",
      }}
    >
      {label}
    </span>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div
      className="flex flex-col gap-0.5 px-5 py-3 border-r"
      style={{ borderColor: "var(--hairline)" }}
    >
      <span className="text-2xs font-mono uppercase tracking-widest text-text-lo">
        {label}
      </span>
      <span className="text-lg font-display text-text-hi">
        {value}
        <span className="text-xs font-mono text-text-lo ml-1">{unit}</span>
      </span>
    </div>
  );
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-text-hi/85">{label}</span>
      <motion.div
        animate={{
          background: on ? "var(--acid)" : "var(--surface)",
          borderColor: on ? "var(--acid)" : "var(--hairline)",
        }}
        transition={{ duration: 0.25 }}
        className="w-7 h-3.5 rounded-full relative shrink-0"
        style={{ border: "1px solid" }}
      >
        <motion.div
          animate={{ x: on ? 14 : 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0.5 w-2.5 h-2.5 rounded-full"
          style={{ background: on ? "#0A0A0B" : "var(--text-lo)" }}
        />
      </motion.div>
    </div>
  );
}
