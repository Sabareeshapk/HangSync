const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Keyboard({
  onLetterClick,
  correctLetters,
  wrongLetters,
}) {
  return (
    <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-7 md:mt-8">
      {letters.map((letter) => {
        const isCorrect = correctLetters.includes(letter);
        const isWrong = wrongLetters.includes(letter);

        return (
          <button
            key={letter}
            onClick={() => onLetterClick(letter)}
            disabled={isCorrect || isWrong}
            className={`
  rounded-lg
  py-3
  text-sm
  font-bold
  transition
  sm:p-3
  sm:text-base

  ${
    isCorrect
      ? "bg-green-600"
      : isWrong
      ? "bg-red-600"
      : "bg-slate-800 hover:bg-slate-700"
  }

  ${
    isCorrect || isWrong
      ? "cursor-not-allowed opacity-70"
      : ""
  }
`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}