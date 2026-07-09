interface Props {
  size?: number;
  square?: boolean;
  ring?: boolean;
}

export function MayaAvatar({ size = 40, square = false, ring = false }: Props) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
  };
  return (
    <div
      className={`shrink-0 relative overflow-hidden ${
        square ? "" : "rounded-full"
      } ${ring ? "ring-2 ring-acid" : ""}`}
      style={style}
    >
      {/* Deep near-black fill. The fox emoji is warm orange-white,
          so it silhouettes strongly against the black without any
          extra silhouette-border. On the overlay the acid ring
          already traces the circle edge; anywhere else Maya renders
          she's on a darker background, so the disc reads as an
          object regardless. Same avatar across overlay, DM header,
          CRM header, closed system node. */}
      <div
        className="absolute inset-0"
        style={{ background: "#050506" }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: size * 0.72,
          lineHeight: 1,
          // OS color-emoji font stack — without this 🦊 can render as
          // a monochrome glyph and lose the warm-orange contrast that
          // makes the black background work.
          fontFamily:
            "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
        }}
        aria-hidden
      >
        🦊
      </div>
    </div>
  );
}
