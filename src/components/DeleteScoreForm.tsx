import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { useScores } from "@/context/ScoresContext";
import { deleteScore } from "@/actions";
import { Score } from "@/lib/types";

export default function DeleteScoreForm({
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
  const { timestamp } = score;

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
    <>
      {error && (
        <p className="mb-6 rounded-lg bg-error px-4 py-2 text-light-bg dark:text-dark-darkerBg">
          {error}
        </p>
      )}
      {success ? (
        <p className="mb-2">This score has been deleted.</p>
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
      )}
    </>
  );
}
