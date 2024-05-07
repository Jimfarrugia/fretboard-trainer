import { useState, useEffect } from "react";
import { MdReplay } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useScores } from "@/context/ScoresContext";
import PublishScoreForm from "./PublishScoreForm";
import { getScoreRanking } from "@/actions";
import { ordinal } from "@/lib/utils";

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
  const [rank, setRank] = useState(0);
  const {
    scores: [score], // score = first element in the scores array
  } = useScores();

  useEffect(() => {
    if (currentScore > 0) {
      getScoreRanking(currentScore)
        .then((rank) => setRank(rank || 0))
        .catch((e) => console.error("Failed to get score ranking.", e));
    }
  }, [currentScore]);

  return (
    <div
      data-testid="game-over-card"
      className="absolute z-20 mt-2 rounded-lg border-2 border-light-heading bg-light-bg p-8 text-center dark:border-dark-heading dark:bg-dark-darkerBg"
    >
      <div>
        <button
          type="button"
          className="btn btn-circle absolute right-2 top-2 scale-50 border-none bg-light-darkerBg text-light-heading hover:bg-error hover:text-light-bg focus-visible:outline-4 focus-visible:outline-light-link dark:bg-dark-bg dark:text-dark-link hover:dark:bg-error hover:dark:text-dark-darkerBg focus-visible:dark:outline-dark-highlight"
          style={{ marginRight: "-0.5rem", marginTop: "-0.5rem" }}
          onClick={() => setGameOver(false)}
        >
          <IoClose className="text-3xl" />
        </button>
      </div>
      {showForm ? (
        <>
          <h3 className="mb-6 text-xl font-bold text-light-heading dark:text-dark-heading">
            Publish Score
          </h3>
          <PublishScoreForm
            userId={userId}
            score={score}
            setIsOpen={setShowForm}
            startGame={startGame}
          />
        </>
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
            data-testid="play-again-button"
            type="button"
            className={`btn btn-primary ${userId && currentScore > 0 ? "mb-6" : ""} border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg`}
            onClick={startGame}
          >
            <MdReplay className="text-lg" />
            Play again
          </button>
          {userId && currentScore > 0 && (
            <>
              {rank > 0 && (
                <p className="mb-6 font-bold">
                  {rank === 1
                    ? "You achieved the top score!  You scored higher than everyone on the leaderboard!"
                    : `You achieved the ${ordinal(rank)} highest score!`}
                </p>
              )}
              <p className="mb-6">
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
