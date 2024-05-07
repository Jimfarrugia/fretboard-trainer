import { createContext, useContext, useState, useEffect } from "react";
import { Score } from "@/lib/types";
import {
  mergeScores,
  parseLocalStorageScores,
  setLocalStorageScores,
  saveRemoteScoresLocally,
} from "@/lib/utils";
import { getUserScores, pushLocalScores, createScore } from "@/actions";
import { useSession } from "next-auth/react";

interface ScoresContextType {
  scores: Score[];
  addScore: (score: Score) => void;
  updateScore: (timestamp: string, newValues: Partial<Score>) => void;
  removeScore: (timestamp: string) => void;
}

const ScoresContext = createContext<ScoresContextType>({
  scores: [],
  addScore: () => {},
  updateScore: () => {},
  removeScore: () => {},
});

export const useScores = () => useContext(ScoresContext);

export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [scores, setScores] = useState<Score[]>([]);

  // Get scores from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScores(parseLocalStorageScores());
    }
  }, []);

  // Push local storage scores to the database
  useEffect(() => {
    const localScores = parseLocalStorageScores();
    if (userId && localScores.length) {
      pushLocalScores(userId, localScores);
    }
  }, [userId]);

  // Fetch scores from the database
  useEffect(() => {
    if (userId) {
      getUserScores(userId)
        .then((res) =>
          // merge existing scores with database scores
          setScores((prevScores) => mergeScores(prevScores, res)),
        )
        .catch((e) =>
          console.error("Failed to fetch scores from the database.", e),
        );
    }
  }, [userId]);

  // Make sure all scores are saved in local storage
  useEffect(() => {
    if (scores.length && userId) {
      saveRemoteScoresLocally(scores, userId);
    }
  }, [scores, userId]);

  // Add new score to scores array and save to localStorage
  const addScore = (newScore: Score) => {
    const updatedScores = [newScore, ...scores];
    setLocalStorageScores(updatedScores);
    setScores(updatedScores);
    if (userId) {
      // add score to the database if user is signed in
      createScore(userId, newScore);
    }
  };

  // Update a score in state and localStorage
  const updateScore = (timestamp: string, newValues: Partial<Score>) => {
    // apply new values to the score with the matching timestamp
    const updatedScores = scores.map((score) => {
      if (score.timestamp === timestamp) {
        return { ...score, ...newValues };
      }
      return score;
    });
    setScores(updatedScores);
    setLocalStorageScores(updatedScores);
  };

  // Remove a score from state and localStorage
  const removeScore = (timestamp: string) => {
    // remove the score with the matching timestamp
    const updatedScores = scores.filter(
      (score) => score.timestamp !== timestamp,
    );
    setScores(updatedScores);
    setLocalStorageScores(updatedScores);
  };

  return (
    <ScoresContext.Provider
      value={{ scores, addScore, updateScore, removeScore }}
    >
      {children}
    </ScoresContext.Provider>
  );
}

export default ScoresContext;
