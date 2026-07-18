import { motion } from "framer-motion";
export default function HomeFooter() {
  return (
    <motion.div
  className="mt-10 text-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.6 }}
>
      <p className="text-sm text-slate-500">
        Built with ❤️ using React, Django & WebSockets
      </p>

      <p className="mt-2 text-xs text-slate-600">
        Version 1.0.0
      </p>
    </motion.div>
  );
}