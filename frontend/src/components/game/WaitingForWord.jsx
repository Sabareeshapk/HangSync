import useGameStore from "@/store/gameStore";

export default function WaitingForWord() {
  const game = useGameStore((state) => state.game);

  return (
    <div className="mt-8 text-center">

      <h2 className="text-2xl font-bold">
        Waiting for setter...
      </h2>

      <p className="mt-4 text-slate-400">
        Category
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {game.category}
      </h3>

      <p className="mt-6 text-slate-500">
        Preparing your puzzle...
      </p>

    </div>
  );
}