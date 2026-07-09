// The four-pillar section names the product's scope AFTER the scroll-story
// showed the mechanic on a single lead. Reads like a scope sheet, not a
// feature dump: mono numbers, grotesk titles, muted body copy, acid as a
// thin top-rule per column (accent only, no fills). The four column
// glyphs visually echo the surfaces from the story (inbox / agent / crm
// / marketing) without re-rendering them.

interface Pillar {
  n: string;
  title: string;
  body: string;
  glyph: "inbox" | "agent" | "crm" | "marketing";
}

const PILLARS: Pillar[] = [
  {
    n: "01",
    title: "One unified inbox",
    body: "Every social comment, DM, WhatsApp, SMS, call, and email in one place. Reply without logging into a single platform.",
    glyph: "inbox",
  },
  {
    n: "02",
    title: "AI agents that do the work",
    body: "Agents reply, answer, qualify, follow up — even call with an AI voice. Your team stops doing the repetitive work.",
    glyph: "agent",
  },
  {
    n: "03",
    title: "A built-in CRM",
    body: "Every conversation becomes a lead. High-intent leads surface straight to sales, so nothing gets missed.",
    glyph: "crm",
  },
  {
    n: "04",
    title: "Marketing & subscribers",
    body: "Capture subscribers, send campaigns, and track sign-ups, opens, and clicks — tied to the same customer record.",
    glyph: "marketing",
  },
];

export function Pillars() {
  return (
    <section
      id="pillars"
      className="relative py-28 px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header: kicker + optional short section headline */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-acid">
            &gt; WHAT BASE360 DOES
          </div>
          <h2 className="font-display text-4xl leading-[1.05] font-bold text-text-hi tracking-tight">
            One system. Four jobs.
          </h2>
        </div>

        {/* Four columns. Each has a 1px acid top rule as the only accent,
            then a monochrome glyph, mono number, grotesk title, muted body.
            Even spacing across all four so the scope reads as one set. */}
        <div className="grid grid-cols-4 gap-8">
          {PILLARS.map((p) => (
            <PillarCard key={p.n} pillar={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div className="relative flex flex-col gap-4 pt-5">
      {/* Thin acid rule — the sole accent per card */}
      <div
        aria-hidden
        className="absolute top-0 left-0"
        style={{
          width: 28,
          height: 2,
          background: "var(--acid)",
          boxShadow: "0 0 8px rgba(223,255,0,0.35)",
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-acid">
          {pillar.n}
        </span>
        <PillarGlyph kind={pillar.glyph} />
      </div>
      <h3 className="font-display text-xl leading-tight font-bold text-text-hi tracking-tight">
        {pillar.title}
      </h3>
      <p className="text-sm text-text-lo leading-relaxed">
        {pillar.body}
      </p>
    </div>
  );
}

// Small monochrome outline glyphs — subtle, no colour cast, no acid.
// Each one is a visual rhyme with the corresponding surface from the
// scroll-story: inbox row / agent node / crm record / marketing funnel.
function PillarGlyph({ kind }: { kind: Pillar["glyph"] }) {
  const stroke = "rgba(255, 255, 255, 0.35)";
  const strokeWidth = 1.25;
  const size = 26;
  switch (kind) {
    case "inbox":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M3 12 L9 12 L11 15 L13 15 L15 12 L21 12" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
    case "agent":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3.5" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray="1.5 2.2" />
          <circle cx="12" cy="3" r="1" fill={stroke} />
          <circle cx="21" cy="12" r="1" fill={stroke} />
          <circle cx="12" cy="21" r="1" fill={stroke} />
          <circle cx="3" cy="12" r="1" fill={stroke} />
        </svg>
      );
    case "crm":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M3 9 L21 9" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M7 13 L17 13" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M7 16.5 L14 16.5" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="5" cy="14.5" r="1.1" fill={stroke} />
        </svg>
      );
    case "marketing":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 20 L4 12" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M9 20 L9 8" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M14 20 L14 14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M19 20 L19 5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M3 4 L21 4" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray="1.4 1.4" opacity={0.6} />
        </svg>
      );
  }
}
