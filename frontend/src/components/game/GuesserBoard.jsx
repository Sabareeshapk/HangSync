import useGameStore from "@/store/gameStore";
import Keyboard from "./Keyboard";
import axios from "axios";
import HangmanDrawing from "./HangmanDrawing";
export default function GuesserBoard() {
const game = useGameStore((state) => state.game);

const room = useGameStore((state) => state.room);

const handleLetterClick = async (letter) => {
    try {
        await axios.post(
            "http://127.0.0.1:8000/api/game/guess/",
            {
                room_code: room.room_code,
                letter,
            }
        );
    } catch (err) {
        console.error(err);
    }
};

const handleRequestHint = async () => {
  try {
    await axios.post(
      "http://127.0.0.1:8000/api/game/request-hint/",
      {
        room_code: room.room_code,
      }
    );
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error || "Unable to request hint");
  }
};

  return (
    <div className="space-y-6">

      <h2 className="text-center text-xl font-bold md:text-2xl">
        {game.category}
      </h2>

      <div className="overflow-x-auto text-center font-mono text-2xl tracking-[0.3em] md:text-4xl">
        {game.revealed_word.split("").join(" ")}
    </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold text-red-400 text-center">
          ❤️ Lives: {game.remaining_lives}
        </p>

        <HangmanDrawing lives={game.remaining_lives} />
      </div>

      <p className="text-slate-400">
        Waiting for first guess...
      </p>

      <button
        onClick={handleRequestHint}
        disabled={game?.hint_count >= 3}
        className="mt-6 w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-500 md:w-auto"
      >
        {game?.hint_count >= 3 ? "No Hints Left" : "Request Hint"}
      </button>

      <div className="mt-6 rounded-lg bg-slate-800 p-4 text-sm md:text-base">
        <h3 className="text-lg font-semibold mb-2">
          💡 Hints
        </h3>

        {game.hint_1 && (
          <p className="mb-2">1. {game.hint_1}</p>
        )}

        {game.hint_2 && (
          <p className="mb-2">2. {game.hint_2}</p>
        )}

        {game.hint_3 && (
          <p>3. {game.hint_3}</p>
        )}

        {!game.hint_1 &&
        !game.hint_2 &&
        !game.hint_3 && (
            <p className="text-slate-400">
              No hints yet.
            </p>
        )}
      </div>

      <Keyboard
        onLetterClick={handleLetterClick}
        correctLetters={game.correct_letters}
        wrongLetters={game.wrong_letters}
      />

    </div>
  );
}