export default function Badge({ children, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full",
        "border border-zinc-800 bg-zinc-950/40",
        "px-2.5 py-1 text-xs leading-none text-zinc-300",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
