import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import PageContainer from "@/components/common/PageContainer";
import GlassCard from "@/components/common/GlassCard";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  return (
    <PageContainer>
      <GlassCard>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Heading */}
        <h1 className="text-center text-4xl font-bold text-white">
          Join Room
        </h1>

        {/* Description */}
        <p className="mt-3 text-center text-slate-400">
          Enter the room code shared by your friend.
        </p>

        <div className="mt-8 space-y-2">
            <label className="text-sm text-slate-300">
                Room Code
            </label>

            <Input
                placeholder="ABC123"
                value={roomCode}
                onChange={(e) =>
                setRoomCode(
                    e.target.value
                    .toUpperCase()
                    .replace(/\s/g, "")
                    .slice(0, 6)
                )
                }
                className="h-12 rounded-xl border-slate-700 bg-slate-900 text-center text-lg font-semibold tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-slate-500"
            />
            </div>
            <Button
                className="mt-8 h-12 w-full rounded-xl bg-violet-600 transition-all duration-200 hover:bg-violet-700 hover:scale-[1.02] active:scale-95"
                disabled={roomCode.length !== 6}
                onClick={() => navigate("/waiting-room")}
                >
                Join Room
                </Button>

      </GlassCard>
    </PageContainer>
  );
}