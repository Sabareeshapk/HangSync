import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import generateRoomCode from "@/utils/generateRoomCode";
import { motion } from "framer-motion";
export default function ActionButtons({ playerName }) {
  const navigate = useNavigate();
//   const playerName = localStorage.getItem("playerName") || "";
  const isNameEntered = playerName.trim().length > 0;

  const handleCreateRoom = () => {
  const roomCode = generateRoomCode();

  localStorage.setItem("roomCode", roomCode);

  navigate("/waiting-room");
};

  return (
    <motion.div
        className="mt-8 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        >
      <Button
        size="lg"
        disabled={!isNameEntered}
        className="h-12 rounded-xl bg-violet-600 transition-all duration-200 hover:bg-violet-700 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleCreateRoom}
      >
        <Plus className="mr-2 h-5 w-5" />
        Create Room
      </Button>

      <Button
        size="lg"
        disabled={!isNameEntered}
        variant="outline"
        className="h-12 rounded-xl border-slate-700 bg-transparent text-white transition-all duration-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => navigate("/join-room")}
      >
        <LogIn className="mr-2 h-5 w-5" />
        Join Room
      </Button>
    </motion.div>
  );
}