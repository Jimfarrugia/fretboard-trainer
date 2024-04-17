import { useState } from "react";
import { MdReplay } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import PublishScoreForm from "./PublishScoreForm";

export default function GameOverCard({
  currentScore,
  newHighScore,
  setGameOver,
  startGame,
  userId,
}: {
  currentScore: number;
  newHighScore: boolean;
  setGameOver: (over: boolean) => void;
  startGame: () => void;
  userId: string | undefined;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="absolute z-20 mt-2 rounded-lg border-2 border-light-heading bg-light-bg p-8 text-center dark:border-dark-heading dark:bg-dark-darkerBg">
      <div>
        <button
          type="button"
          className="btn btn-circle absolute right-1 top-1 scale-50 border-none bg-light-darkerBg text-light-heading hover:bg-light-link hover:text-light-bg dark:bg-dark-bg dark:text-dark-link hover:dark:bg-error hover:dark:text-dark-darkerBg"
          onClick={() => setGameOver(false)}
        >
          <IoClose className="text-3xl" />
        </button>
      </div>
      {showForm ? (
        <PublishScoreForm
          userId={userId}
          setShowForm={setShowForm}
          startGame={startGame}
        />
      ) : (
        <>
          <p className="mb-6 text-xl font-bold">
            You scored{" "}
            <span className="text-light-link dark:text-dark-highlight">
              {currentScore}
            </span>{" "}
            points.
          </p>
          {newHighScore && (
            <p className="mb-6">Congratulations on your new high score!</p>
          )}
          <button
            type="button"
            className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
            onClick={startGame}
          >
            <MdReplay className="text-lg" />
            Play again
          </button>
          {userId && (
            <>
              <p className="mt-6 font-bold">
                You achieved the Xth highest score!
              </p>
              <p className="my-6">
                Would you like to publish your score to the leaderboard?
              </p>
              <button
                type="button"
                className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
                onClick={() => setShowForm(true)}
              >
                <IoIosSend className="text-lg" />
                Publish Score
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
