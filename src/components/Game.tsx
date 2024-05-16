"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { BsStopwatch } from "react-icons/bs";
import { FaRegCircleCheck, FaMedal } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { useScores } from "@/context/ScoresContext";
import { useSettings } from "@/context/SettingsContext";
import {
  gameLength,
  naturalNotes,
  notesWithFlats,
  notesWithSharps,
  notesWithSharpsAndFlats,
} from "@/lib/constants";
import { randomNote, hideNoteLabels, ordinal } from "@/lib/utils";
import Fretboard from "./Fretboard";
import GameOverCard from "./GameOverCard";
import GameSettings from "./GameSettings";

export default function Game() {
  const {
    flats,
    sharps,
    hardMode,
    tuning,
    instrument,
    enabledStrings,
    setEnabledStrings,
  } = useSettings();
  const session = useSession();
  const { highScore, addScore } = useScores();
  const [timer, setTimer] = useState(gameLength);
  const [currentScore, setCurrentScore] = useState(0);
  const [challengeNote, setChallengeNote] = useState("");
  const [challengeStringNumber, setChallengeStringNumber] = useState<
    number | undefined
  >(undefined);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isSkippable, setIsSkippable] = useState(false);
  const [isGameInProgress, setIsGameInProgress] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameQuit, setIsGameQuit] = useState(false);
  const [isStartDisabled, setIsStartDisabled] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const userId = session?.data?.user?.id;
  const numberOfStrings = tuning.strings.length;
  const notes = useMemo(() => {
    if (sharps && flats) return notesWithSharpsAndFlats;
    if (sharps) return notesWithSharps;
    if (flats) return notesWithFlats;
    return naturalNotes;
  }, [sharps, flats]);

  const generateNewChallenge = useCallback(
    (previousChallenge: string) => {
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
        const randomString = Math.floor(Math.random() * numberOfStrings) + 1;
        setChallengeStringNumber(randomString);
        // disable all other strings
        const updatedEnabledStrings = enabledStrings.map((v, i) =>
          i === randomString - 1 ? true : false,
        );
        setEnabledStrings(updatedEnabledStrings);
      }
      setChallengeNote(note);
    },
    [
      notes,
      sharps,
      flats,
      hardMode,
      numberOfStrings,
      enabledStrings,
      setEnabledStrings,
    ],
  );

  // Countdown the timer and end the game when time runs out
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const endGame = () => {
      clearInterval(interval);
      hideNoteLabels();
      setIsGameInProgress(false);
      setIsSkippable(false);
      setChallengeNote("");
    };
    if (isGameInProgress && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      endGame();
      setIsGameOver(true);
    }
    if (isGameQuit) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [timer, isGameInProgress, isGameQuit]);

  // save the new score
  useEffect(() => {
    if (isGameOver) {
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
  }, [isGameOver]);

  // Reset enabledStrings when a hardMode game ends
  useEffect(() => {
    if (hardMode && (isGameOver || isGameQuit)) {
      const updatedEnabledStrings = Array.from(
        { length: numberOfStrings },
        () => true,
      );
      setEnabledStrings(updatedEnabledStrings);
    }
  }, [isGameQuit, isGameOver, hardMode, numberOfStrings, setEnabledStrings]);

  // Start a new game
  const startGame = () => {
    setIsGameOver(false);
    setIsGameQuit(false);
    setIsGameInProgress(true);
    setIsSettingsVisible(false);
    setCurrentScore(0);
    setIsNewHighScore(false);
    setTimer(gameLength);
    generateNewChallenge(challengeNote);
  };

  // Update isNewHighScore if needed as current score changes
  useEffect(() => {
    if (currentScore > highScore) {
      setIsNewHighScore(true);
    }
  }, [currentScore, highScore]);

  return (
    <>
      <div
        className={`flex items-end ${isGameInProgress || isGameOver ? "justify-between" : "justify-around"} pb-2 ${isGameOver && "opacity-25"}`}
      >
        {/* Countdown Timer */}
        <div
          className={`flex ${!isGameInProgress && !isGameOver && "hidden"} items-center gap-1`}
        >
          <BsStopwatch aria-label="time left" className="text-xl" />
          <span>{timer}</span>
        </div>
        {/* Challenge / Start Button */}
        <div className="text-center text-xl font-bold">
          {isGameInProgress ? (
            <Challenge
              challengeNote={challengeNote}
              challengeStringNumber={challengeStringNumber}
              hardMode={hardMode}
            />
          ) : isGameOver ? (
            <p data-testid="game-over-text">{"Time's up!"}</p>
          ) : (
            <button
              type="button"
              aria-label="start game"
              className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link disabled:text-light-body disabled:opacity-40 dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg focus-visible:dark:outline-dark-highlight"
              onClick={startGame}
              disabled={isStartDisabled}
            >
              START
            </button>
          )}
        </div>
        {/* Current Score */}
        <div
          className={`flex ${!isGameInProgress && !isGameOver && "hidden"} items-center gap-1`}
        >
          <span data-testid="current-score">{currentScore}</span>
          <FaRegCircleCheck aria-label="current score" className="text-xl" />
        </div>
      </div>
      <div className="relative flex justify-center">
        {/* Game-Over Card */}
        {isGameOver && (
          <GameOverCard
            currentScore={currentScore}
            isNewHighScore={isNewHighScore}
            setIsGameOver={setIsGameOver}
            startGame={startGame}
            userId={userId}
          />
        )}
        {/* Fretboard */}
        <Fretboard
          isGameInProgress={isGameInProgress}
          isGameOver={isGameOver}
          challenge={challengeNote}
          currentScore={currentScore}
          setCurrentScore={setCurrentScore}
          setIsSkippable={setIsSkippable}
          generateNewChallenge={generateNewChallenge}
        />
      </div>
      <div className="flex items-start justify-between pb-4 pt-2">
        {/* Settings Button / Quit Button */}
        {isGameInProgress ? (
          <button
            type="button"
            className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg focus-visible:dark:outline-dark-highlight"
            aria-label="quit game"
            onClick={() => setIsGameQuit(true)}
          >
            Quit Game
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg focus-visible:dark:outline-dark-highlight"
            aria-label={isSettingsVisible ? "hide settings" : "show settings"}
            onClick={() => setIsSettingsVisible(!isSettingsVisible)}
          >
            {isSettingsVisible ? (
              <>
                <IoClose aria-hidden className="text-xl" />
                {"Hide Settings"}
              </>
            ) : (
              <>
                <IoIosSettings aria-hidden className="text-xl" />
                {"Settings"}
              </>
            )}
          </button>
        )}
        {/* Skip Button */}
        <button
          type="button"
          data-testid="skip-button"
          aria-label="skip this note"
          className={`${(isGameInProgress && isSkippable) || "hidden"} btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg focus-visible:dark:outline-dark-highlight`}
          onClick={() => {
            hideNoteLabels();
            generateNewChallenge(challengeNote);
          }}
        >
          Skip
        </button>
        {/* High Score */}
        <div
          className={`flex items-center gap-1 ${isGameOver && "opacity-25"}`}
        >
          <span>{highScore}</span>
          <FaMedal aria-label="high score" className="text-xl" />
        </div>
      </div>
      {/* Game Settings */}
      {isSettingsVisible && (
        <GameSettings setIsStartDisabled={setIsStartDisabled} />
      )}
    </>
  );
}

function Challenge({
  challengeNote,
  challengeStringNumber,
  hardMode,
}: {
  challengeNote: string;
  challengeStringNumber: number | undefined;
  hardMode: boolean;
}) {
  return (
    <p data-testid="challenge-container">
      {"Find "}
      <span
        data-testid="challenge-note"
        className="text-light-link dark:text-dark-highlight"
      >
        {challengeNote}
      </span>
      {hardMode && (
        <>
          <br className="sm:hidden" />
          <span className="text-sm sm:text-xl">{" on the "}</span>
          <span className="text-sm text-light-link dark:text-dark-highlight sm:text-xl">
            {ordinal(challengeStringNumber as number)}
          </span>
          <span className="text-sm sm:text-xl">{" string"}</span>
        </>
      )}
    </p>
  );
}
