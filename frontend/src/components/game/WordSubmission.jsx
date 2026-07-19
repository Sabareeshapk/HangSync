import { useState } from "react";
import { Button } from "@/components/ui/button";
import useGameStore from "@/store/gameStore";
import axios from "axios";

export default function WordSubmission() {
  const [secretWord, setSecretWord] = useState("");

  const game = useGameStore((state) => state.game);
  const room = useGameStore((state) => state.room);

  const submitWord = async () => {
    if (!secretWord.trim()) return;

    try {
        await axios.post(
        `${import.meta.env.VITE_API_URL}/api/game/word/`,
        {
            room_code: room.room_code,
            secret_word: secretWord,
        }
        );
    } catch (err) {
        console.error(err);
    }
    };

  return (
    <div className="mt-8">

      <h2 className="text-2xl font-bold mb-4">
        Secret Word
      </h2>

      <p className="text-slate-400 mb-6">
        Category: <span className="text-white">{game.category}</span>
      </p>

      <input
        type="text"
        value={secretWord}
        onChange={(e) => setSecretWord(e.target.value)}
        placeholder="Enter Secret Word"
        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
      />

      <Button
        className="mt-6 w-full"
        onClick={submitWord}
        >
        Continue
        </Button>

    </div>
  );
}