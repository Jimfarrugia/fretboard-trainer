import Link from "next/link";
import { HiOutlineLightBulb } from "react-icons/hi";

export default function History() {
  return (
    <>
      <div className="sm:flex sm:justify-between sm:items-center pt-12 pb-8">
        <h2 className="font-bold text-lg mb-1 sm:mb-0 text-light-heading dark:text-dark-heading">
          History
        </h2>
        <p className="flex gap-1 items-center text-xs">
          <HiOutlineLightBulb className="text-lg text-light-highlight dark:text-dark-highlight" />
          <Link
            className="font-bold underline text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
            href="signin"
          >
            Sign in
          </Link>{" "}
          to save your history.
        </p>
      </div>
      <table className="table-auto w-full text-xs">
        <thead className="text-left text-light-heading dark:text-dark-heading">
          <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
            <th className="p-2">Date</th>
            <th className="p-2">Instrument</th>
            <th className="p-2">Tuning</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b-2 border-light-darkerBg dark:border-dark-darkerBg">
            <td className="px-2 py-4">2024-07-29</td>
            <td className="px-2 py-4">Guitar</td>
            <td className="px-2 py-4">E Standard</td>
            <td className="px-2 py-4">40</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
