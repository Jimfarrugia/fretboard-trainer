import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useScores } from "@/context/ScoresContext";
import { deleteScore } from "@/actions/deleteScore";
import { Score } from "@/lib/types";
import { capitalize, dateFromTimestamp } from "@/lib/helpers";

export default function DeleteScoreModal({
  userId,
  score,
  setIsOpen,
}: {
  userId?: string;
  score: Score;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { removeScore } = useScores();
  const { timestamp, instrument, tuning, points, hardMode } = score;

  const handleClose = () => {
    setSuccess(false);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // If user is signed in, delete the score from the database
    if (userId) {
      deleteScore(userId, score)
        .then(() => {
          setSuccess(true);
          setLoading(false);
          // remove the score from state and local storage
          removeScore(timestamp);
        })
        .catch((e) => {
          console.error("Failed to delete the score in the database.", e);
          setError("Something went wrong... Please try again.");
          setLoading(false);
        });
    } else {
      // remove the score from state and local storage
      removeScore(timestamp);
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <dialog id="delete-score-modal" className="modal">
      <div className="modal-box w-fit bg-light-bg dark:bg-dark-darkerBg">
        <form method="dialog">
          <button
            type="submit"
            className="btn btn-circle absolute right-2 top-2 scale-50 border-none bg-light-darkerBg text-light-heading hover:bg-error hover:text-light-bg focus-visible:outline-4 focus-visible:outline-light-link dark:bg-dark-bg dark:text-dark-link hover:dark:bg-error hover:dark:text-dark-darkerBg focus-visible:dark:outline-dark-highlight"
            style={{ marginRight: "-0.5rem", marginTop: "-0.5rem" }}
            onClick={handleClose}
          >
            <IoClose className="text-3xl" />
          </button>
        </form>
        <h3 className="mb-6 text-xl font-bold text-light-heading dark:text-dark-heading">
          {success ? "Score Deleted" : "Delete Score"}
        </h3>
        {success ? (
          <p className="mb-6">This score has been deleted.</p>
        ) : (
          <>
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
            <DeleteForm
              error={error}
              handleSubmit={handleSubmit}
              loading={loading}
              setIsOpen={setIsOpen}
            />
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

function DeleteForm({
  error,
  handleSubmit,
  loading,
  setIsOpen,
}: {
  error: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {error ? (
        <p className="mb-6 rounded-lg bg-error px-4 py-2 text-light-bg dark:text-dark-darkerBg">
          {error}
        </p>
      ) : (
        <>
          <p className="mb-2 text-center text-sm">
            This score will be <span className="font-bold">permanently</span>{" "}
            deleted.
          </p>
          <p className="mb-2 text-center text-sm font-bold">
            This can not be undone.
          </p>
          <p className="mb-6 text-center text-sm">Are you sure?</p>
        </>
      )}
      <div className="flex w-full flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 sm:gap-6">
            <button
              type="button"
              className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link dark:bg-dark-link dark:text-dark-darkerBg dark:hover:bg-dark-hover hover:dark:text-dark-darkerBg focus-visible:dark:outline-dark-highlight"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error border-0 text-light-bg hover:bg-light-hover dark:text-dark-darkerBg dark:hover:bg-dark-hover"
            >
              <FaTrashCan className="text-lg" />
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
