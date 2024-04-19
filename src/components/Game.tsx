"use client";
import { useState, useEffect } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaMedal } from "react-icons/fa6";
import Fretboard from "./Fretboard";
import GameOverCard from "./GameOverCard";
import GameSettings from "./GameSettings";
import { notes } from "@/lib/constants";
import { randomNote, hideNoteLabels, findHighScore } from "@/lib/helpers";
import { useScores } from "@/context/ScoresContext";
import { useSession } from "next-auth/react";
import { createScore } from "@/actions/createScore";
import { IoClose } from "react-icons/io5";

export default function Game() {
  const [gameInProgress, setGameInProgress] = useState(false);
  const [allowSkip, setAllowSkip] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [timer, setTimer] = useState(60);
  const [currentScore, setCurrentScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const { scores, addScore } = useScores();
  const [showSettings, setShowSettings] = useState(false);
  const highScore = findHighScore(scores);
  const session = useSession();
  const userId = session?.data?.user?.id;

  const newChallenge = (previousChallenge: string) => {
    // remove previous challenge note from eligible notes for next challenge
    const eligibleNotes = notes.filter((note) => note !== previousChallenge);
    setChallenge(randomNote(eligibleNotes));
  };

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

  // save the new score
  useEffect(() => {
    if (gameOver) {
      const newScore = {
        points: currentScore,
        instrument: "Guitar",
        tuning: "Standard E",
        timestamp: new Date().toISOString(),
      };
      if (userId) {
        // add score to context + local storage
        addScore({ userId, ...newScore });
        // add score to the database
        createScore(userId, newScore);
      } else {
        addScore(newScore);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // Start a new game
  const startGame = () => {
    setGameOver(false);
    setGameInProgress(true);
    setCurrentScore(0);
    setNewHighScore(false);
    setTimer(20);
    newChallenge(challenge);
  };

  // Update newHighScore if needed as current score changes
  useEffect(() => {
    if (currentScore > highScore) {
      setNewHighScore(true);
    }
  }, [currentScore, highScore]);

  return (
    <>
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
          <GameOverCard
            currentScore={currentScore}
            newHighScore={newHighScore}
            setGameOver={setGameOver}
            startGame={startGame}
            userId={userId}
          />
        )}
        {/* Fretboard */}
        <Fretboard
          gameInProgress={gameInProgress}
          gameOver={gameOver}
          challenge={challenge}
          currentScore={currentScore}
          setCurrentScore={setCurrentScore}
          setAllowSkip={setAllowSkip}
          newChallenge={newChallenge}
        />
      </div>
      <div className="flex items-start justify-between pb-4 pt-2">
        {/* settings btn */}
        <div>
          <button
            type="button"
            className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings && <IoClose className="text-xl" />}
            {showSettings ? "Hide Settings" : "Settings"}
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
      {/* Settings */}
      {showSettings && <GameSettings />}
    </>
  );
}
