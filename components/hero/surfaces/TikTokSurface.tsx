"use client";
import { motion } from "framer-motion";
import { MayaAvatar } from "../MayaAvatar";

interface CommentRow {
  handle: string;
  text: string;
  time: string;
  hue: string;
}

const COMMENTS: CommentRow[] = [
  { handle: "sam.k", text: "need this in my life", time: "2m", hue: "#5AD1FF" },
  { handle: "leah.mtl", text: "obsessed 🔥🔥", time: "3m", hue: "#FF8AB4" },
  { handle: "j.marra", text: "wait drop pls", time: "5m", hue: "#F7C64B" },
  { handle: "kev_.exe", text: "the packaging omg", time: "6m", hue: "#8CE888" },
];

interface Props {
  active: boolean;
  igniteProgress: number;
}

export function TikTokSurface({ active, igniteProgress }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col p-6 pt-12">
      {/* Post header — mimics TikTok floating chrome */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600" />
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-widest text-text-lo">
              @northbloom.co
            </span>
            <span className="text-[10px] font-mono text-text-lo/60">
              128.4K views · 3h ago
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-text-lo">
          <span className="w-1.5 h-1.5 rounded-full bg-acid live-dot" />
          live feed
        </div>
      </div>

      {/* Comments feed */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {COMMENTS.slice(0, 2).map((c, i) => (
          <CommentBubble key={c.handle} c={c} dim={active} delay={i * 0.05} />
        ))}

        {/* Maya's ignited comment */}
        <motion.div
          initial={false}
          animate={{
            scale: active ? 1.02 : 1,
            filter: active ? "brightness(1.05)" : "brightness(0.9)",
          }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div
            className="absolute -inset-2 rounded-lg pointer-events-none"
            style={{
              boxShadow: `0 0 40px ${active ? "rgba(223,255,0,0.35)" : "transparent"}`,
              border: `1px solid ${active ? "rgba(223,255,0,0.6)" : "transparent"}`,
              transition: "all 400ms ease",
            }}
          />
          <div className="relative flex gap-3 items-start p-2">
            <MayaAvatar size={36} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-text-hi">
                  maya.r
                </span>
                <span className="text-[10px] font-mono text-text-lo">just now</span>
              </div>
              <div className="text-sm text-text-hi">
                how much is this? <span>😍</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-text-lo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10z" />
              </svg>
              <span className="text-[10px] font-mono">4</span>
            </div>
          </div>
        </motion.div>

        {/* AI public reply — appears when comment ignites */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{
            opacity: igniteProgress > 0.35 ? 1 : 0,
            y: igniteProgress > 0.35 ? 0 : -6,
          }}
          transition={{ duration: 0.3 }}
          className="ml-12 flex items-start gap-2"
        >
          <div className="w-6 h-6 rounded-full bg-acid text-black flex items-center justify-center text-[10px] font-mono font-bold">
            N
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-text-hi">
                @northbloom.co
              </span>
              <span
                className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm"
                style={{
                  color: "var(--acid)",
                  background: "var(--acid-soft)",
                  border: "1px solid var(--acid)",
                }}
              >
                AI
              </span>
              <span className="text-[10px] font-mono text-text-lo">now</span>
            </div>
            <div className="text-xs text-text-hi">
              <TypedLine text="just slid into your DMs 💌" show={igniteProgress > 0.35} />
            </div>
          </div>
        </motion.div>

        {COMMENTS.slice(2).map((c, i) => (
          <CommentBubble key={c.handle} c={c} dim={active} delay={0.2 + i * 0.05} />
        ))}
      </div>
    </div>
  );
}

function CommentBubble({
  c,
  dim,
  delay,
}: {
  c: CommentRow;
  dim: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: dim ? 0.32 : 0.6 }}
      transition={{ duration: 0.4, delay }}
      className="flex gap-3 items-start p-2"
    >
      <div
        className="w-8 h-8 rounded-full shrink-0"
        style={{ background: c.hue }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-hi/80">@{c.handle}</span>
          <span className="text-[10px] font-mono text-text-lo">{c.time}</span>
        </div>
        <div className="text-sm text-text-hi/70">{c.text}</div>
      </div>
    </motion.div>
  );
}

function TypedLine({ text, show }: { text: string; show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      initial={{ width: 0 }}
      animate={{ width: "auto" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="inline-block overflow-hidden whitespace-nowrap align-bottom"
    >
      {text}
    </motion.span>
  );
}
