import { IoClose } from "react-icons/io5";
import { Score } from "@/lib/types";
import { capitalize, dateFromTimestamp } from "@/lib/utils";
import DeleteScoreForm from "./DeleteScoreForm";

export default function DeleteScoreModal({
  isOnline,
  userId,
  score,
  setIsOpen,
}: {
  isOnline: boolean | undefined;
  userId?: string;
  score: Score;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { timestamp, instrument, tuning, points, hardMode } = score;

  return (
    <dialog id="delete-score-modal" className="modal">
      <div className="modal-box w-fit bg-light-bg dark:bg-dark-darkerBg">
        <form method="dialog">
          <button
            type="submit"
            className="btn btn-circle absolute right-2 top-2 scale-50 border-none bg-light-darkerBg text-light-heading hover:bg-error hover:text-light-bg focus-visible:outline-4 focus-visible:outline-light-link dark:bg-dark-bg dark:text-dark-link hover:dark:bg-error hover:dark:text-dark-darkerBg focus-visible:dark:outline-dark-highlight"
            style={{ marginRight: "-0.5rem", marginTop: "-0.5rem" }}
            onClick={() => setIsOpen(false)}
          >
            <IoClose className="text-3xl" />
          </button>
        </form>
        <h3 className="mb-6 text-xl font-bold text-light-heading dark:text-dark-heading">
          Delete Score
        </h3>
        <table className="table table-xs my-6">
          <tbody>
            <tr className="border-0">
              <th className="pl-0 pr-8">Date</th>
              <td className="pr-8">{dateFromTimestamp(timestamp)}</td>
            </tr>
            <tr className="border-0">
              <th className="pl-0 pr-8">Instrument</th>
              <td>{capitalize(instrument)}</td>
            </tr>
            <tr className="border-0">
              <th className="pl-0 pr-8">Tuning</th>
              <td>{tuning}</td>
            </tr>
            <tr className="border-0">
              <th className="pl-0 pr-8">Points</th>
              <td>{points}</td>
            </tr>
            <tr className="border-0">
              <th className="pl-0 pr-8">Hard Mode</th>
              <td>{hardMode ? "On" : "Off"}</td>
            </tr>
          </tbody>
        </table>
        <DeleteScoreForm
          isOnline={isOnline}
          userId={userId}
          score={score}
          setIsOpen={setIsOpen}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setIsOpen(false)}>close</button>
      </form>
    </dialog>
  );
}
