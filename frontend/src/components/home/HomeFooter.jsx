import { motion } from "framer-motion";
export default function HomeFooter() {
  return (
    <motion.div
  className="mt-8 px-4 text-center sm:mt-10"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.6 }}
>
      <p className="text-xs text-slate-500 sm:text-sm">
        Built with ❤️ using React, Django & WebSockets
      </p>

      <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">
        Version 1.0.0
      </p>
    </motion.div>
  );
}