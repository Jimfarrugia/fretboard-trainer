import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useScores } from "@/context/ScoresContext";
import { publishScore } from "@/actions/publishScore";
import { updateUsername } from "@/actions/updateUsername";
import { Score } from "@/lib/types";
import { capitalize, dateFromTimestamp } from "@/lib/helpers";

export interface SessionUser {
  createdAt?: Date;
  email?: string;
  emailVerified: boolean | null;
  id?: string;
  image?: string;
  name?: string;
  updatedAt?: Date;
  username?: string;
}

export default function PublishScoreModal({
  userId,
  score,
  setIsOpen,
}: {
  userId: string;
  score: Score;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const session = useSession();
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateScore } = useScores();
  const user = session?.data?.user as SessionUser;
  const { timestamp, instrument, tuning, points, hardMode } = score;

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const isValidUsername = (string: string) =>
    /^$|^[a-zA-Z0-9_-]{1,16}$/.test(string);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidUsername(e.target.value)) {
      setUsername(e.target.value);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    publishScore(userId, username, timestamp)
      .then(() => {
        setSuccess(true);
        setLoading(false);
        updateScore(timestamp, { published: true });
        updateUsername(userId, username).catch((e) =>
          console.error("Failed to update the user's username.", e),
        );
      })
      .catch((e) => {
        console.error("Failed to publish score.", e);
        setError(
          "Something went wrong... You can try again or use a different name.",
        );
        setLoading(false);
      });
  };

  return (
    <dialog id="publish-score-modal" className="modal">
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
          {success ? "Score Published" : "Publish Score"}
        </h3>
        {success ? (
          <p className="mb-6">
            This score has been published to the leaderboard!
          </p>
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
            <PublishForm
              error={error}
              handleSubmit={handleSubmit}
              handleUsernameChange={handleUsernameChange}
              username={username}
              loading={loading}
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

function PublishForm({
  error,
  handleSubmit,
  handleUsernameChange,
  username,
  loading,
}: {
  error: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  username: string;
  loading: boolean;
}) {
  return (
    <>
      {error ? (
        <p className="mb-6 rounded-lg bg-error px-4 py-2 text-light-bg dark:text-dark-darkerBg">
          {error}
        </p>
      ) : (
        <p className="mb-6 text-sm">
          This name will appear next to your score:
        </p>
      )}
      <div className="flex w-full flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input input-bordered mb-6 w-full max-w-xs border-light-heading bg-light-darkerBg text-light-body transition-colors placeholder:text-sm placeholder:text-light-link hover:border-light-hover hover:text-light-hover focus:outline-light-link dark:border-dark-heading dark:bg-dark-bg dark:text-dark-body dark:outline-dark-highlight placeholder:dark:text-dark-heading hover:dark:border-dark-hover"
            placeholder="Username (optional)"
            autoComplete="new-password"
            autoFocus
            maxLength={16}
            onChange={(e) => handleUsernameChange(e)}
            value={username}
          />
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg focus-visible:dark:outline-dark-highlight"
            >
              <IoIosSend className="text-lg" />
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
