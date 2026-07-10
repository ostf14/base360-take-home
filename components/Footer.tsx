export function Footer() {
  return (
    <footer
      className="px-8 py-10 flex items-center justify-between font-mono uppercase text-xs tracking-widest text-text-lo"
      style={{
        borderTop: "1px solid var(--hairline)",
        background: "var(--bg)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-3 h-3 bg-acid"
          style={{
            clipPath:
              "polygon(0 2px, 2px 2px, 2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px))",
          }}
        />
        <span>BASE360</span>
        <span className="text-text-lo/40">·</span>
        <span>pre-launch</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-text-hi transition-colors">
          contact
        </a>
        <a href="#" className="hover:text-text-hi transition-colors">
          privacy
        </a>
        <a href="#" className="hover:text-text-hi transition-colors">
          &copy; {new Date().getFullYear()}
        </a>
      </div>
    </footer>
  );
}
