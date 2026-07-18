export default function BackgroundEffects() {
  return (
    <>
      {/* Top Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

      {/* Bottom Left Glow */}
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Bottom Right Glow */}
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
    </>
  );
}