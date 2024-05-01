"use client";
import { useState, useEffect } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaMedal } from "react-icons/fa6";
import Fretboard from "./Fretboard";
import GameOverCard from "./GameOverCard";
import GameSettings from "./GameSettings";
import {
  naturalNotes,
  notesWithFlats,
  notesWithSharps,
  notesWithSharpsAndFlats,
  defaultSettings,
} from "@/lib/constants";
import {
  randomNote,
  hideNoteLabels,
  findHighScore,
  ordinal,
} from "@/lib/helpers";
import { useScores } from "@/context/ScoresContext";
import { useSession } from "next-auth/react";
import { IoClose } from "react-icons/io5";
import { useSettings } from "@/context/SettingsContext";

export default function Game() {
  const {
    tuning,
    instrument,
    enabledStrings,
    sharps,
    flats,
    hardMode,
    setEnabledStrings,
  } = useSettings();
  const [gameInProgress, setGameInProgress] = useState(false);
  const [allowSkip, setAllowSkip] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [challengeString, setChallengeString] = useState<number | undefined>(
    undefined,
  );
  const [timer, setTimer] = useState(60);
  const [currentScore, setCurrentScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [quitGame, setQuitGame] = useState(false);
  const { scores, addScore } = useScores();
  const [showSettings, setShowSettings] = useState(false);
  const highScore = findHighScore(scores);
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [isStartDisabled, setIsStartDisabled] = useState(false);
  const gameLength = process.env.NODE_ENV !== "production" ? 10 : 30;

  const notes =
    sharps && flats
      ? notesWithSharpsAndFlats
      : sharps
        ? notesWithSharps
        : flats
          ? notesWithFlats
          : naturalNotes;

  const newChallenge = (previousChallenge: string) => {
    // remove previous challenge note from eligible notes for next challenge
    const eligibleNotes = !previousChallenge
      ? notes
      : notes.filter((note) => {
          // IF using both sharps and flats AND previous challenge was a sharp/flat
          // (notesWithSharpsAndFlats will be in use, so check if 'note' INCLUDES the previous challenge)
          return sharps && flats && previousChallenge.length > 1
            ? !note.includes(previousChallenge)
            : note !== previousChallenge;
        });
    // choose a random eligible note for next challenge
    const note = randomNote(eligibleNotes, sharps && flats);
    if (hardMode) {
      // choose a random string for hard mode challenge
      const randomString =
        instrument === "bass"
          ? Math.floor(Math.random() * 4) + 1
          : Math.floor(Math.random() * tuning.strings.length) + 1;
      setChallengeString(randomString);
      // disable all other strings
      const updatedEnabledStrings = enabledStrings.map((v, i) =>
        i === randomString - 1 ? true : false,
      );
      setEnabledStrings(updatedEnabledStrings);
    }
    setChallenge(note);
  };

  // Countdown the timer and end the game when time runs out
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const endGame = () => {
      clearInterval(interval);
      hideNoteLabels();
      setGameInProgress(false);
      setAllowSkip(false);
      setChallenge("");
    };
    if (gameInProgress && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      endGame();
      setGameOver(true);
    }
    if (quitGame) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [timer, gameInProgress, quitGame]);

  // save the new score
  useEffect(() => {
    if (gameOver) {
      const newScore = {
        points: currentScore,
        tuning: tuning.name,
        instrument: instrument as string,
        timestamp: new Date().toISOString(),
        hardMode,
      };
      addScore(newScore);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // Reset enabledStrings when a hardMode game ends
  useEffect(() => {
    if (hardMode && (gameOver || quitGame)) {
      if (instrument === "ukulele") {
        setEnabledStrings([true, true, true, true]);
      } else {
        setEnabledStrings(defaultSettings.enabledStrings);
      }
    }
  }, [quitGame, gameOver, hardMode, instrument, setEnabledStrings]);

  // Start a new game
  const startGame = () => {
    setGameOver(false);
    setQuitGame(false);
    setGameInProgress(true);
    setShowSettings(false);
    setCurrentScore(0);
    setNewHighScore(false);
    setTimer(gameLength);
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
        className={`flex items-end ${gameInProgress || gameOver ? "justify-between" : "justify-around"} pb-2 ${gameOver && "opacity-25"}`}
      >
        {/* timer */}
        <div
          className={`flex ${!gameInProgress && !gameOver && "hidden"} items-center gap-1`}
        >
          <BsStopwatch aria-label="time left" className="text-xl" />
          <span>{timer}</span>
        </div>
        {/* challenge/start btn */}
        <div className="text-center text-xl font-bold">
          {gameInProgress ? (
            <p data-testid="challenge-container">
              {"Find "}
              <span
                data-testid="challenge-note"
                className="text-light-link dark:text-dark-highlight"
              >
                {challenge}
              </span>
              {hardMode && (
                <>
                  <br className="sm:hidden" />
                  <span className="text-sm sm:text-xl">{" on the "}</span>
                  <span className="text-sm text-light-link dark:text-dark-highlight sm:text-xl">
                    {ordinal(challengeString as number)}
                  </span>
                  <span className="text-sm sm:text-xl">{" string"}</span>
                </>
              )}
            </p>
          ) : gameOver ? (
            <p data-testid="game-over-text">{"Time's up!"}</p>
          ) : (
            <button
              type="button"
              aria-label="start game"
              className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg disabled:text-light-body disabled:opacity-40 dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
              onClick={startGame}
              disabled={isStartDisabled}
            >
              START
            </button>
          )}
        </div>
        {/* current score */}
        <div
          className={`flex ${!gameInProgress && !gameOver && "hidden"} items-center gap-1`}
        >
          <span data-testid="current-score">{currentScore}</span>
          <FaRegCircleCheck aria-label="current score" className="text-xl" />
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
        {/* settings btn / quit btn */}
        <div>
          {gameInProgress ? (
            <button
              type="button"
              aria-label="quit game"
              className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
              onClick={() => setQuitGame(true)}
            >
              Quit Game
            </button>
          ) : (
            <button
              type="button"
              aria-label="show/hide settings"
              className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings && <IoClose aria-hidden className="text-xl" />}
              {showSettings ? "Hide Settings" : "Settings"}
            </button>
          )}
        </div>
        {/* skip btn */}
        <div>
          <button
            data-testid="skip-button"
            type="button"
            aria-label="skip this note"
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
          <FaMedal aria-label="high score" className="text-xl" />
        </div>
      </div>
      {/* Settings */}
      {showSettings && <GameSettings setIsStartDisabled={setIsStartDisabled} />}
    </>
  );
}
