"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineLightBulb } from "react-icons/hi";
import { dateFromTimestamp } from "@/helpers";
import { Score } from "@/interfaces";

export default function History() {
  const [scoreHistory, setScoreHistory] = useState<Score[]>([]);

  useEffect(() => {
    const scores = localStorage.getItem("scores");
    if (scores) {
      setScoreHistory(JSON.parse(scores));
    }
  }, []);

  return !scoreHistory.length ? (
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
          {scoreHistory.map((score) => (
            <tr
              key={`score-${score.timestamp}`}
              className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg"
            >
              <td className="px-2 py-4">
                {dateFromTimestamp(score.timestamp)}
              </td>
              <td className="px-2 py-4">{score.instrument}</td>
              <td className="px-2 py-4">{score.tuning}</td>
              <td className="px-2 py-4">{score.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
