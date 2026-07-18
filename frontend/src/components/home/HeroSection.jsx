import Logo from "@/components/common/Logo";
import { motion } from "framer-motion";
export default function HeroSection() {
return (
  <motion.section
    className="space-y-6 text-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Logo Illustration */}
    <div className="flex justify-center">
      {/* Logo Asset Goes Here */}
    </div>

    <Logo
      size="lg"
      showTagline
    />
  </motion.section>
);
}