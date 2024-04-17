import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdReplay } from "react-icons/md";
import { publishScore } from "@/actions/publishScore";
import { updateUsername } from "@/actions/updateUsername";

export default function PublishScoreForm({
  userId,
  setShowForm,
  startGame,
}: {
  userId: string | undefined;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  startGame: () => void;
}) {
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidUsername = (string: string) =>
    /^$|^[a-zA-Z0-9_-]{1,16}$/.test(string);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidUsername(e.target.value)) {
      setUsername(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (userId) {
      setLoading(true);
      publishScore(userId, username)
        .then(() => {
          setSuccess(true);
          setLoading(false);
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
      <h3 className="mb-6 text-xl font-bold text-light-heading dark:text-dark-heading">
        {success ? "Score Published" : "Publish Score"}
      </h3>
      {success ? (
        <>
          <p className="mb-6">
            Your score has been published to the leaderboard!
          </p>
          <button
            type="button"
            className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
            onClick={startGame}
          >
            <MdReplay className="text-lg" />
            Play again
          </button>
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
            <input
              type="text"
              className="input input-bordered mb-6 w-full max-w-xs border-light-heading bg-light-darkerBg text-light-body placeholder:text-sm placeholder:text-light-link focus:outline-light-link dark:border-dark-heading dark:bg-dark-bg dark:text-dark-body dark:outline-dark-highlight placeholder:dark:text-dark-heading"
              placeholder="Username (optional)"
              maxLength={16}
              onChange={(e) => handleUsernameChange(e)}
              value={username}
            />
            <div className="flex justify-center gap-4 sm:gap-6">
              <button
                type="button"
                className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-error dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary border-0 bg-light-link text-light-bg hover:bg-light-hover hover:text-light-bg dark:bg-dark-highlight dark:text-dark-darkerBg dark:hover:bg-dark-link hover:dark:text-dark-bg"
                onClick={handleSubmit}
              >
                <IoIosSend className="text-lg" />
                {loading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
