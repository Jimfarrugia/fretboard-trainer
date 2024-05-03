import { useState, useEffect } from "react";
import {
  generateFretboard,
  hideNoteLabels,
  translateNote,
} from "@/lib/helpers";
import { useSettings } from "@/context/SettingsContext";
import "./Fretboard.css";

interface FretboardProps {
  gameInProgress: boolean;
  gameOver: boolean;
  challenge: string;
  currentScore: number;
  setCurrentScore: (currentScore: number) => void;
  setAllowSkip: (allowSkip: boolean) => void;
  newChallenge: (previousChallenge: string) => void;
}

interface CorrectAnswer {
  challenge: string;
  string: number;
  fret: number;
}

export default function Fretboard({
  gameInProgress,
  gameOver,
  challenge,
  currentScore,
  setCurrentScore,
  setAllowSkip,
  newChallenge,
}: FretboardProps) {
  const { instrument, tuning, enabledStrings, flats, sharps, leftHanded } =
    useSettings();
  const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const frets = Array.from({ length: 15 }, (_, index) => index);
  const strings =
    instrument === "bass" ? tuning.strings.slice(-4) : tuning.strings;
  const fretboard = generateFretboard(strings, 15);

  useEffect(() => {
    if (tuning !== null) {
      setIsLoading(false);
    }
  }, [tuning]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    string: number,
    fret: number,
  ) => {
    hideNoteLabels();
    // Display the label for the clicked note and handle correct/incorrect answer
    const { value } = e.target as HTMLButtonElement;
    const span = e.currentTarget.querySelector("span");
    if (
      (challenge.length === 1 && value === challenge) || // correct natural
      (challenge.length > 1 && value.includes(challenge)) // correct accidental
    ) {
      // set correct answer
      setCorrectAnswer({ challenge, string, fret });
      // show button label
      if (span) span.classList.add("clicked", "correct");
      // update game state
      setCurrentScore(currentScore + 1);
      setAllowSkip(false);
      newChallenge(challenge);
    } else {
      if (span) span.classList.add("clicked", "incorrect");
      setAllowSkip(true);
    }
  };

  const labelText = (note: string, string: number, fret: number) => {
    const noteAsSharp = note.substring(0, 2);
    const noteAsFlat = note.substring(note.length - 2);
    /* 
      If the label is for the button that was clicked to achieve the last correct answer, 
      it will still be shown after the new challenge has been set
      and its label may change to use a different accidental to what the user was targeting.
      (eg. the user was targeting 'Bb' but the new challenge is 'C#' so the label will be displayed as 'A#')
      To fix, we check if this label is for the button that was clicked to achieve the last correct answer
      and if so, we display the label using the accidental that was used for the previous challenge.
    */
    if (
      correctAnswer && // there was a correct answer
      correctAnswer.challenge.length > 1 && // it was an accidental
      correctAnswer.string === string && // it was on this string
      correctAnswer.fret === fret // it was on this fret
    ) {
      // if it was sharp, display as a sharp
      if (correctAnswer.challenge.includes("#")) return noteAsSharp;
      // if it was flat, display as a flat
      if (correctAnswer.challenge.includes("b")) return noteAsFlat;
    }
    //* The code below handles everything other than the edge case described above.
    switch (true) {
      case note.length === 1:
        return note;
      // if note is an accidental and challenge is a sharp, display note as a sharp
      case note.length > 1 && challenge.includes("#"):
        return noteAsSharp;
      // if note is an accidental and challenge is a flat, display note as a flat
      case note.length > 1 && challenge.includes("b"):
        return noteAsFlat;
      // if note is an accidental and challenge is a natural and flats:true and sharps:false, display note as a flat
      case note.length > 1 && challenge.length === 1 && flats && !sharps:
        return noteAsFlat;
      // by default, display all accidentals as sharps
      default:
        return note.length > 1 ? noteAsSharp : note;
    }
  };

  return (
    <div
      className={`fretboard-wrapper text-sm ${gameOver ? "opacity-25" : ""}`}
    >
      <div
        data-testid="fretboard"
        className={`fretboard ${!isLoading && leftHanded ? "left-handed" : ""} ${!isLoading && instrument !== "guitar" ? instrument : ""}`}
      >
        {isLoading ? (
          <div className="w-full text-center">
            <span className="loading loading-spinner loading-lg py-16 text-light-bg dark:text-dark-heading"></span>
          </div>
        ) : (
          <>
            <div className="fret-markers">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="fret-marker-double">
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
            <div className="nut">
              {strings.map((string, stringIndex) => {
                const note = fretboard[stringIndex][0];
                const noteLabelText = labelText(note, stringIndex + 1, 0);
                const stringEnabled = enabledStrings[stringIndex];
                return (
                  <div key={`string-${stringIndex + 1}`} className="string">
                    <hr
                      className={`${stringEnabled ? "" : "opacity-40 dark:opacity-10"}`}
                    />
                    <button
                      className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-light-link focus-visible:dark:outline-dark-highlight"
                      aria-label={translateNote(noteLabelText)}
                      value={note}
                      disabled={!gameInProgress || !stringEnabled}
                      onClick={(e) => handleClick(e, stringIndex + 1, 0)}
                    >
                      <span
                        onClick={(e) => {
                          // trigger button if span is clicked
                          e.stopPropagation();
                          (e.target as HTMLElement).closest("button")?.click();
                        }}
                      >
                        {noteLabelText}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="frets">
              {frets.map((fret, fretIndex) => (
                <div key={`fret-${fretIndex + 1}`} className="fret">
                  {strings.map((string, stringIndex) => {
                    const note = fretboard[stringIndex][fretIndex + 1];
                    const noteLabelText = labelText(
                      note,
                      stringIndex + 1,
                      fretIndex + 1,
                    );
                    const stringEnabled = enabledStrings[stringIndex];
                    return (
                      <div key={`string-${stringIndex + 1}`} className="string">
                        <hr
                          className={`${stringEnabled ? "" : "opacity-40 dark:opacity-10"}`}
                        />
                        <button
                          className="z-10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-light-link focus-visible:dark:outline-dark-highlight"
                          aria-label={translateNote(noteLabelText)}
                          value={note}
                          disabled={!gameInProgress || !stringEnabled}
                          onClick={(e) =>
                            handleClick(e, stringIndex + 1, fretIndex + 1)
                          }
                        >
                          <span
                            onClick={(e) => {
                              // trigger button if span is clicked
                              e.stopPropagation();
                              (e.target as HTMLElement)
                                .closest("button")
                                ?.click();
                            }}
                          >
                            {noteLabelText}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
