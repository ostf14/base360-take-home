"use client";
import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

// The design-system meta-panel. A quiet trigger sits in the
// bottom-right corner; clicking it slides a full-height drawer in
// from the right that mirrors the current token layer in
// app/tokens.css. Every swatch, spacing bar, radius chip, font
// specimen, and effect preview reads its value LIVE from CSS via
// getComputedStyle — nothing is duplicated by hand, so editing a
// token immediately updates the panel.

const COLOR_TOKENS = [
  "--bg",
  "--surface",
  "--surface-2",
  "--acid",
  "--text-hi",
  "--text-lo",
  "--hairline",
  "--acid-glow",
  "--acid-dim",
];

const SPACING_TOKENS = [
  "--space-0",
  "--space-px",
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-5",
  "--space-6",
  "--space-8",
  "--space-10",
  "--space-12",
  "--space-14",
  "--space-16",
  "--space-20",
  "--space-24",
  "--space-28",
  "--space-40",
];

const RADIUS_TOKENS = [
  "--radius-xs",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--radius-2xl",
  "--radius-pill",
];

// One row per --text-* token. Family / weight are the pairing each
// size actually carries in the app — small mono for labels, body for
// mid-scale copy, display for headline sizes. Everything renders
// live: fontSize resolves to var(<token>) and the label pulls the
// computed px value from getComputedStyle. Editing --text-sm in
// tokens.css updates the pixel value here immediately.
interface TypeSpec {
  token: string;
  family: "mono" | "body" | "display";
  weight: 400 | 500 | 700;
  sample: string;
}

const TYPE_SPECS: TypeSpec[] = [
  { token: "--text-2xs",  family: "mono",    weight: 700, sample: "TIKTOK · PUBLIC" },
  { token: "--text-xs",   family: "mono",    weight: 700, sample: "> STEP 01 / 06 — THE COMMENT" },
  { token: "--text-sm",   family: "body",    weight: 400, sample: "Every conversation becomes a lead." },
  { token: "--text-base", family: "body",    weight: 400, sample: "Base360 replies in your voice — instantly, in public." },
  { token: "--text-lg",   family: "body",    weight: 500, sample: "Join the waitlist" },
  { token: "--text-xl",   family: "display", weight: 700, sample: "Every reply becomes a lead." },
  { token: "--text-2xl",  family: "display", weight: 700, sample: "What Base360 runs." },
  { token: "--text-3xl",  family: "display", weight: 700, sample: "Never miss." },
];

const TYPE_TOKENS = TYPE_SPECS.map((s) => s.token);

const FAMILY_CSS: Record<TypeSpec["family"], string> = {
  mono: "var(--font-mono), ui-monospace, monospace",
  body: "var(--font-body), system-ui, sans-serif",
  display: "var(--font-display), system-ui, sans-serif",
};

// Live-reads a list of CSS custom-property names off <html> so the
// UI always shows the current declared value from tokens.css.
function useTokenValues(tokens: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      tokens.forEach((t) => {
        next[t] = styles.getPropertyValue(t).trim();
      });
      setValues(next);
    };
    read();
    // Re-read on resize in case any tokens ever grow viewport-relative.
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [tokens]);
  return values;
}

// Height of the fixed top bar in px. Exported so Nav (top offset)
// and Hero (sticky top / height) can align to the same value from
// one source rather than duplicating a magic 34.
export const DESIGN_SYSTEM_BAR_HEIGHT = 34;

export function DesignSystemPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <TopBar onClick={() => setOpen(true)} />
      <Drawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// Full-width fixed bar pinned above the navbar — always visible as
// the entry point to the token drawer. Whole strip is a button so
// clicking anywhere on the row opens the panel; hovering flips
// label + dot to acid.
function TopBar({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-center transition-colors"
      style={{
        height: DESIGN_SYSTEM_BAR_HEIGHT,
        background: "var(--surface)",
        borderBottom: "1px solid var(--hairline)",
        gap: "var(--space-3)",
        color: hovered ? "var(--acid)" : "var(--text-lo)",
      }}
      aria-label="Open design system panel"
    >
      <span
        aria-hidden
        className="inline-block"
        style={{
          width: 6,
          height: 6,
          background: "var(--acid)",
          boxShadow: hovered ? "0 0 8px rgba(223,255,0,0.6)" : "none",
        }}
      />
      <span
        className="font-mono uppercase font-bold"
        style={{
          fontSize: "var(--text-xs)",
          letterSpacing: "0.28em",
        }}
      >
        DESIGN SYSTEM
      </span>
      <span
        aria-hidden
        className="font-mono uppercase"
        style={{
          fontSize: "var(--text-2xs)",
          letterSpacing: "0.28em",
          color: "var(--text-lo)",
          opacity: 0.65,
        }}
      >
        {"{ } click to inspect"}
      </span>
    </button>
  );
}

function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop — dims the page and catches outside clicks. */}
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-[70] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />
      {/* Right-side inspector panel — slides in with a translate. */}
      <aside
        role="dialog"
        aria-label="Design system"
        className="fixed top-0 right-0 h-full z-[80] overflow-y-auto transition-transform duration-300"
        style={{
          width: 440,
          background: "var(--bg)",
          borderLeft: "1px solid var(--hairline)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex flex-col" style={{ padding: "var(--space-6)" }}>
          <Header onClose={onClose} />
          <div
            className="flex flex-col"
            style={{ gap: "var(--space-10)", marginTop: "var(--space-6)" }}
          >
            <ColorSection />
            <TypeSection />
            <SpacingSection />
            <RadiusSection />
            <ElevationSection />
            <ComponentsSection />
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div
          className="font-mono uppercase font-bold"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.28em",
            color: "var(--acid)",
          }}
        >
          BASE360 · DESIGN SYSTEM
        </div>
        <div
          className="font-display font-bold"
          style={{
            color: "var(--text-hi)",
            fontSize: "var(--text-xl)",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            marginTop: "var(--space-2)",
          }}
        >
          Live token inspector
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-lo)",
            marginTop: "var(--space-1)",
          }}
        >
          reads from app/tokens.css
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="font-mono transition-colors"
        style={{
          padding: "var(--space-1) var(--space-2)",
          background: "transparent",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          color: "var(--text-lo)",
          fontSize: "var(--text-base)",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono uppercase font-bold"
      style={{
        fontSize: "var(--text-xs)",
        letterSpacing: "0.28em",
        color: "var(--text-lo)",
        marginBottom: "var(--space-3)",
      }}
    >
      {children}
    </div>
  );
}

function ColorSection() {
  const values = useTokenValues(COLOR_TOKENS);
  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (name: string) => {
    const v = values[name];
    if (!v) return;
    navigator.clipboard?.writeText(v).then(() => {
      setCopied(name);
      window.setTimeout(() => setCopied(null), 1000);
    });
  };
  return (
    <section>
      <SectionLabel>COLOR</SectionLabel>
      <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
        {COLOR_TOKENS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => handleCopy(name)}
            className="flex items-center text-left transition-colors hover:bg-white/[0.03]"
            style={{
              padding: "var(--space-2)",
              gap: "var(--space-3)",
              borderRadius: "var(--radius-xs)",
            }}
          >
            <span
              aria-hidden
              className="shrink-0"
              style={{
                width: 28,
                height: 28,
                background: `var(${name})`,
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-xs)",
              }}
            />
            <div className="flex-1 min-w-0">
              <div
                className="font-mono"
                style={{ fontSize: "var(--text-xs)", color: "var(--text-hi)" }}
              >
                {name}
              </div>
              <div
                className="font-mono truncate"
                style={{ fontSize: "var(--text-xs)", color: "var(--text-lo)" }}
              >
                {values[name] || "…"}
              </div>
            </div>
            <span
              className="font-mono uppercase transition-opacity shrink-0"
              style={{
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.22em",
                color: "var(--acid)",
                opacity: copied === name ? 1 : 0,
              }}
            >
              copied
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function TypeSection() {
  const values = useTokenValues(TYPE_TOKENS);
  return (
    <section>
      <SectionLabel>TYPE</SectionLabel>
      <div className="flex flex-col" style={{ gap: "var(--space-5)" }}>
        {TYPE_SPECS.map((spec) => {
          const name = spec.token.replace("--", "");
          return (
            <div
              key={spec.token}
              className="flex flex-col"
              style={{ gap: "var(--space-2)" }}
            >
              {/* Meta row — token name · computed px · family. Reads
                  live from getComputedStyle so editing a --text-*
                  value in tokens.css updates the px column here. */}
              <div
                className="font-mono uppercase flex items-center"
                style={{
                  fontSize: "var(--text-2xs)",
                  letterSpacing: "0.22em",
                  color: "var(--text-lo)",
                  gap: "var(--space-3)",
                }}
              >
                <span style={{ color: "var(--text-hi)" }}>{name}</span>
                <span>{values[spec.token] || "…"}</span>
                <span>· {spec.family}</span>
              </div>
              {/* Sample rendered AT that token's size in the family
                  the size actually carries in the app. fontFamily is
                  a CSS var; fontSize resolves to the same token the
                  meta row above just labelled — the two are wired to
                  the same source. */}
              <div
                style={{
                  fontFamily: FAMILY_CSS[spec.family],
                  fontSize: `var(${spec.token})`,
                  fontWeight: spec.weight,
                  color: "var(--text-hi)",
                  lineHeight: 1.2,
                  letterSpacing:
                    spec.family === "display" ? "-0.015em" : 0,
                }}
              >
                {spec.sample}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SpacingSection() {
  const values = useTokenValues(SPACING_TOKENS);
  return (
    <section>
      <SectionLabel>SPACING</SectionLabel>
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        {SPACING_TOKENS.map((name) => (
          <div key={name} className="flex items-center" style={{ gap: "var(--space-3)" }}>
            <div
              className="font-mono shrink-0"
              style={{ fontSize: "var(--text-xs)", color: "var(--text-hi)", width: 72 }}
            >
              {name.replace("--space-", "space-")}
            </div>
            <div
              aria-hidden
              className="shrink-0"
              style={{
                background: "var(--acid)",
                height: 6,
                width: `var(${name})`,
                minWidth: 1,
                boxShadow: "0 0 6px rgba(223,255,0,0.4)",
              }}
            />
            <div
              className="font-mono ml-auto shrink-0"
              style={{ fontSize: "var(--text-xs)", color: "var(--text-lo)" }}
            >
              {values[name] || "…"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RadiusSection() {
  const values = useTokenValues(RADIUS_TOKENS);
  return (
    <section>
      <SectionLabel>RADIUS</SectionLabel>
      <div
        className="grid grid-cols-3"
        style={{ gap: "var(--space-4)" }}
      >
        {RADIUS_TOKENS.map((name) => (
          <div
            key={name}
            className="flex flex-col items-start"
            style={{ gap: "var(--space-2)" }}
          >
            <div
              aria-hidden
              style={{
                width: 56,
                height: 56,
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: `var(${name})`,
              }}
            />
            <div>
              <div
                className="font-mono"
                style={{ fontSize: "var(--text-xs)", color: "var(--text-hi)" }}
              >
                {name.replace("--radius-", "")}
              </div>
              <div
                className="font-mono"
                style={{ fontSize: "var(--text-2xs)", color: "var(--text-lo)" }}
              >
                {values[name] || "…"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ElevationSection() {
  return (
    <section>
      <SectionLabel>ELEVATION / GLOW</SectionLabel>
      <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
        <div>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-2xs)",
              letterSpacing: "0.22em",
              color: "var(--text-lo)",
              marginBottom: "var(--space-3)",
            }}
          >
            --specimen-shadow · phone / window lift
          </div>
          <div className="flex justify-center" style={{ padding: "var(--space-3)" }}>
            <div
              aria-hidden
              style={{
                width: 200,
                height: 80,
                background: "var(--surface-2)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--specimen-shadow)",
              }}
            />
          </div>
        </div>
        <div>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-2xs)",
              letterSpacing: "0.22em",
              color: "var(--text-lo)",
              marginBottom: "var(--space-3)",
            }}
          >
            --acid-glow · 0 0 32 px halo
          </div>
          <div className="flex justify-center" style={{ padding: "var(--space-3)" }}>
            <div
              aria-hidden
              style={{
                width: 56,
                height: 56,
                background: "var(--acid)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 0 32px var(--acid-glow)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ComponentPreview({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      <div
        className="font-mono uppercase"
        style={{
          fontSize: "var(--text-2xs)",
          letterSpacing: "0.22em",
          color: "var(--text-lo)",
        }}
      >
        {caption}
      </div>
      <div
        className="flex items-center justify-center"
        style={{
          padding: "var(--space-4)",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-sm)",
          minHeight: 72,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <section>
      <SectionLabel>COMPONENTS</SectionLabel>
      <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
        <ComponentPreview caption="acid CTA button">
          <button
            type="button"
            className="font-mono uppercase text-xs tracking-wider"
            style={{
              padding: "var(--space-2) var(--space-3)",
              background: "var(--acid)",
              color: "#0A0A0B",
              fontWeight: 700,
              boxShadow: "0 0 20px rgba(223,255,0,0.35)",
            }}
          >
            Get early access
          </button>
        </ComponentPreview>

        <ComponentPreview caption="mono kicker chip">
          <div
            className="inline-flex items-center font-mono uppercase"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.22em",
              color: "var(--text-lo)",
              gap: "var(--space-2)",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                background: "var(--acid)",
                display: "inline-block",
              }}
            />
            <span>01 / 06</span>
            <span>—</span>
            <span
              style={{
                color: "var(--acid)",
                fontWeight: 700,
                textShadow: "0 0 12px rgba(223,255,0,0.28)",
              }}
            >
              THE COMMENT
            </span>
          </div>
        </ComponentPreview>

        <ComponentPreview caption="active stepper node">
          <div
            aria-hidden
            style={{
              width: 12,
              height: 12,
              background: "var(--acid)",
              border: "1px solid var(--acid)",
              boxShadow: "0 0 14px rgba(223,255,0,0.65)",
              transform: "scale(1.35)",
            }}
          />
        </ComponentPreview>

        <ComponentPreview caption="glowing acid rectangle">
          <svg
            width={140}
            height={44}
            aria-hidden
            style={{
              overflow: "visible",
              filter:
                "drop-shadow(0 0 6px rgba(223,255,0,0.7)) drop-shadow(0 0 14px rgba(223,255,0,0.35))",
            }}
          >
            <rect
              x={2}
              y={2}
              width={136}
              height={40}
              rx={10}
              ry={10}
              fill="none"
              stroke="var(--acid)"
              strokeWidth={2}
            />
          </svg>
        </ComponentPreview>

        <ComponentPreview caption="dashed acid arrow">
          <svg
            width={80}
            height={24}
            aria-hidden
            style={{
              overflow: "visible",
              filter: "drop-shadow(0 0 5px rgba(223,255,0,0.4))",
            }}
          >
            <line
              x1={2}
              y1={12}
              x2={64}
              y2={12}
              stroke="var(--acid)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            <polyline
              points="60,7 70,12 60,17"
              fill="none"
              stroke="var(--acid)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ComponentPreview>

        <ComponentPreview caption="node box + lucide icon">
          <div
            className="inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-md whitespace-nowrap"
            style={{
              padding: "var(--space-3) var(--space-5)",
              gap: "var(--space-2)",
              fontSize: "var(--text-base)",
              color: "var(--text-hi)",
              background: "rgba(28,28,31,0.92)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
            }}
          >
            <Smartphone
              size={18}
              strokeWidth={1.2}
              color="#DFFF00"
              style={{
                filter:
                  "drop-shadow(0 0 5px rgba(223,255,0,0.55)) drop-shadow(0 0 12px rgba(223,255,0,0.22))",
              }}
              aria-hidden
            />
            <span>TIKTOK</span>
          </div>
        </ComponentPreview>
      </div>
    </section>
  );
}
