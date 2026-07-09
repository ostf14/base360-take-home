// Full trust block. Three beats stacked: (1) pedigree headline with an
// inline placeholder logo chip for the predecessor company + acid
// accent on "8 figures", (2) THE TEAM row with three founder cards,
// (3) BACKED BY row with three investor placeholder logos. Every logo
// and avatar is an intentional dashed-border placeholder so nothing
// reads as broken — the honest note in the top-right corner tells the
// reader why. Dark bg, acid used only on the one pedigree beat.

const PLACEHOLDER_BORDER = "1px dashed rgba(255,255,255,0.18)";
const PLACEHOLDER_TEXT = "rgba(255,255,255,0.42)";

interface Founder {
  role: string;
}

const FOUNDERS: Founder[] = [
  { role: "EX-META · CEO" },
  { role: "EX-STRIPE · CTO" },
  { role: "STR EXIT · COO" },
];

const INVESTORS: string[] = ["FUND ONE", "FUND TWO", "ANGEL SYNDICATE"];

export function Credibility() {
  return (
    <section
      id="pedigree"
      className="relative py-24 px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-14">
        {/* Honest placeholder note — top-right corner. Very small,
            very muted, mono — a signal that these logos and portraits
            are intentional stand-ins, not broken assets. */}
        <div className="flex justify-end -mb-8">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.32)",
            }}
          >
            [ placeholders — real assets on launch ]
          </span>
        </div>

        {/* Pedigree headline. Inline logo chip for the predecessor
            company sits mid-sentence with vertical-align: middle so
            the sentence reads unbroken. Acid is spent only on
            "8 figures" — the one number that anchors the credibility. */}
        <h2
          className="font-display font-bold tracking-tight"
          style={{
            color: "var(--text-hi)",
            fontSize: 30,
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            maxWidth: 760,
          }}
        >
          Built by the team behind{" "}
          <InlineLogoChip label="STR OPERATOR" />, scaled to{" "}
          <span
            style={{
              color: "var(--acid)",
              textShadow: "0 0 18px rgba(223,255,0,0.32)",
            }}
          >
            8 figures
          </span>{" "}
          on its own software.
        </h2>

        {/* THE TEAM row. Muted label + three founder placeholders
            side by side. Each avatar is a dashed circle, name is a
            muted "[ Founder ]" placeholder, role is a mono line. */}
        <div className="flex flex-col gap-5">
          <SectionLabel>THE TEAM</SectionLabel>
          <div className="grid grid-cols-3 gap-8">
            {FOUNDERS.map((f, i) => (
              <FounderCard key={i} role={f.role} />
            ))}
          </div>
        </div>

        {/* BACKED BY row. Separated by a 1 px hairline top border
            from the team block above. Same placeholder language:
            three dashed rounded boxes evenly distributed. */}
        <div
          className="flex flex-col gap-5 pt-10"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <SectionLabel>BACKED BY</SectionLabel>
          <div className="grid grid-cols-3 gap-6">
            {INVESTORS.map((label) => (
              <InvestorLogo key={label} label={label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono uppercase font-bold"
      style={{
        fontSize: 10,
        letterSpacing: "0.28em",
        color: "rgba(255,255,255,0.48)",
      }}
    >
      {children}
    </div>
  );
}

// Inline logo chip — sized to sit inside the pedigree headline
// without stretching the line-box. vertical-align: middle keeps the
// baseline stable so the surrounding words don't shift. Dashed
// border + muted mono text = clearly a placeholder.
function InlineLogoChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-mono uppercase font-bold"
      style={{
        width: 132,
        height: 34,
        border: PLACEHOLDER_BORDER,
        borderRadius: 8,
        color: PLACEHOLDER_TEXT,
        fontSize: 11,
        letterSpacing: "0.22em",
        verticalAlign: "middle",
        // Small negative y so the chip visually centres against the
        // 30 px display-bold text baseline, which sits slightly above
        // the geometric middle for most fonts.
        transform: "translateY(-1px)",
      }}
    >
      {label}
    </span>
  );
}

function FounderCard({ role }: { role: string }) {
  return (
    <div className="flex items-center gap-4">
      {/* Dashed avatar circle placeholder */}
      <div
        aria-hidden
        className="shrink-0 rounded-full"
        style={{
          width: 40,
          height: 40,
          border: PLACEHOLDER_BORDER,
        }}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-[13px]"
          style={{ color: PLACEHOLDER_TEXT }}
        >
          [ Founder ]
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {role}
        </span>
      </div>
    </div>
  );
}

function InvestorLogo({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center font-mono uppercase"
      style={{
        flex: 1,
        height: 30,
        border: PLACEHOLDER_BORDER,
        borderRadius: 6,
        color: PLACEHOLDER_TEXT,
        fontSize: 10,
        letterSpacing: "0.24em",
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}
