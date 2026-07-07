"use client";
import { useEffect, useState } from "react";

// Desktop-only, by design. On sub-desktop widths we degrade to a static
// notice — the mobile stacked-column variant described in the brief is
// intentionally out of scope for this prototype.
export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const check = () => setOk(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!ok) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-md text-center flex flex-col gap-4">
          <div className="text-xs font-mono uppercase tracking-widest text-acid">
            &gt; base360
          </div>
          <div className="font-display text-2xl text-text-hi">
            Desktop for now.
          </div>
          <p className="text-sm text-text-lo">
            The scroll story is desktop-only in this prototype. Open on a laptop
            to watch one comment travel through the system.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
