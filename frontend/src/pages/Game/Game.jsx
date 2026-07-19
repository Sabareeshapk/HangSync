import { useEffect, useState } from "react";

import useGameStore from "@/store/gameStore";
import GameHeader from "@/components/game/GameHeader";
import CategorySelection from "@/components/game/CategorySelection";
import WaitingForCategory from "@/components/game/WaitingForCategory";
import WordSubmission from "@/components/game/WordSubmission";
import WaitingForWord from "@/components/game/WaitingForWord";
// import { connectSocket } from "@/services/websocket/socket";
import SetterBoard from "@/components/game/SetterBoard";
import GuesserBoard from "@/components/game/GuesserBoard";
import axios from "axios";
import ChatBox from "@/components/game/ChatBox";
import { useNavigate } from "react-router-dom";

import {
  connectSocket,
  disconnectSocket,
  on,
  send,
} from "@/services/websocket/socket";
export default function Game() {
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);
  const room = useGameStore((state) => state.room);
  console.log("ROOM:", room);
  const navigate = useNavigate();
const resetGame = useGameStore((state) => state.resetGame);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [hintText, setHintText] = useState("");
  const handleNextRound = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/game/next-round/`,
      {
        room_code: room.room_code,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const handlePlayAgain = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/game/play-again/`,
      {
        room_code: room.room_code,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const handleLeaveRoom = () => {
    send({
        type: "leave_room",
        player: localStorage.getItem("playerIdentity"),
    });

    disconnectSocket();

    localStorage.clear();

    resetGame();

    navigate("/");
};

const handleSendHint = async () => {
  if (!hintText.trim()) {
    alert("Please enter a hint.");
    return;
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/game/submit-hint/`,
      {
        room_code: room.room_code,
        hint: hintText,
      }
    );

    setHintText("");
    setShowHintPopup(false);

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error || "Unable to send hint");
  }
};

   const playerName = localStorage.getItem("playerName") || "";

  const isHost = room?.host_name === playerName;

  const myRole = isHost
    ? game?.host_role
    : game?.guest_role;

  useEffect(() => {
  if (!room?.room_code) return;

  const loadGame = async () => {
    try {
      console.log("Calling current-game API...");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/game/current-game/`,
        {
          params: {
            room_code: room.room_code,
          },
        }
      );
      console.log("Current Game Response:", res.data);

      setGame(res.data);

      connectSocket(
        room.room_code,
        localStorage.getItem("playerIdentity")
      );

      on("hint_requested", () => {
        const playerName = localStorage.getItem("playerName") || "";
        const isHost = room?.host_name === playerName;

        const currentRole = isHost
          ? useGameStore.getState().game?.host_role
          : useGameStore.getState().game?.guest_role;

        if (currentRole === "setter") {
          setShowHintPopup(true);
        }
      });

    } catch (err) {
      console.error(err);
    }
  };

  loadGame();

}, [room, setGame]);

  useEffect(() => {
    on("game_state", (data) => {
  console.log("Game Updated:", data.game);
  console.log("Hint 1:", data.game.hint_1);
  console.log("Hint Count:", data.game.hint_count);

  setGame(data.game);
});
  }, [setGame]);

useEffect(() => {
    on("player_left", () => {
        alert("Your opponent has left the game.");

        disconnectSocket();

        localStorage.removeItem("room");
        localStorage.removeItem("roomCode");
        localStorage.removeItem("playerIdentity");

        resetGame();

        navigate("/");
    });
}, [navigate, resetGame]);

  // const room = useGameStore((state) => state.room);

 
  
  const guesserName =
  game?.host_role === "guesser"
    ? room?.host_name
    : room?.guest_name;

const setterName =
  game?.host_role === "setter"
    ? room?.host_name
    : room?.guest_name;

  console.log("Host Name:", room?.host_name);
  console.log("Guest Name:", room?.guest_name);

  console.log("Host Role:", game?.host_role);
  console.log("Guest Role:", game?.guest_role);

  console.log("Guesser Name:", guesserName);
  console.log("Setter Name:", setterName);

  console.log("Status:", game?.status);

  return (
    <div className="min-h-screen bg-slate-950 p-3 text-white sm:p-4 md:flex md:items-center md:justify-center md:p-8">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl sm:p-6 md:p-8">

        <GameHeader />

        {!game && (
          <div className="text-center">
            <p className="text-slate-400 text-lg">
              Loading game...
            </p>
          </div>
        )}

        {game && (
          <>
           {/* Scoreboard */}
            <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h2 className="mb-4 text-center text-2xl font-bold text-yellow-400">
                🏆 Scoreboard
              </h2>

              <div className="flex flex-col gap-6 md:flex-row md:justify-around">

                {/* Host */}
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {room?.host_name}
                  </p>

                  <p className="text-sm text-slate-400 uppercase">
                    {game.host_role}
                  </p>

                  <p className="mt-2 text-4xl font-bold text-green-400">
                    {game.host_score}
                  </p>
                </div>

                {/* Guest */}
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {room?.guest_name}
                  </p>

                  <p className="text-sm text-slate-400 uppercase">
                    {game.guest_role}
                  </p>

                  <p className="mt-2 text-4xl font-bold text-blue-400">
                    {game.guest_score}
                  </p>
                </div>

              </div>
            </div>
            {/* <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-slate-400">Round</span>
                <span className="font-semibold">
                  {game.current_round}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Phase</span>
                <span className="text-emerald-400 font-semibold capitalize">
                  {game.phase}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span>
                  {game.category || "Not Selected"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Host Role</span>
                <span>{game.host_role}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Guest Role</span>
                <span>{game.guest_role}</span>
              </div>

            </div> */}

            <div className="mt-10">

              {game.phase === "category_selection" && (
                myRole === "guesser"
                  ? <CategorySelection />
                  : <WaitingForCategory />
              )}

              {game.phase === "word_submission" && (
                myRole === "setter"
                    ? <WordSubmission />
                    : <WaitingForWord />
              )}

              {game.match_over ? (

                <div className="text-center py-10">

                    <h1 className="text-6xl font-bold text-yellow-400">
                        🏆 Match Winner
                    </h1>

                    <p className="mt-6 text-3xl">
                        {game.match_winner === "host"
                            ? room.host_name
                            : room.guest_name}
                    </p>

                    <p className="mt-6 text-xl">
                        Final Score
                    </p>

                    <p className="text-5xl font-bold">
                        {game.host_score} - {game.guest_score}
                    </p>

                     <button
                        onClick={handlePlayAgain}
                        className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
                      >
                        🔄 Play Again
                      </button>

                </div>

                

             ) : game.status === "guesser_won" ? (

                <div className="text-center py-10">
                  <h1 className="text-5xl font-bold text-green-500">
                    🎉 {guesserName} Wins!
                  </h1>

                  <p className="mt-4 text-xl text-slate-300">
                    The word was: <span className="font-bold">{game.secret_word}</span>
                  </p>

                  <button
                    onClick={handleNextRound}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    Next Round
                  </button>
                </div>

              ) : game.status === "setter_won" ? (

                <div className="text-center py-10">
                  <h1 className="text-5xl font-bold text-red-500">
                  💀 {setterName} Wins!
                </h1>

                  <p className="mt-4 text-xl text-slate-300">
                    The word was: <span className="font-bold">{game.secret_word}</span>
                  </p>
                  <button
                    onClick={handleNextRound}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    Next Round
                  </button>

                </div>

                

              ) : (

                game.phase === "guessing" && (
                  myRole === "setter"
                    ? <SetterBoard />
                    : <GuesserBoard />
                )

              )}

            </div>

            <ChatBox />

            <button
              onClick={handleLeaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
              Leave Room
          </button>

          </>
        )}
      </div>

      {showHintPopup && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-slate-800 p-6 rounded-xl w-96">
      <h2 className="text-2xl font-bold mb-4">
        Hint Requested
      </h2>

      <input
        value={hintText}
        onChange={(e) => setHintText(e.target.value)}
        className="w-full rounded bg-slate-700 p-3"
        placeholder="Enter a hint..."
      />

      <button
        onClick={handleSendHint}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
        Send Hint
    </button>
    </div>
  </div>
)}

    </div>
  );
}