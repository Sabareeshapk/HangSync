import useGameStore from "@/store/gameStore";
import HangmanDrawing from "./HangmanDrawing";
export default function SetterBoard() {
  const game = useGameStore((state) => state.game);

  return (
    <div className="space-y-6">

      <h2 className="text-center text-xl font-bold md:text-2xl">
        {game.category}
      </h2>

      <div>
        <p className="text-slate-400 mb-2">
          Secret Word
        </p>

        <div className="break-words rounded-lg bg-slate-800 p-4 text-center text-lg font-bold md:text-xl">
          {game.secret_word}
        </div>
      </div>

      <div className="overflow-x-auto text-center font-mono text-2xl tracking-[0.3em] md:text-4xl">
        {game.revealed_word.split("").join(" ")}
    </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold text-red-400 text-center">
          ❤️ Lives: {game.remaining_lives}
        </p>

        <HangmanDrawing lives={game.remaining_lives} />
      </div>

    </div>
  );
}