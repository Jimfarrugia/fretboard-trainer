import { generateFretboard, hideNoteLabels } from "@/lib/helpers";
import "./Fretboard.css";

interface FretboardProps {
  gameInProgress: boolean;
  gameOver: boolean;
  challenge: string;
  currentScore: number;
  setCurrentScore: (newScore: number) => void;
  setAllowSkip: (newScore: boolean) => void;
  newChallenge: (previousChallenge: string) => void;
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
  const strings = ["E", "B", "G", "D", "A", "E"];
  const frets = Array.from({ length: 15 }, (_, index) => index);
  const fretboard = generateFretboard(strings, 15);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    hideNoteLabels();
    // Display the label for the clicked note and handle correct/incorrect answer
    const { value } = e.target as HTMLButtonElement;
    const span = e.currentTarget.querySelector("span");
    if (value === challenge) {
      if (span) span.classList.add("clicked", "correct");
      setCurrentScore(currentScore + 1);
      setAllowSkip(false);
      newChallenge(challenge);
    } else {
      if (span) span.classList.add("clicked", "incorrect");
      setAllowSkip(true);
    }
  };

  return (
    <div className={`fretboard-wrapper text-sm ${gameOver && "opacity-25"}`}>
      <div className="fretboard">
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
          {strings.map((string, stringIndex) => (
            <div key={`string-${stringIndex + 1}`} className="string">
              <hr />
              <button
                value={fretboard[stringIndex][0]}
                disabled={!gameInProgress}
                onClick={handleClick}
              >
                <span
                  onClick={(e) => {
                    // trigger button if span is clicked
                    e.stopPropagation();
                    (e.target as HTMLElement).closest("button")?.click();
                  }}
                >
                  {fretboard[stringIndex][0]}
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className="frets">
          {frets.map((fret, fretIndex) => (
            <div key={`fret-${fretIndex + 1}`} className="fret">
              {strings.map((string, stringIndex) => (
                <div key={`string-${stringIndex + 1}`} className="string">
                  <hr />
                  <button
                    value={fretboard[stringIndex][fretIndex + 1]}
                    disabled={!gameInProgress}
                    onClick={handleClick}
                  >
                    <span
                      onClick={(e) => {
                        // trigger button if span is clicked
                        e.stopPropagation();
                        (e.target as HTMLElement).closest("button")?.click();
                      }}
                    >
                      {fretboard[stringIndex][fretIndex + 1]}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
