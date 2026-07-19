import { Copy, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getRoom } from "@/services/api/roomService";
import {
  connectSocket,
  disconnectSocket,
  on,
  send,
} from "@/services/websocket/socket";
import PageContainer from "@/components/common/PageContainer";
import GlassCard from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { startGame } from "@/services/api/roomService";
import useGameStore from "@/store/gameStore";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const setRoomStore = useGameStore((state) => state.setRoom);
const setGameStore = useGameStore((state) => state.setGame);
const resetGame = useGameStore((state) => state.resetGame);
  const roomCode = localStorage.getItem("roomCode") || "";

  const playerIdentity =
  localStorage.getItem("playerIdentity") || "";

  const [room, setRoomState] = useState(null);

  const isHost = playerIdentity === "host";

  useEffect(() => {
  if (!roomCode) return;

  const fetchRoom = async () => {
    try {
      const response = await getRoom(roomCode);
      console.log("GET ROOM RESPONSE", response.room);
      setRoomStore(response.room);
      setRoomState(response.room);

      localStorage.setItem(
        "room",
        JSON.stringify(response.room)
      );
    } catch (error) {
      console.error(error);
    }
  };

  fetchRoom();

  connectSocket(roomCode, playerIdentity);

  on("player_joined", (data) => {
  setRoomState((prev) => ({
    ...prev,
    guest_name: data.guest_name,
  }));
});

on("game_started", async (data) => {
  const response = await getRoom(roomCode);

  setRoomStore(response.room);
  setGameStore(data.game);

  navigate("/game");
});

on("player_left", () => {
  alert("Your opponent has left the room.");

  disconnectSocket();

  localStorage.clear();

  resetGame();

  navigate("/");
});

  return () => {
    disconnectSocket();
  };
}, [roomCode, navigate]);

const handleLeaveRoom = () => {
  send({
    type: "leave_room",
    player: playerIdentity,
  });

  disconnectSocket();

  localStorage.clear();

  resetGame();

  navigate("/");
};

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(room?.room_code || "");
    alert("Room code copied!");
  };

  

  return (
    <PageContainer>
      <GlassCard>

        {/* Leave */}
        <button
          onClick={handleLeaveRoom}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <LogOut size={18} />
          Leave Room
        </button>

        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-white">
          Waiting Room
        </h1>

        <p className="mt-3 text-center text-slate-400">
          Share this room code with your friend.
        </p>

        {/* Room Code */}
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-4">

          <p className="text-sm text-slate-400">
            Room Code
          </p>

          <div className="mt-2 flex items-center justify-between">

            <span className="text-2xl font-bold tracking-[0.3em] text-white">
              {room?.room_code || "------"}
            </span>

            <button
              onClick={copyRoomCode}
              className="rounded-lg p-2 transition hover:bg-slate-800"
            >
              <Copy size={20} />
            </button>

          </div>

        </div>

        {/* Host */}
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-4">

          <p className="text-sm text-slate-400">
            Host
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {room?.host_name || "Loading..."}
          </h2>

        </div>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">
            Guest
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {room?.guest_name || "Waiting for player..."}
          </h2>
        </div>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">
            Status
          </p>

          <h2 className="mt-2 text-xl font-semibold text-emerald-400">
            {room?.guest_name
              ? "Both players are ready!"
              : "Waiting for another player..."}
          </h2>
        </div>

        {room?.guest_name && isHost && (
          
          <Button
            className="mt-8 h-12 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700"
            onClick={async () => {
              try {
                await startGame(room.room_code);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Start Game
          </Button>
        )}

        {room?.guest_name && !isHost && (
          <p className="mt-8 text-center text-slate-400">
            Waiting for the host to start the game...
          </p>
        )}

        

      </GlassCard>
    </PageContainer>
  );
}