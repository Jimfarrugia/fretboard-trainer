"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaMedal } from "react-icons/fa6";
import {
  dateFromTimestamp,
  sortScoresByTimestamp,
  findHighScore,
  capitalize,
} from "@/lib/helpers";
import { useScores } from "@/context/ScoresContext";
import PaginationControls from "./PaginationControls";

export default function History() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const { scores } = useScores();
  const sortedScores = sortScoresByTimestamp(scores);
  const highScore = findHighScore(scores);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const paginatedScores = sortedScores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(scores.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) =>
    (i + 1).toString(),
  );

  return !sortedScores.length ? (
    <></>
  ) : (
    <>
      <HistoryHeader userId={userId} />
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-nowrap text-xs">
          <thead className="text-left text-light-heading dark:text-dark-heading">
            <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
              <th className="hidden pr-2 sm:table-cell">Date</th>
              <th className="py-2 pr-2 sm:p-2">Instrument</th>
              <th className="p-2">Tuning</th>
              <th className="p-2">Score</th>
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
                  <div className="flex items-center gap-1">
                    {score.points}
                    {score.points === highScore && score.points > 0 && (
                      <FaMedal className="text-md text-light-highlight dark:text-dark-highlight" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
