import { cn } from "@/lib/utils";

export default function GlassCard({ children, className }) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-3xl",
        "border border-white/10",
        "bg-white/5",
        "backdrop-blur-xl",
        "shadow-2xl",
        "p-8",
        className
      )}
    >
      {children}
    </div>
  );
}