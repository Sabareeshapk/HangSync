import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "rounded-3xl",
        "border border-slate-800",
        "bg-slate-900/90",
        "backdrop-blur-md",
        "shadow-2xl",
        "p-8",
        className
      )}
    >
      {children}
    </div>
  );
}