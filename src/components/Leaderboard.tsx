import Link from "next/link";

export default function Leaderboard() {
  return (
    <>
      <div className="flex justify-between items-center pt-12 pb-8">
        <h2 className="font-bold text-lg text-dark-heading">Leaderboard</h2>
        <p className="text-xs">
          <Link
            className="font-bold underline hover:text-dark-hover"
            href="signin"
          >
            Sign in
          </Link>{" "}
          to publish your scores.
        </p>
      </div>
      <table className="table-auto w-full text-xs">
        <thead className="text-left text-dark-heading">
          <tr className="border-b-2 border-dark-darkerBg">
            <th className="p-2">Date</th>
            <th className="p-2">Username</th>
            <th className="p-2">Instrument</th>
            <th className="p-2">Tuning</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b-2 border-dark-darkerBg">
            <td className="px-2 py-4">2024-07-29</td>
            <td className="px-2 py-4">SRV_FAN</td>
            <td className="px-2 py-4">Guitar</td>
            <td className="px-2 py-4">E Standard</td>
            <td className="px-2 py-4">45</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
