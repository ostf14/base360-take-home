export function Credibility() {
  return (
    <section
      id="pedigree"
      className="relative py-24 px-8"
      style={{ background: "var(--bg)" }}
    >
      {/* Compact trust block. No fake investor placeholders — instead the
          real signal: STR-pedigree line up top, product line under it,
          and the honest-scarcity cohort row underneath. Spacing is
          tightened (gap-8 between rows, no big vertical voids) so the
          section reads as ONE intentional composition, not three
          floating pieces. */}
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Anchor line — pedigree, no fake customer proof */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-acid mb-3">
            &gt; pedigree
          </div>
          <p className="font-display text-3xl leading-tight text-text-hi">
            From the team that scaled a short-term-rental operator to an{" "}
            <span className="text-acid">8-figure portfolio</span> — on its own
            software.
          </p>
          <p className="mt-4 text-text-lo text-sm max-w-2xl leading-relaxed">
            Base360 is the same architecture, generalized: one system for the
            customer, running the work in the background so the human runs the
            business.
          </p>
        </div>

        {/* Honest-scarcity cohort row — the only real "trust" beat.
            Sits directly under the pedigree with no dead vertical space
            between them. Acid is used only for the live-dot marker; the
            rest is neutral so the block reads finished, not sold. */}
        <div
          className="p-5 flex items-center justify-between flex-wrap gap-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-acid live-dot" />
            <span className="font-mono uppercase text-xs tracking-widest text-text-hi">
              First cohort onboarding
            </span>
          </div>
          <div className="text-sm text-text-lo">
            Building with design partners. Signed brands — not published.
          </div>
        </div>
      </div>
    </section>
  );
}
