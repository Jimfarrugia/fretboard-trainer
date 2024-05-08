import { useState, useEffect } from "react";
import {
  generateFretboard,
  hideNoteLabels,
  translateNote,
  playNoteAudio,
  sharpNote,
  flatNote,
  isCorrectNote,
  removeOctaveNumber,
} from "@/lib/utils";
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
  const {
    instrument,
    tuning,
    enabledStrings,
    flats,
    sharps,
    leftHanded,
    volume,
  } = useSettings();
  const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const frets = Array.from({ length: 15 }, (_, index) => index);
  const { strings } = tuning;
  const fretboard = generateFretboard(strings, 15);

  useEffect(() => {
    if (tuning !== null) {
      setIsLoading(false);
    }
  }, [tuning]);

  // Display the label for the clicked note and handle correct/incorrect answer
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    string: number,
    fret: number,
  ) => {
    hideNoteLabels();
    const { value: note } = e.target as HTMLButtonElement;
    const span = e.currentTarget.querySelector("span");
    if (isCorrectNote(note, challenge)) {
      // Set correct answer
      setCorrectAnswer({ challenge, string, fret });
      // Show button label
      if (span) span.classList.add("clicked", "correct");
      // Update game state
      setCurrentScore(currentScore + 1);
      setAllowSkip(false);
      newChallenge(challenge);
    } else {
      if (span) span.classList.add("clicked", "incorrect");
      setAllowSkip(true);
    }
    // Play the note audio
    playNoteAudio(instrument, note, volume / 100);
  };

  const labelText = (note: string, string: number, fret: number) => {
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
      if (correctAnswer.challenge.includes("#")) return sharpNote(note);
      // if it was flat, display as a flat
      if (correctAnswer.challenge.includes("b")) return flatNote(note);
    }
    //* The code below handles everything other than the edge case described above.
    switch (true) {
      case note.length === 1:
        return note;
      // if note is an accidental and challenge is a sharp, display note as a sharp
      case note.length > 1 && challenge.includes("#"):
        return sharpNote(note);
      // if note is an accidental and challenge is a flat, display note as a flat
      case note.length > 1 && challenge.includes("b"):
        return flatNote(note);
      // if note is an accidental and challenge is a natural and flats:true and sharps:false, display note as a flat
      case note.length > 1 && challenge.length === 1 && flats && !sharps:
        return flatNote(note);
      // by default, display all accidentals as sharps
      default:
        return note.length > 1 ? sharpNote(note) : note;
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
                const noteLabelText = labelText(
                  removeOctaveNumber(note),
                  stringIndex + 1,
                  0,
                );
                const stringEnabled = enabledStrings[stringIndex];
                return (
                  <div key={`string-${stringIndex + 1}`} className="string">
                    <hr
                      className={`${stringEnabled ? "" : "opacity-40 dark:opacity-10"}`}
                    />
                    <NoteButton
                      noteLabelText={noteLabelText}
                      value={note}
                      disabled={!gameInProgress || !stringEnabled}
                      onClick={(e) => handleClick(e, stringIndex + 1, 0)}
                    />
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
                      removeOctaveNumber(note),
                      stringIndex + 1,
                      fretIndex + 1,
                    );
                    const stringEnabled = enabledStrings[stringIndex];
                    return (
                      <div key={`string-${stringIndex + 1}`} className="string">
                        <hr
                          className={`${stringEnabled ? "" : "opacity-40 dark:opacity-10"}`}
                        />
                        <NoteButton
                          noteLabelText={noteLabelText}
                          value={note}
                          disabled={!gameInProgress || !stringEnabled}
                          onClick={(e) =>
                            handleClick(e, stringIndex + 1, fretIndex + 1)
                          }
                        />
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

function NoteButton({
  noteLabelText,
  value,
  disabled,
  onClick,
}: {
  noteLabelText: string;
  value: string;
  disabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-light-link focus-visible:dark:outline-dark-highlight"
      aria-label={translateNote(noteLabelText)}
      value={value}
      disabled={disabled}
      onClick={onClick}
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
  );
}
