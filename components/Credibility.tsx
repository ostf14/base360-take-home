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
        {/* Anchor line — pedigree, no fake customer proof. Kicker
            and bottom cohort row both removed so the section reads
            as a single, quiet statement rather than three floating
            beats. */}
        <div>
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
      </div>
    </section>
  );
}
