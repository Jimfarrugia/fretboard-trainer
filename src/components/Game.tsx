"use client";
import { useState, useEffect } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaMedal } from "react-icons/fa6";
import Fretboard from "./Fretboard";
import { randomNote, notes, hideNoteLabels, findHighScore } from "@/helpers";
import { useScores } from "@/context/ScoresContext";

export default function Game() {
  const [gameInProgress, setGameInProgress] = useState(false);
  const [allowSkip, setAllowSkip] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [timer, setTimer] = useState(60);
  const [currentScore, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const { scores, addScore } = useScores();

  const newChallenge = (previousChallenge: string) => {
    // remove previous challenge note from eligible notes for next challenge
    const eligibleNotes = notes.filter((note) => note !== previousChallenge);
    setChallenge(randomNote(eligibleNotes));
  };

  // Find highest score in scores array and set high score
  useEffect(() => {
    if (scores.length > 0) {
      setHighScore(findHighScore(scores));
    }
  }, [scores]);

  // Countdown the timer and end the game when time runs out
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (gameInProgress && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      hideNoteLabels();
      setGameInProgress(false);
      setGameOver(true);
      setAllowSkip(false);
      setChallenge("");
    }
    return () => clearInterval(interval);
  }, [timer, gameInProgress]);

  // save the new score in scores context
  useEffect(() => {
    if (gameOver) {
      const newScore = {
        points: currentScore,
        instrument: "Guitar",
        tuning: "Standard E",
        timestamp: new Date().toISOString(),
      };
      addScore(newScore);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // Start a new game
  const startGame = () => {
    setGameOver(false);
    setGameInProgress(true);
    setScore(0);
    setNewHighScore(false);
    setTimer(5);
    newChallenge(challenge);
  };

  // Update high score if needed as current score changes
  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      setNewHighScore(true);
    }
  }, [currentScore, highScore]);

  // TODO: pass 'strings[]' to Fretboard as a prop

  return (
    <div>
      {/* {gameInProgress && (
        <button onClick={() => setGameInProgress(false)}>STOP</button>
      )} */}
      <div
        className={`flex items-center ${gameInProgress || gameOver ? "justify-between" : "justify-around"} pb-2 ${gameOver && "opacity-25"}`}
      >
        {/* timer */}
        <div
          className={`flex ${!gameInProgress && !gameOver && "hidden"} items-center gap-1`}
        >
          <BsStopwatch className="text-xl" />
          <span>{timer}</span>
        </div>
        {/* challenge/start btn */}
        <div className="text-xl font-bold">
          {gameInProgress ? (
            <>
              {"Find "}
              <span className="text-light-link dark:text-dark-highlight">
                {/* challenge */}
                {challenge}
              </span>
            </>
          ) : gameOver ? (
            <>{"Time's up!"}</>
          ) : (
            <button
              type="button"
              className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
              onClick={startGame}
            >
              START
            </button>
          )}
        </div>
        {/* current score */}
        <div
          className={`flex ${!gameInProgress && !gameOver && "hidden"} items-center gap-1`}
        >
          <span>{currentScore}</span>
          <FaRegCircleCheck className="text-xl" />
        </div>
      </div>
      {/* Game Over Card */}
      <div className="relative flex justify-center">
        {gameOver && (
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
        )}
        {/* Fretboard */}
        <Fretboard
          gameInProgress={gameInProgress}
          gameOver={gameOver}
          challenge={challenge}
          score={currentScore}
          setScore={setScore}
          setAllowSkip={setAllowSkip}
          newChallenge={newChallenge}
        />
      </div>
      <div className="flex items-start justify-between pt-2">
        {/* settings btn */}
        <div>
          <button
            type="button"
            className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
          >
            Settings
          </button>
        </div>
        {/* skip btn */}
        <div>
          <button
            type="button"
            className={`${(gameInProgress && allowSkip) || "hidden"} btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg`}
            onClick={() => {
              hideNoteLabels();
              newChallenge(challenge);
            }}
          >
            Skip
          </button>
        </div>
        {/* high score */}
        <div className={`flex items-center gap-1 ${gameOver && "opacity-25"}`}>
          <span>{highScore}</span>
          <FaMedal className="text-xl" />
        </div>
      </div>
    </div>
  );
}
