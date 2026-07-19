import { useState } from "react";
import { Button } from "@/components/ui/button";
import useGameStore from "@/store/gameStore";
import axios from "axios";

export default function CategorySelection() {
  const [category, setCategory] = useState("");

  const room = useGameStore((state) => state.room);

  const submitCategory = async () => {
    if (!category.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/game/category/`, {
        room_code: room.room_code,
        category,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Choose a Category
      </h2>

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Example: Marvel Heroes"
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-violet-500"
      />

      <Button
        className="mt-6 w-full"
        onClick={submitCategory}
      >
        Continue
      </Button>

    </div>
  );
}