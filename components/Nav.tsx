"use client";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
      style={{
        background: scrolled ? "rgba(10,10,11,0.6)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent",
      }}
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
              boxShadow: "0 0 20px rgba(223,255,0,0.35)",
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
