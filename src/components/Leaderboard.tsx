"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaMedal } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import { getTopScores } from "@/actions/getTopScores";
import { Score } from "@/lib/types";
import { dateFromTimestamp, capitalize } from "@/lib/helpers";
import PaginationControls from "./PaginationControls";

export default function Leaderboard() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [topScores, setTopScores] = useState<Score[] | undefined>(undefined);

  // Determine gold/silver/bronze scores
  const sortedPoints = topScores
    ?.map((obj) => obj.points)
    .sort((a, b) => b - a);
  const pointsSet = new Set(sortedPoints);
  const uniquePoints = Array.from(pointsSet);
  const goldScore = uniquePoints[0];
  const silverScore = uniquePoints[1];
  const bronzeScore = uniquePoints[2];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedScores = topScores?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = topScores
    ? Math.ceil(topScores?.length / itemsPerPage)
    : 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) =>
    (i + 1).toString(),
  );

  // Fetch top scores
  useEffect(() => {
    const fetchTopScores = async () => {
      getTopScores()
        .then((scores) => setTopScores(scores))
        .catch((e) =>
          console.error("Failed to get top scores for leaderboard.", e),
        );
    };
    fetchTopScores();
    console.log("fetched top scores");
  }, []);

  return !topScores?.length ? (
    <></>
  ) : (
    <>
      <LeaderboardHeader userId={userId} />
      <table className="w-full table-auto text-xs">
        <thead className="text-left text-light-heading dark:text-dark-heading">
          <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
            <th className="hidden p-2 sm:table-cell">Date</th>
            <th className="p-2">Username</th>
            <th className="p-2">Instrument</th>
            <th className="p-2">Tuning</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {paginatedScores?.map((score) => (
            <tr
              key={`topscore-${score.timestamp}`}
              className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg"
            >
              <td className="hidden px-2 py-4 sm:table-cell">
                {dateFromTimestamp(score.timestamp)}
              </td>
              <td className="px-2 py-4">{score.username || "Anonymous"}</td>
              <td className="px-2 py-4">{capitalize(score.instrument)}</td>
              <td className="px-2 py-4">{score.tuning}</td>
              <td className="px-2 py-4">
                <div className="flex items-center gap-1">
                  {score.points}
                  {score.points === goldScore && (
                    <FaMedal className="text-md text-gold" />
                  )}
                  {score.points === silverScore && (
                    <FaMedal className="text-md text-silver" />
                  )}
                  {score.points === bronzeScore && (
                    <FaMedal className="text-md text-bronze" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

function LeaderboardHeader({ userId }: { userId: string | undefined }) {
  return (
    <div className="pb-8 pt-12 sm:flex sm:items-center sm:justify-between">
      <h2 className="mb-1 text-lg font-bold text-light-heading dark:text-dark-heading sm:mb-0">
        Leaderboard
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
          to publish your scores.
        </p>
      )}
    </div>
  );
}
