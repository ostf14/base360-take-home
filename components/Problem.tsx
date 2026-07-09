// Setup section — this is the WHY. Sits before the Hero scroll-story so
// the visitor recognises the pain (fragmented channels, leaking leads)
// before the story presents the resolution (one system). Mood is a step
// heavier than the rest of the page: neutral greys dominate, acid only
// pins one word in the headline so it doesn't compete with the story.
export function Problem() {
  return (
    <section
      id="problem"
      className="relative py-28 px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
        {/* Left column — kicker + headline + subcopy */}
        <div className="flex flex-col gap-6">
          <div className="text-xs font-mono uppercase tracking-widest text-acid">
            &gt; THE PROBLEM
          </div>
          <h2 className="font-display text-5xl leading-[1.02] font-bold text-text-hi tracking-tight">
            Buried in messages.
            <br />
            <span className="text-acid">Leaking</span> leads.
          </h2>
          <p className="text-text-lo text-base max-w-xl leading-relaxed">
            Instagram and TikTok comments and DMs, WhatsApp, SMS, calls, email —
            plus newsletters in yet another tool. Comments go unanswered, leads
            slip through, replies come late, and no one has a single view of
            the customer.
          </p>
        </div>

        {/* Right column — the fragmentation visual. Seven channel chips
            floating disconnected in a fixed-height field with slight
            rotations and offsets. All in muted greys — no acid, no
            colour cast — so it reads as chaos, not decoration. */}
        <ChannelScatter />
      </div>
    </section>
  );
}

interface Chip {
  label: string;
  x: number; // % from left
  y: number; // % from top
  rot: number; // deg
}

const CHIPS: Chip[] = [
  { label: "instagram",   x:  6, y: 12, rot: -6 },
  { label: "tiktok",      x: 46, y:  4, rot:  4 },
  { label: "whatsapp",    x: 78, y: 22, rot: -3 },
  { label: "sms",         x: 22, y: 44, rot:  7 },
  { label: "calls",       x: 58, y: 52, rot: -8 },
  { label: "email",       x:  8, y: 74, rot:  3 },
  { label: "newsletters", x: 52, y: 82, rot: -4 },
];

function ChannelScatter() {
  return (
    <div className="relative h-[360px] w-full">
      {/* Faint dashed lines nudging the chaos read — a couple of broken
          connector fragments that go nowhere. Purely mood. */}
      <svg
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 12 20 L 38 42"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.3}
          strokeDasharray="1.6 1.6"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 62 12 L 74 32"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.3}
          strokeDasharray="1.6 1.6"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 28 68 L 52 78"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.3}
          strokeDasharray="1.6 1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {CHIPS.map((c) => (
        <ChannelChip key={c.label} c={c} />
      ))}
    </div>
  );
}

function ChannelChip({ c }: { c: Chip }) {
  return (
    <div
      className="absolute flex items-center gap-2 px-3 py-2"
      style={{
        left: `${c.x}%`,
        top: `${c.y}%`,
        transform: `rotate(${c.rot}deg)`,
        background: "rgba(20, 20, 22, 0.85)",
        border: "1px solid var(--hairline)",
        borderRadius: 4,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          background: "var(--text-lo)",
          opacity: 0.5,
        }}
      />
      <span className="font-mono uppercase text-[10px] tracking-widest text-text-lo whitespace-nowrap">
        {c.label}
      </span>
    </div>
  );
}
