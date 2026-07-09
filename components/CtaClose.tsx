"use client";
import { useState } from "react";

export function CtaClose() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="waitlist"
      className="relative py-40 px-8 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Pixel-stepped acid slab bleeding in from the right, FEDORIV-style */}
      <PixelSlab />

      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center relative z-10">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-6xl leading-[0.98] font-bold text-text-hi tracking-tight">
            One comment.
            <br />
            <span className="text-acid">Every channel.</span>
            <br />
            Closed — automatically.
          </h2>
          <p className="text-text-lo text-lg max-w-md">
            Join the waitlist for Base360. We're onboarding design partners now
            — first customers pay the first-customer price.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col gap-4 relative z-10"
        >
          <div
            className="flex flex-col gap-3 p-8"
            style={{
              background: "rgba(20,20,22,0.75)",
              border: "1px solid var(--acid)",
              backdropFilter: "blur(6px)",
            }}
          >
            <label className="text-[10px] font-mono uppercase tracking-widest text-acid">
              request access
            </label>
            <input
              type="email"
              required
              value={email}
              disabled={submitted}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@brand.co"
              className="bg-transparent text-text-hi text-lg py-3 outline-none border-b focus:border-acid transition-colors"
              style={{ borderColor: "var(--hairline)" }}
            />
            <button
              type="submit"
              disabled={submitted}
              className="mt-4 font-mono uppercase text-sm py-3 tracking-widest transition-transform hover:-translate-y-px disabled:opacity-70"
              style={{
                background: "var(--acid)",
                color: "#0A0A0B",
                fontWeight: 700,
                boxShadow: "0 0 32px rgba(223,255,0,0.4)",
              }}
            >
              {submitted ? "> queued · you'll hear back" : "Join the waitlist"}
            </button>
            <div className="text-[10px] font-mono text-text-lo text-center mt-1">
              no spam · one email when we open the cohort
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function PixelSlab() {
  // A stepped, pixelated chartreuse block bleeding from the right edge —
  // the FEDORIV move. Purely decorative.
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-0">
        {Array.from({ length: 12 }).map((_, i) => {
          const w = 160 + Math.abs(6 - i) * 24;
          return (
            <div
              key={i}
              className="h-6"
              style={{
                width: w,
                background: "var(--acid)",
                opacity: 0.08 + (i % 3) * 0.02,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
