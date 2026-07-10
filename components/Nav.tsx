"use client";
import { DESIGN_SYSTEM_BAR_HEIGHT } from "@/components/DesignSystemPanel";

// Transparent floating nav. No background plate and no bottom border,
// even when the page is scrolled — the story surfaces slide beneath
// the nav row (BASE360 wordmark, links, CTA) without ever being
// clipped by a nav strip. The nav still holds z-50 so its content
// stays clickable above the sticky story frame. Shifted down by the
// design-system top bar's height so it doesn't sit underneath it.
export function Nav() {
  return (
    <nav
      className="fixed left-0 right-0 z-50"
      style={{ background: "transparent", top: DESIGN_SYSTEM_BAR_HEIGHT }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 bg-acid"
            style={{
              clipPath:
                "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
            }}
          />
          <span className="font-mono uppercase text-sm tracking-widest font-bold text-text-hi">
            BASE360
          </span>
        </div>
        <div className="flex items-center gap-8">
          <NavLink href="#story">The story</NavLink>
          <NavLink href="#waitlist">Access</NavLink>
          <a
            href="#waitlist"
            className="font-mono uppercase text-xs px-3 py-2 tracking-wider transition-transform hover:-translate-y-px"
            style={{
              background: "var(--acid)",
              color: "#0A0A0B",
              fontWeight: 700,
              boxShadow: "var(--acid-halo-sm)",
            }}
          >
            Get early access
          </a>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-mono uppercase text-xs tracking-widest text-text-lo hover:text-text-hi transition-colors"
    >
      {children}
    </a>
  );
}
