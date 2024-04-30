import { ScoreFilters } from "@/lib/types";

export default function ScoreFilterControls({
  filters,
  noActiveFilters,
  resetFilters,
  setGuitarFilter,
  setBassFilter,
  setUkuleleFilter,
  setHardModeFilter,
}: {
  filters: ScoreFilters;
  noActiveFilters: boolean;
  resetFilters: () => void;
  setGuitarFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setBassFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setUkuleleFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setHardModeFilter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { guitar, bass, ukulele, hardMode } = filters;

  return (
    <div className="mb-4 flex items-center gap-2 [&>button]:border-none [&>button]:bg-light-darkerBg [&>button]:font-medium [&>button]:text-light-bg [&>button]:hover:bg-light-darkerBg [&>button]:dark:bg-dark-darkerBg [&>button]:dark:text-dark-heading [&>button]:hover:dark:bg-dark-darkerBg">
      <span className="text-xs font-medium text-light-heading dark:text-dark-body">
        Filter:
      </span>
      <button
        className={`${noActiveFilters ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
        value="all"
        onClick={resetFilters}
      >
        All
      </button>
      <button
        className={`${guitar ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
        onClick={() => {
          setGuitarFilter(!guitar);
          setBassFilter(false);
          setUkuleleFilter(false);
        }}
      >
        Guitar
      </button>
      <button
        className={`${bass ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
        onClick={() => {
          setGuitarFilter(false);
          setBassFilter(!bass);
          setUkuleleFilter(false);
        }}
      >
        Bass
      </button>
      <button
        className={`${ukulele ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
        onClick={() => {
          setGuitarFilter(false);
          setBassFilter(false);
          setUkuleleFilter(!ukulele);
        }}
      >
        Ukulele
      </button>
      <button
        className={`${hardMode ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
        onClick={() => setHardModeFilter(!hardMode)}
      >
        Hard Mode
      </button>
    </div>
  );
}
