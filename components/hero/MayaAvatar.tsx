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
      {/* Neutral light-grey fill (a step darker than the panda's
          white face) so the 🐼 silhouette contrasts. A subtle dark
          inset border traces the circle edge — the panda is white +
          black on white belly, so without a border the head can
          bleed into a plain light-grey fill. Same avatar across
          overlay, DM header, CRM header, closed system node. */}
      <div
        className="absolute inset-0"
        style={{
          background: "#B4B4B9",
          boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.22)",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: size * 0.72,
          lineHeight: 1,
          // OS color-emoji font stack — otherwise 🐼 can render as a
          // monochrome glyph and lose the black-eye-patches contrast.
          fontFamily:
            "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
        }}
        aria-hidden
      >
        🐼
      </div>
    </div>
  );
}
