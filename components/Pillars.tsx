import { Bot, Inbox, IdCard, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Four connected pillar cards on dark. Neste-style: bordered dark
// cards in a row of four, a single dashed acid line running through
// their middles (behind the cards) as a visual "these are one
// system" thread, and tiny acid L-brackets at the outermost corners
// framing the group. Icons are Lucide, tinted acid at a thin
// strokeWidth so they read as diagram symbols rather than filled UI
// buttons — echoes the acid-line story vocabulary without stealing
// contrast from the copy.

interface Pillar {
  n: string;
  title: string;
  body: string;
  Icon: LucideIcon;
}

const PILLARS: Pillar[] = [
  {
    n: "01",
    title: "One unified inbox",
    body:
      "Every social comment, DM, call, and email in one place — no logging into six platforms.",
    Icon: Inbox,
  },
  {
    n: "02",
    title: "AI agents do the work",
    body:
      "Agents reply, qualify, and follow up — even call with an AI voice. Your team stops handling the repetitive.",
    Icon: Bot,
  },
  {
    n: "03",
    title: "A built-in CRM",
    body:
      "Every conversation becomes a lead. High-intent surfaces straight to sales, nothing slips.",
    Icon: IdCard,
  },
  {
    n: "04",
    title: "Marketing & subscribers",
    body:
      "Capture subscribers, send campaigns, track opens and clicks — tied to the same customer record.",
    Icon: Mail,
  },
];

export function Pillars() {
  return (
    <section
      id="pillars"
      className="relative py-28 px-8"
      style={{ background: "#0A0A0B" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section header — headline + subcopy tying the pillars
            back to Maya's journey through the scroll story. */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="font-display font-bold tracking-tight"
            style={{
              color: "var(--text-hi)",
              fontSize: "var(--text-2xl)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            What Base360 runs.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--text-lo)" }}
          >
            Every comment Maya sent traveled through all four —
            automatically.
          </p>
        </div>

        {/* Cards + connector. The dashed acid line is absolute-
            positioned across the whole grid at card mid-height so
            it visually threads through every card (behind them).
            The corner brackets sit at the OUTERMOST corners of the
            first and last card, framing the group as one unit. */}
        <div className="relative">
          <DashedConnector />
          <CornerBrackets />
          <div className="relative grid grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <PillarCard key={p.n} pillar={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const { Icon } = pillar;
  return (
    <div
      className="relative flex flex-col gap-5 h-full"
      style={{
        background: "#111114",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "var(--radius-lg)",
        // 22 px horizontal snaps to --space-5 (20); 20/24 stay on-scale.
        padding: "var(--space-5) var(--space-5) var(--space-6)",
      }}
    >
      {/* Header row — acid mono number left, acid Lucide icon right.
          zIndex 1 lifts the row above the dashed connector so both
          the number and the icon read cleanly on the card. */}
      <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
        <span
          className="text-xs font-mono uppercase tracking-widest font-bold"
          style={{
            color: "var(--acid)",
            textShadow: "0 0 10px rgba(223,255,0,0.28)",
          }}
        >
          {pillar.n}
        </span>
        <Icon
          size={24}
          strokeWidth={1.2}
          color="#DFFF00"
          style={{
            filter:
              "drop-shadow(0 0 6px rgba(223,255,0,0.55)) drop-shadow(0 0 14px rgba(223,255,0,0.22))",
          }}
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3
          className="font-display font-bold whitespace-nowrap"
          style={{
            color: "var(--text-hi)",
            fontSize: "var(--text-base)",
            lineHeight: 1.25,
            letterSpacing: "-0.005em",
          }}
        >
          {pillar.title}
        </h3>
        <p
          className="text-sm leading-snug"
          style={{ color: "var(--text-lo)" }}
        >
          {pillar.body}
        </p>
      </div>
    </div>
  );
}

// Dashed acid connector line — absolute, spans the full grid width,
// sits at the card header's vertical middle so it threads visually
// through every icon row. Uses a repeating-linear-gradient (rather
// than SVG dash) so the dash pattern renders at any width without
// aliasing. Half-opacity acid so it doesn't compete with the icons
// themselves, subtle glow so it still reads as "live" acid.
function DashedConnector() {
  return (
    <div
      aria-hidden
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        top: 42,
        height: 1,
        background:
          "repeating-linear-gradient(to right, rgba(223,255,0,0.5) 0 8px, transparent 8px 16px)",
        boxShadow: "0 0 8px rgba(223,255,0,0.22)",
        zIndex: 0,
      }}
    />
  );
}

// Small acid L-brackets on the four outermost corners of the group
// (top-left of card-1, top-right of card-4, bottom-left of card-1,
// bottom-right of card-4). Purely framing chrome — signals "this is
// one unit" without adding weight. 7 px arms, 1 px thick.
function CornerBrackets() {
  const arm = 8;
  const thick = 1;
  const offset = -6;
  const acid = "#DFFF00";
  const glow = "0 0 6px rgba(223,255,0,0.5)";
  return (
    <>
      <Bracket
        style={{ top: offset, left: offset }}
        lines={[
          { top: 0, left: 0, width: arm, height: thick },
          { top: 0, left: 0, width: thick, height: arm },
        ]}
        color={acid}
        glow={glow}
      />
      <Bracket
        style={{ top: offset, right: offset }}
        lines={[
          { top: 0, right: 0, width: arm, height: thick },
          { top: 0, right: 0, width: thick, height: arm },
        ]}
        color={acid}
        glow={glow}
      />
      <Bracket
        style={{ bottom: offset, left: offset }}
        lines={[
          { bottom: 0, left: 0, width: arm, height: thick },
          { bottom: 0, left: 0, width: thick, height: arm },
        ]}
        color={acid}
        glow={glow}
      />
      <Bracket
        style={{ bottom: offset, right: offset }}
        lines={[
          { bottom: 0, right: 0, width: arm, height: thick },
          { bottom: 0, right: 0, width: thick, height: arm },
        ]}
        color={acid}
        glow={glow}
      />
    </>
  );
}

function Bracket({
  style,
  lines,
  color,
  glow,
}: {
  style: React.CSSProperties;
  lines: React.CSSProperties[];
  color: string;
  glow: string;
}) {
  return (
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{ ...style, width: 10, height: 10, zIndex: 2 }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          className="absolute"
          style={{ ...l, background: color, boxShadow: glow }}
        />
      ))}
    </div>
  );
}
