"use client";
import { ReactNode } from "react";

interface Props {
  url: string;
  tabs?: { label: string; active?: boolean }[];
  children: ReactNode;
}

// Enterprise-app desktop window: rounded title bar with traffic lights, a
// mono URL/breadcrumb chip, optional secondary tabs, and a heavier content
// slab. Reads as an internal system — the "lead just entered the system"
// contrast against the phone shells is the point.
export function WindowShell({ url, tabs, children }: Props) {
  return (
    <div className="absolute inset-0 p-6 pt-12 flex items-stretch">
      <div
        className="relative flex-1 flex flex-col overflow-hidden"
        style={{
          borderRadius: 14,
          background: "var(--surface-panel)",
          border: "1px solid var(--hairline)",
          boxShadow: "var(--specimen-shadow)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 border-b"
          style={{
            background: "var(--surface-panel-2)",
            borderColor: "var(--hairline)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <TrafficLight color="rgba(255,95,86,0.7)" />
            <TrafficLight color="rgba(255,189,46,0.7)" />
            <TrafficLight color="rgba(39,201,63,0.7)" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md flex-1 max-w-xl"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid var(--hairline)",
            }}
          >
            <span className="text-[9px] font-mono text-text-lo/60">▲</span>
            <span className="text-[10px] font-mono text-text-lo tracking-wider truncate">
              {url}
            </span>
          </div>
          <div className="flex items-center gap-3 text-text-lo/70 text-xs font-mono">
            <span>⌄</span>
            <span>⊞</span>
            <span>⋯</span>
          </div>
        </div>

        {/* Optional tab strip */}
        {tabs && tabs.length > 0 && (
          <div
            className="flex items-center gap-1 px-3 border-b overflow-x-auto no-scrollbar"
            style={{
              background: "var(--surface-panel-2)",
              borderColor: "var(--hairline)",
            }}
          >
            {tabs.map((t, i) => (
              <div
                key={i}
                className="text-[10px] font-mono uppercase tracking-widest px-3 py-2 relative"
                style={{
                  color: t.active ? "var(--text-hi)" : "var(--text-lo)",
                }}
              >
                {t.label}
                {t.active && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-px"
                    style={{ background: "var(--text-hi)" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function TrafficLight({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 11,
        height: 11,
        borderRadius: "50%",
        background: color,
      }}
    />
  );
}
