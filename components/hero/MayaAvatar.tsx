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
      <div
        className="absolute inset-0 flex items-center justify-center text-white"
        style={{ fontSize: size * 0.42, fontWeight: 700 }}
      >
        M
      </div>
    </div>
  );
}
