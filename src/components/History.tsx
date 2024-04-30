"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaMedal } from "react-icons/fa6";
import { useScoreFilters } from "@/lib/hooks";
import {
  dateFromTimestamp,
  sortScoresByTimestamp,
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
  const sortedScores = sortScoresByTimestamp(scores);
  const highScore = findHighScore(scores);

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

  return !sortedScores.length ? (
    <></>
  ) : (
    <>
      <HistoryHeader userId={userId} />
      <div className="overflow-x-auto">
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
                className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg disabled:text-light-body disabled:opacity-40 dark:bg-dark-darkerBg dark:text-dark-body dark:hover:bg-dark-hover hover:dark:text-dark-bg"
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
                <th className="hidden pr-2 sm:table-cell">Date</th>
                <th className="py-2 pr-2 sm:p-2">Instrument</th>
                <th className="p-2">Tuning</th>
                <th className="p-2 text-center">Score</th>
                <th className="p-2 text-center">Hard Mode</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScores.map((score) => (
                <tr
                  key={`score-${score.timestamp}`}
                  className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg"
                >
                  <td className="hidden py-4 pr-2 sm:table-cell">
                    {dateFromTimestamp(score.timestamp)}
                  </td>
                  <td className="py-4 pr-2 sm:px-2">
                    {capitalize(score.instrument)}
                  </td>
                  <td className="px-2 py-4">{score.tuning}</td>
                  <td className="px-2 py-4">
                    <div className="mx-auto w-fit">
                      <div className="flex items-center gap-1">
                        {score.points}
                        {score.points === highScore && score.points > 0 && (
                          <FaMedal className="text-md text-light-highlight dark:text-dark-highlight" />
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

function HistoryHeader({ userId }: { userId: string | undefined }) {
  return (
    <div className="pb-8 pt-12 sm:flex sm:items-center sm:justify-between">
      <h2 className="mb-1 text-lg font-bold text-light-heading dark:text-dark-heading sm:mb-0">
        History
      </h2>
      {!userId && (
        <p className="flex items-center gap-1 text-xs">
          <HiOutlineLightBulb className="text-lg text-light-highlight dark:text-dark-highlight" />
          <Link
            className="font-bold text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
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
