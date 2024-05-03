import { ScoreFilters, Score } from "@/lib/types";

export default function ScoreFilterControls({
  scores,
  filters,
  noActiveFilters,
  resetFilters,
  setGuitarFilter,
  setBassFilter,
  setUkuleleFilter,
  setHardModeFilter,
}: {
  scores: Score[];
  filters: ScoreFilters;
  noActiveFilters: boolean;
  resetFilters: () => void;
  setGuitarFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setBassFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setUkuleleFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setHardModeFilter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { guitar, bass, ukulele, hardMode } = filters;
  const isGuitarScores = scores.some((s) => s.instrument === "guitar");
  const isBassScores = scores.some((s) => s.instrument === "bass");
  const isUkuleleScores = scores.some((s) => s.instrument === "ukulele");
  const isHardModeScores = scores.some((s) => s.hardMode);
  const isNonHardModeScores = scores.some((s) => !s.hardMode);
  const isMultipleInstruments =
    [isGuitarScores, isBassScores, isUkuleleScores].filter((e) => e).length > 1;
  const isVisible =
    isMultipleInstruments || (isHardModeScores && isNonHardModeScores);

  return !isVisible ? (
    <></>
  ) : (
    <div className="mb-4 flex items-center gap-2 [&>button]:border-none [&>button]:bg-light-darkerBg [&>button]:font-medium [&>button]:text-light-bg [&>button]:hover:bg-light-darkerBg [&>button]:dark:bg-dark-darkerBg [&>button]:dark:text-dark-heading [&>button]:hover:dark:bg-dark-darkerBg">
      <button
        className={`${noActiveFilters ? "active " : ""} btn btn-xs hover:text-light-link focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight`}
        value="all"
        onClick={resetFilters}
      >
        All
      </button>
      {isGuitarScores && isMultipleInstruments && (
        <button
          className={`${guitar ? "active " : ""} btn btn-xs hover:text-light-link focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight`}
          onClick={() => {
            setGuitarFilter(!guitar);
            setBassFilter(false);
            setUkuleleFilter(false);
          }}
        >
          Guitar
        </button>
      )}
      {isBassScores && isMultipleInstruments && (
        <button
          className={`${bass ? "active " : ""} btn btn-xs hover:text-light-link focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight`}
          onClick={() => {
            setGuitarFilter(false);
            setBassFilter(!bass);
            setUkuleleFilter(false);
          }}
        >
          Bass
        </button>
      )}
      {isUkuleleScores && isMultipleInstruments && (
        <button
          className={`${ukulele ? "active " : ""} btn btn-xs hover:text-light-link focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight`}
          onClick={() => {
            setGuitarFilter(false);
            setBassFilter(false);
            setUkuleleFilter(!ukulele);
          }}
        >
          Ukulele
        </button>
      )}
      {isHardModeScores && (
        <button
          className={`${hardMode ? "active " : ""} btn btn-xs hover:text-light-link focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight`}
          onClick={() => setHardModeFilter(!hardMode)}
        >
          Hard Mode
        </button>
      )}
    </div>
  );
}
