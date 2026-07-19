import useGameStore from "@/store/gameStore";

export default function GameHeader() {
  const game = useGameStore((state) => state.game);
  const room = useGameStore((state) => state.room);

  const playerName = localStorage.getItem("playerName");

  const isHost = room?.host_name === playerName;

  const myRole = isHost
    ? game?.host_role
    : game?.guest_role;

  return (
    <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4 md:mb-8 md:p-6">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            🎮 HangSync
          </h1>

          <p className="text-slate-400 mt-2">
            Round {game?.current_round}
          </p>
        </div>

        <div className="text-left md:text-right">

          <p className="text-slate-400">
            Your Role
          </p>

          <h2 className="text-xl font-bold capitalize text-emerald-400 md:text-2xl">
            {myRole}
          </h2>

        </div>

      </div>

    </div>
  );
}