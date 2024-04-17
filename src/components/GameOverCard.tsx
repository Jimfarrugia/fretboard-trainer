export default function GameOverCard({
  currentScore,
  newHighScore,
  startGame,
}: {
  currentScore: number;
  newHighScore: boolean;
  startGame: () => void;
}) {
  return (
    <div className="absolute z-20 mt-2 rounded-lg border-2 border-light-heading bg-light-bg px-12 py-8 text-center dark:border-dark-heading dark:bg-dark-darkerBg">
      <p className="mb-6 text-xl font-bold">
        You scored{" "}
        <span className="text-light-link dark:text-dark-highlight">
          {currentScore}
        </span>{" "}
        points.
      </p>
      {newHighScore && (
        <p className="mb-8">Congratulations on your new high score!</p>
      )}
      <button
        type="button"
        className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
        onClick={startGame}
      >
        Play again
      </button>
    </div>
  );
}
