export function Credibility() {
  return (
    <section
      id="pedigree"
      className="relative py-32 px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Anchor line — pedigree, no fake customer proof */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-acid mb-4">
            &gt; pedigree
          </div>
          <p className="font-display text-3xl leading-tight text-text-hi">
            From the team that scaled a short-term-rental operator to an{" "}
            <span className="text-acid">8-figure portfolio</span> — on its own
            software.
          </p>
          <p className="mt-6 text-text-lo text-sm max-w-xl">
            Base360 is the same architecture, generalized: one system for the
            customer, running the work in the background so the human runs the
            business.
          </p>
        </div>

        {/* Backed by row — placeholder marks intentionally */}
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-lo">
            backed by
          </div>
          <div className="flex items-center gap-10 flex-wrap">
            {["ANGEL COLLECTIVE", "FUND 001", "FUND 002", "SEED SYNDICATE"].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 opacity-40"
                >
                  <div
                    className="w-6 h-6"
                    style={{
                      background: "var(--text-lo)",
                      clipPath:
                        "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
                    }}
                  />
                  <span className="font-mono uppercase text-xs tracking-widest text-text-lo">
                    {label}
                  </span>
                </div>
              )
            )}
            <span className="font-mono uppercase text-[9px] text-text-lo/50 ml-auto">
              [ placeholder — final logos post-close ]
            </span>
          </div>
        </div>

        {/* Honest scarcity — no fake metrics */}
        <div
          className="p-6 flex items-center justify-between flex-wrap gap-4"
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
