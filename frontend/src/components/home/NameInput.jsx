// import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

  export default function NameInput({
  playerName,
  setPlayerName,
}) {

  const handleChange = (e) => {
  const value = e.target.value;

  if (value.length <= 20) {
    setPlayerName(value);
    localStorage.setItem("playerName", value);
  }
};

  return (
  <motion.div
    className="mt-6 space-y-2 sm:mt-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Input
      placeholder="Enter your name"
      value={playerName}
      onChange={handleChange}
      className="h-12 w-full rounded-xl border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:ring-violet-500 sm:h-14"
    />

    <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
      <span>Your display name</span>
      <span>{playerName.length}/20</span>
    </div>
  </motion.div>
);
}