"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaMedal } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import { useScoreFilters, useOnlineStatus } from "@/lib/hooks";
import {
  dateFromTimestamp,
  sortScoresByTimestamp,
  sortScoresByPoints,
  findHighScore,
  capitalize,
  filterScores,
} from "@/lib/helpers";
import { useScores } from "@/context/ScoresContext";
import PaginationControls from "./PaginationControls";
import ScoreFilterControls from "./ScoreFilterControls";

export default function History() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const { scores } = useScores();
  const { isOnline } = useOnlineStatus();

  // Sorting
  const [sortByDate, setSortByDate] = useState(true);
  const [sortByPoints, setSortByPoints] = useState(false);
  const [sortByAscending, setSortByAscending] = useState(false);
  const sortedScores =
    (sortByDate && !sortByAscending && sortScoresByTimestamp(scores)) ||
    (sortByDate &&
      sortByAscending &&
      sortScoresByTimestamp(scores).reverse()) ||
    (sortByPoints && !sortByAscending && sortScoresByPoints(scores)) ||
    (sortByPoints && sortByAscending && sortScoresByPoints(scores).reverse()) ||
    scores;

  const handleClickDate = () => {
    if (sortByDate) {
      setSortByAscending(!sortByAscending);
    } else {
      setSortByDate(true);
      setSortByPoints(false);
      setSortByAscending(false);
    }
  };

  const handleClickScore = () => {
    if (sortByPoints) {
      setSortByAscending(!sortByAscending);
    } else {
      setSortByPoints(true);
      setSortByDate(false);
      setSortByAscending(false);
    }
  };

  // Filters
  const {
    filters,
    noActiveFilters,
    setGuitarFilter,
    setBassFilter,
    setUkuleleFilter,
    setHardModeFilter,
    resetFilters,
  } = useScoreFilters();
  const filteredScores = noActiveFilters
    ? sortedScores
    : sortedScores && filterScores(sortedScores, filters);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const paginatedScores = filteredScores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredScores.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) =>
    (i + 1).toString(),
  );

  // High score
  const highScore = findHighScore(filteredScores);

  return !sortedScores.length ? (
    <></>
  ) : (
    <>
      {isOnline === false && (
        <div
          role="alert"
          className="alert mt-6 border-error bg-light-highlight text-light-body dark:bg-dark-darkerBg dark:text-dark-body"
        >
          <MdSignalWifiConnectedNoInternet0 className="text-2xl text-error" />
          <p>
            {
              "You are currently offline. You can continue to play and your scores will be stored locally. Your scores will be saved as soon as you're back online and signed-in."
            }
          </p>
        </div>
      )}
      <HistoryHeader userId={userId} isOnline={isOnline} />
      <div className="overflow-x-auto sm:overflow-visible">
        <ScoreFilterControls
          scores={scores}
          filters={filters}
          noActiveFilters={noActiveFilters}
          resetFilters={resetFilters}
          setGuitarFilter={setGuitarFilter}
          setBassFilter={setBassFilter}
          setUkuleleFilter={setUkuleleFilter}
          setHardModeFilter={setHardModeFilter}
        />
        {!paginatedScores?.length ? (
          <>
            <p className="py-4">
              You have no scores which match these filters.
            </p>
            <p className="pb-4 pt-2">
              <button
                type="button"
                className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link disabled:text-light-body disabled:opacity-40 dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg focus-visible:dark:outline-dark-highlight"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </p>
          </>
        ) : (
          <table
            data-testid="history-table"
            className="w-full table-auto text-nowrap text-xs"
          >
            <thead className="text-left text-light-heading dark:text-dark-heading">
              <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
                <th className="pr-2">
                  <button
                    aria-label={`Sort by date: ${sortByDate && sortByAscending ? "descending" : "ascending"}`}
                    className="flex items-center gap-1 rounded-sm transition-colors hover:text-light-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight"
                    onClick={handleClickDate}
                  >
                    Date
                    {sortByDate && sortByAscending && (
                      <TiArrowSortedUp aria-hidden className="text-md" />
                    )}
                    {sortByDate && !sortByAscending && (
                      <TiArrowSortedDown aria-hidden className="text-md" />
                    )}
                  </button>
                </th>
                <th className="p-2">Instrument</th>
                <th className="p-2">Tuning</th>
                <th className="p-2 text-center">
                  <button
                    aria-label={`Sort by points: ${sortByPoints && sortByAscending ? "descending" : "ascending"}`}
                    className="flex w-full items-center justify-center gap-1 rounded-sm transition-colors hover:text-light-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-link hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight"
                    onClick={handleClickScore}
                  >
                    Score
                    {sortByPoints && sortByAscending && (
                      <TiArrowSortedUp className="text-md" />
                    )}
                    {sortByPoints && !sortByAscending && (
                      <TiArrowSortedDown className="text-md" />
                    )}
                  </button>
                </th>
                <th className="p-2 text-center">Hard Mode</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScores.map((score) => (
                <tr
                  key={`score-${score.timestamp}`}
                  className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg"
                >
                  <td className="py-4 pr-2">
                    {dateFromTimestamp(score.timestamp)}
                  </td>
                  <td className="px-2 py-4">{capitalize(score.instrument)}</td>
                  <td className="px-2 py-4">{score.tuning}</td>
                  <td className="px-2 py-4">
                    <div className="mx-auto w-fit">
                      <div className="flex items-center gap-1">
                        {score.points}
                        {score.points === highScore && score.points > 0 && (
                          <FaMedal
                            aria-label="high score"
                            className="text-md text-gold"
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    {score.hardMode ? "On" : "Off"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageNumbers={pageNumbers}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

function HistoryHeader({
  userId,
  isOnline,
}: {
  userId: string | undefined;
  isOnline: boolean | undefined;
}) {
  return (
    <div className="pb-8 pt-12 sm:flex sm:items-center sm:justify-between">
      <h2 className="mb-1 text-2xl font-bold text-light-heading dark:text-dark-heading sm:mb-0">
        History
      </h2>
      {!userId && isOnline && (
        <p className="flex items-center gap-1 text-xs">
          <HiOutlineLightBulb className="text-lg text-light-highlight dark:text-dark-highlight" />
          <Link
            className="font-bold text-light-link underline transition-colors hover:text-light-hover focus-visible:outline-offset-2 focus-visible:outline-light-link dark:text-dark-link dark:hover:text-dark-hover focus-visible:dark:outline-dark-highlight"
            href="/auth/signin"
          >
            Sign in
          </Link>{" "}
          to save your history.
        </p>
      )}
    </div>
  );
}
