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
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #F5A9D0 0%, #B37AE8 55%, #4A2B7A 100%)",
        }}
      />
      {/* Girl emoji sits centered on the pink→purple gradient. Sized
          a step larger than the old "M" glyph so its detail reads at
          40px, and shifted very slightly up so its face — not its
          hair — sits at the optical center of the circle. Same emoji
          everywhere Maya is rendered so she stays recognizable as
          one person across surfaces. */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: size * 0.7,
          lineHeight: 1,
          // Font family override matches the OS emoji fonts on the
          // main desktop targets so we don't get a monochrome fallback.
          fontFamily:
            "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
        }}
        aria-hidden
      >
        👧
      </div>
    </div>
  );
}
