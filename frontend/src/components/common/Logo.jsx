import { cn } from "@/lib/utils";

export default function Logo({
  size = "lg",
  showTagline = true,
}) {
  const sizes = {
    sm: {
      title: "text-3xl",
      subtitle: "text-sm",
    },
    md: {
      title: "text-5xl",
      subtitle: "text-base",
    },
    lg: {
      title: "text-6xl",
      subtitle: "text-lg",
    },
  };

  return (
    <div className="text-center">
      <h1
        className={cn(
          "font-black tracking-tight",
          sizes[size].title
        )}
      >
        <span className="text-white">Hang</span>
        <span className="text-violet-500">Sync</span>
      </h1>

      {showTagline && (
        <p
          className={cn(
            "mt-3 text-slate-400",
            sizes[size].subtitle
          )}
        >
          Real-time Multiplayer Hangman
        </p>
      )}
    </div>
  );
}