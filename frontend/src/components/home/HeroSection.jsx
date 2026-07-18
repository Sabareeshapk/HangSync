import Logo from "@/components/common/Logo";

export default function HeroSection() {
  return (
    <section className="space-y-6 text-center">

      {/* Logo Illustration */}
      <div className="flex justify-center">
        {/* Logo Asset Goes Here */}
      </div>

      <Logo
        size="lg"
        showTagline
      />

    </section>
  );
}