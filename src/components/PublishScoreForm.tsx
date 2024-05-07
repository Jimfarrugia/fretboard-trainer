import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdReplay } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useScores } from "@/context/ScoresContext";
import { publishScore } from "@/actions/publishScore";
import { updateUsername } from "@/actions/updateUsername";
import { Score } from "@/lib/types";

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

export default function PublishScoreForm({
  userId,
  score,
  setIsOpen,
  startGame,
}: {
  userId: string | undefined;
  score: Score;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startGame?: () => void;
}) {
  const { timestamp } = score;
  const session = useSession();
  const { updateScore } = useScores();
  const [username, setUsername] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = session?.data?.user as SessionUser;

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
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
    }
  };

  return (
    <>
      {success ? (
        <>
          <p className="mb-2">
            Your score has been published to the leaderboard!
          </p>
          {startGame && (
            <button
              type="button"
              className="btn btn-primary mt-4 border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
              onClick={startGame}
            >
              <MdReplay className="text-lg" />
              Play again
            </button>
          )}
        </>
      ) : (
        <>
          {error ? (
            <p className="mb-6 rounded-lg bg-error px-4 py-2 text-light-bg dark:text-dark-darkerBg">
              {error}
            </p>
          ) : (
            <p className="mb-6">This name will appear next to your score:</p>
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
              <div className="flex justify-center gap-4 sm:gap-6">
                <button
                  type="button"
                  className="btn btn-primary border-0 bg-light-darkerBg text-light-body hover:bg-light-hover hover:text-light-bg focus-visible:outline-light-link dark:bg-dark-link dark:text-dark-darkerBg dark:hover:bg-dark-hover hover:dark:text-dark-darkerBg focus-visible:dark:outline-dark-highlight"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
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
      )}
    </>
  );
}
