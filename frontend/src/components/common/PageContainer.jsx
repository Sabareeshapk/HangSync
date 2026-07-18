import BackgroundEffects from "./BackgroundEffects";

export default function PageContainer({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <BackgroundEffects />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}