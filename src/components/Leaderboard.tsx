"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaMedal } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Score } from "@/lib/types";
import { dateFromTimestamp, capitalize } from "@/lib/helpers";
import PaginationControls from "./PaginationControls";

export default function Leaderboard({
  topScores,
}: {
  topScores: Score[] | undefined;
}) {
  const session = useSession();
  const userId = session?.data?.user?.id;

  // Filters
  const [guitar, setGuitar] = useState(false);
  const [bass, setBass] = useState(false);
  const [ukulele, setUkulele] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const isShowAll = !guitar && !bass && !ukulele && !hardMode;
  const filteredScores = topScores?.filter(
    (score) =>
      isShowAll ||
      (guitar &&
        score.instrument === "guitar" &&
        (!hardMode || score.hardMode)) ||
      (bass && score.instrument === "bass" && (!hardMode || score.hardMode)) ||
      (ukulele &&
        score.instrument === "ukulele" &&
        (!hardMode || score.hardMode)) ||
      (!guitar && !bass && !ukulele && score.hardMode),
  );

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
  const paginatedScores = filteredScores?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = filteredScores
    ? Math.ceil(filteredScores?.length / itemsPerPage)
    : 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) =>
    (i + 1).toString(),
  );

  const resetFilters = () => {
    setGuitar(false);
    setBass(false);
    setUkulele(false);
    setHardMode(false);
  };

  useEffect(() => {
    if (guitar) {
      setBass(false);
      setUkulele(false);
    } else if (bass) {
      setGuitar(false);
      setUkulele(false);
    } else if (ukulele) {
      setGuitar(false);
      setBass(false);
    }
  }, [guitar, bass, ukulele]);

  return !topScores?.length ? (
    <></>
  ) : (
    <>
      <LeaderboardHeader userId={userId} />
      <div className="overflow-x-auto">
        <div className="mb-4 flex items-center gap-2 [&>button]:border-none [&>button]:bg-light-darkerBg [&>button]:font-medium [&>button]:text-light-bg [&>button]:hover:bg-light-darkerBg [&>button]:dark:bg-dark-darkerBg [&>button]:dark:text-dark-heading [&>button]:hover:dark:bg-dark-darkerBg">
          <span className="text-xs font-medium text-light-heading dark:text-dark-body">
            Filter:
          </span>
          <button
            className={`${isShowAll ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
            value="all"
            onClick={resetFilters}
          >
            All
          </button>
          <button
            className={`${guitar ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
            onClick={() => {
              setGuitar(!guitar);
              setBass(false);
              setUkulele(false);
            }}
          >
            Guitar
          </button>
          <button
            className={`${bass ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
            onClick={() => {
              setGuitar(false);
              setBass(!bass);
              setUkulele(false);
            }}
          >
            Bass
          </button>
          <button
            className={`${ukulele ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
            onClick={() => {
              setGuitar(false);
              setBass(false);
              setUkulele(!ukulele);
            }}
          >
            Ukulele
          </button>
          <button
            className={`${hardMode ? "active " : ""} btn btn-xs hover:text-light-link hover:dark:text-dark-hover`}
            onClick={() => setHardMode(!hardMode)}
          >
            Hard Mode
          </button>
        </div>
        {!paginatedScores?.length ? (
          <>
            <p className="py-4">No published scores match these filters.</p>
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
          <table className="w-full table-auto text-nowrap text-xs">
            <thead className="text-left text-light-heading dark:text-dark-heading">
              <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
                <th className="hidden pr-2 sm:table-cell">Date</th>
                <th className="py-2 pr-2 sm:p-2">Username</th>
                <th className="p-2">Instrument</th>
                <th className="p-2">Tuning</th>
                <th className="p-2 text-center">Score</th>
                <th className="p-2 text-center">Hard Mode</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScores?.map((score) => (
                <tr
                  key={`topscore-${score.timestamp}`}
                  className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg"
                >
                  <td className="hidden py-4 pr-2 sm:table-cell">
                    {dateFromTimestamp(score.timestamp)}
                  </td>
                  <td className="py-4 pr-2 sm:px-2">
                    {score.username || "Anonymous"}
                  </td>
                  <td className="px-2 py-4">{capitalize(score.instrument)}</td>
                  <td className=" px-2 py-4">{score.tuning}</td>
                  <td className="px-2 py-4 text-center">
                    <div className="mx-auto w-fit">
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

function LeaderboardHeader({ userId }: { userId: string | undefined }) {
  return (
    <div className="pb-6 pt-12 sm:flex sm:items-center sm:justify-between">
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
