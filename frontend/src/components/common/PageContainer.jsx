import BackgroundEffects from "./BackgroundEffects";

export default function PageContainer({ children }) {
  return (
    <main className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-6">

      <BackgroundEffects />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>

    </main>
  );
}