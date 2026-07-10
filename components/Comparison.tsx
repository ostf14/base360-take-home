// Old-way / new-way contrast card. The section lives right after the
// four pillars: those name the SCOPE ("here's the surface area"); this
// names the SHIFT ("here's what changes when you use it"). The two
// cards share the same 5-row skeleton so the eye can pair each pain
// with its resolution horizontally — dead-grey on the left, alive-acid
// on the right. Dark overall, acid used only as a signal color on the
// right side.

interface Row {
  old: string;
  neo: string;
}

const ROWS: Row[] = [
  {
    old: "Comments pile up unanswered",
    neo: "Every comment caught & answered",
  },
  {
    old: "Leads slip through the cracks",
    neo: "Every conversation becomes a lead",
  },
  {
    old: "Replies come hours too late",
    neo: "AI replies in seconds, 24/7",
  },
  {
    old: "Every channel in a different tool",
    neo: "All channels in one inbox",
  },
  {
    old: "No single view of the customer",
    neo: "One record per customer",
  },
];

export function Comparison() {
  return (
    <section
      id="difference"
      className="relative py-28 px-8"
      style={{ background: "#0A0A0B" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        {/* Section header — headline only. Subcopy intentionally
            omitted so the visual contrast below carries the message. */}
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
            Ten tools, or one.
          </h2>
        </div>

        {/* Two cards side by side. Same 5-row inner skeleton so pairs
            align across the gap and the reader tracks pain → fix on
            the same row. gap-5 (~20 px) puts them close enough to
            read as one comparison unit but keeps a visible seam. */}
        <div className="grid grid-cols-2 gap-5">
          <OldWayCard />
          <NewWayCard />
        </div>
      </div>
    </section>
  );
}

function OldWayCard() {
  return (
    <div
      className="relative flex flex-col"
      style={{
        background: "#0D0D0F",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--radius-lg)",
        // 22 / 26 snap to --space-5 / --space-6 (nearest scale steps).
        padding: "var(--space-5) var(--space-6) var(--space-6)",
        opacity: 0.86,
      }}
    >
      <CardHeader
        label="THE OLD WAY"
        labelColor="rgba(255,255,255,0.5)"
        dot={null}
        tag="10 TABS OPEN"
        tagColor="rgba(226,110,110,0.6)"
      />
      <div className="mt-6 flex flex-col">
        {ROWS.map((r, i) => (
          <Row
            key={i}
            first={i === 0}
            symbol="✕"
            symbolColor="rgba(226,110,110,0.55)"
            text={r.old}
            textColor="rgba(255,255,255,0.45)"
          />
        ))}
      </div>
    </div>
  );
}

function NewWayCard() {
  return (
    <div
      className="relative flex flex-col"
      style={{
        background: "#101207",
        border: "1px solid rgba(223,255,0,0.4)",
        borderRadius: "var(--radius-lg)",
        // 22 / 26 snap to --space-5 / --space-6 (nearest scale steps).
        padding: "var(--space-5) var(--space-6) var(--space-6)",
        boxShadow:
          "0 0 40px rgba(223,255,0,0.08), inset 0 1px 0 rgba(223,255,0,0.05)",
      }}
    >
      <CardHeader
        label="WITH BASE360"
        labelColor="var(--acid)"
        dot={{ color: "var(--acid)", glow: "0 0 8px rgba(223,255,0,0.55)" }}
        tag="1 SYSTEM"
        tagColor="var(--acid)"
      />
      <div className="mt-6 flex flex-col">
        {ROWS.map((r, i) => (
          <Row
            key={i}
            first={i === 0}
            symbol="✓"
            symbolColor="var(--acid)"
            symbolGlow="0 0 10px rgba(223,255,0,0.5)"
            text={r.neo}
            textColor="var(--text-hi)"
          />
        ))}
      </div>
    </div>
  );
}

function CardHeader({
  label,
  labelColor,
  dot,
  tag,
  tagColor,
}: {
  label: string;
  labelColor: string;
  dot: { color: string; glow: string } | null;
  tag: string;
  tagColor: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {dot && (
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              background: dot.color,
              boxShadow: dot.glow,
            }}
          />
        )}
        <span
          className="text-xs font-mono uppercase font-bold"
          style={{ color: labelColor, letterSpacing: "0.22em" }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-xs font-mono uppercase font-bold"
        style={{ color: tagColor, letterSpacing: "0.22em" }}
      >
        {tag}
      </span>
    </div>
  );
}

function Row({
  first,
  symbol,
  symbolColor,
  symbolGlow,
  text,
  textColor,
}: {
  first: boolean;
  symbol: string;
  symbolColor: string;
  symbolGlow?: string;
  text: string;
  textColor: string;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{
        borderTop: first
          ? "none"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="shrink-0 inline-flex items-center justify-center font-mono font-bold"
        style={{
          width: 16,
          height: 16,
          fontSize: "var(--text-sm)",
          color: symbolColor,
          textShadow: symbolGlow ?? "none",
        }}
      >
        {symbol}
      </span>
      <span className="text-base leading-snug" style={{ color: textColor }}>
        {text}
      </span>
    </div>
  );
}
