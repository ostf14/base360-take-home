"use client";
import { ReactNode } from "react";

interface Props {
  platform: "tiktok" | "instagram";
  children: ReactNode;
}

// Portrait phone frame with a bezel, dynamic-island notch, and mono status
// bar. Reads as "on someone's phone / a social app" — deliberately NOT
// dashboard chrome. Shared by TikTok and DM so both social surfaces speak
// the same visual language.
export function PhoneShell({ platform, children }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 pt-12">
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          // Slimmer device. Narrower width and a lower max-height make
          // enough room for the entire TikTok feed — including Maya's
          // comment — to sit ABOVE the bottom crop when the phone is
          // rising out of the hero. Corners scaled proportionally.
          width: 320,
          height: "min(640px, 100%)",
          borderRadius: "var(--radius-2xl)",
          padding: "var(--space-2)",
          // Bezel is a step lighter than --bg so the phone silhouette
          // reads against the near-black canvas. Kept neutral grey — the
          // Maya avatar stays the brightest thing in the frame.
          background: "var(--surface-2)",
          // Rim + separator ring + drop + acid whisper all live in the
          // shared token; no need for the old ad-hoc overlays.
          boxShadow: "var(--specimen-shadow)",
        }}
      >
        <div
          className="relative flex flex-col flex-1 overflow-hidden"
          style={{
            // Inner phone screen — snaps to --radius-xl (22 px), the
            // one step below the shell's --radius-2xl (40 px).
            borderRadius: "var(--radius-xl)",
            background: "var(--surface)",
          }}
        >
          {/* Dynamic-island notch */}
          <div
            aria-hidden
            className="absolute top-2 left-1/2 -translate-x-1/2 z-30"
            style={{
              width: 96,
              height: 26,
              borderRadius: "var(--radius-xl)",
              background: "#050506",
            }}
          />
          {/* Status bar — muted mono, no acid */}
          <div className="relative z-20 flex items-center justify-between px-6 pt-2.5 pb-1.5 text-[10px] font-mono text-text-lo/80">
            <span>9:41</span>
            <span className="opacity-0 select-none">•</span>
            <span className="flex items-center gap-1.5">
              <SignalGlyph />
              <BatteryGlyph />
            </span>
          </div>
          {/* Platform bar under status */}
          <div
            className="relative z-10 flex items-center justify-between px-4 py-2 border-b"
            style={{ borderColor: "var(--hairline)" }}
          >
            {platform === "tiktok" ? (
              <>
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-hi">
                  For You
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-lo/70">
                  Following
                </span>
                <span className="text-[10px] text-text-lo">🔍</span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-mono text-text-lo/80">←</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-hi">
                  Messages
                </span>
                <span className="text-[11px] font-mono text-text-lo/80">✎</span>
              </>
            )}
          </div>
          {/* Content area — filled by the surface */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
          {/* Home indicator */}
          <div className="pt-1.5 pb-2 flex justify-center">
            <div
              className="w-24 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.28)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalGlyph() {
  return (
    <span className="inline-flex items-end gap-[1.5px]">
      {[3, 5, 7, 9].map((h) => (
        <span
          key={h}
          style={{
            width: 2,
            height: h,
            background: "var(--text-lo)",
            borderRadius: 1,
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

function BatteryGlyph() {
  return (
    <span
      className="inline-block"
      style={{
        width: 18,
        height: 8,
        border: "1px solid var(--text-lo)",
        borderRadius: 2,
        position: "relative",
      }}
    >
      <span
        className="absolute"
        style={{
          top: 1,
          left: 1,
          bottom: 1,
          width: 12,
          background: "var(--text-lo)",
          borderRadius: 1,
        }}
      />
    </span>
  );
}
