"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaMedal } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import {
  dateFromTimestamp,
  sortScoresByTimestamp,
  findHighScore,
} from "@/helpers";
import { useScores } from "@/context/ScoresContext";

export default function History() {
  const { scores } = useScores();
  const [highScore, setHighScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const sortedScores = sortScoresByTimestamp(scores);
  const paginatedScores = sortedScores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(scores.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) =>
    (i + 1).toString(),
  );

  useEffect(() => {
    if (scores.length > 0) {
      setHighScore(findHighScore(scores));
    }
  }, [scores]);

  return !sortedScores.length ? (
    <></>
  ) : (
    <>
      <div className="pb-8 pt-12 sm:flex sm:items-center sm:justify-between">
        <h2 className="mb-1 text-lg font-bold text-light-heading dark:text-dark-heading sm:mb-0">
          History
        </h2>
        <p className="flex items-center gap-1 text-xs">
          <HiOutlineLightBulb className="text-lg text-light-highlight dark:text-dark-highlight" />
          <Link
            className="font-bold text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
            href="signin"
          >
            Sign in
          </Link>{" "}
          to save your history.
        </p>
      </div>
      <table className="w-full table-auto text-xs">
        <thead className="text-left text-light-heading dark:text-dark-heading">
          <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
            <th className="p-2">Date</th>
            <th className="p-2">Instrument</th>
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
              <td className="px-2 py-4">
                {dateFromTimestamp(score.timestamp)}
              </td>
              <td className="px-2 py-4">{score.instrument}</td>
              <td className="px-2 py-4">{score.tuning}</td>
              <td className="px-2 py-4">
                <div className="flex items-center gap-1">
                  {score.points}
                  {score.points === highScore && (
                    <FaMedal className="text-md text-light-highlight dark:text-dark-highlight" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-1 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`${
              currentPage === 1
                ? "text-light-darkerBg dark:text-dark-heading"
                : "text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
            } mr-1.5 text-xs`}
          >
            <FaChevronLeft />
          </button>
          {pageNumbers.map((pageNumber) => {
            const parsedPageNumber = parseInt(pageNumber);
            if (Math.abs(parsedPageNumber - currentPage) <= 2) {
              return (
                <button
                  key={pageNumber}
                  disabled={currentPage === parsedPageNumber}
                  className={`${
                    currentPage === parsedPageNumber
                      ? "bg-light-darkerBg text-light-heading dark:bg-dark-darkerBg dark:text-dark-body"
                      : "text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
                  } rounded-full px-3 py-1.5`}
                  onClick={() => setCurrentPage(parsedPageNumber)}
                >
                  {pageNumber}
                </button>
              );
            } else {
              return null;
            }
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`${
              currentPage === totalPages
                ? "text-light-darkerBg dark:text-dark-heading"
                : "text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
            } ml-1.5 text-xs`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
