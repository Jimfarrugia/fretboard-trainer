import { FaMedal } from "react-icons/fa6";
import { dateFromTimestamp } from "@/helpers";
import { getTopScores } from "@/actions/getTopScores";
import LeaderboardHeader from "./LeaderboardHeader";

export default async function Leaderboard() {
  const scores = (await getTopScores()) || [];
  const sortedPoints = scores.map((obj) => obj.points).sort((a, b) => b - a);
  const pointsSet = new Set(sortedPoints);
  const uniquePoints = Array.from(pointsSet);
  const goldScore = uniquePoints[0];
  const silverScore = uniquePoints[1];
  const bronzeScore = uniquePoints[2];

  return !scores.length ? (
    <></>
  ) : (
    <>
      <LeaderboardHeader />
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
          {scores.map((score) => (
            <tr
              key={`topscore-${score.timestamp}`}
              className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg"
            >
              <td className="hidden px-2 py-4 sm:table-cell">
                {dateFromTimestamp(score.timestamp)}
              </td>
              <td className="px-2 py-4">{score.username || "Anonymous"}</td>
              <td className="px-2 py-4">{score.instrument}</td>
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
    </>
  );
}
