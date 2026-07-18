import { Copy, LogOut } from "lucide-react";

import PageContainer from "@/components/common/PageContainer";
import GlassCard from "@/components/common/GlassCard";

export default function WaitingRoom() {
  const roomCode = localStorage.getItem("roomCode") || "------";
  const playerName = localStorage.getItem("playerName") || "Player";

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    alert("Room code copied!");
  };

  return (
    <PageContainer>
      <GlassCard>

        {/* Leave */}
        <button className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white">
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
              {roomCode}
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
            {playerName}
          </h2>

        </div>

      </GlassCard>
    </PageContainer>
  );
}