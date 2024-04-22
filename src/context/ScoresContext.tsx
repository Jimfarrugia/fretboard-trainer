import { createContext, useContext, useState, useEffect } from "react";
import { Score } from "@/lib/types";
import {
  parseLocalStorageScores,
  saveRemoteScoresLocally,
} from "@/lib/helpers";
import { getUserScores } from "@/actions/getUserScores";
import { pushLocalScores } from "@/actions/pushLocalScores";
import { useSession } from "next-auth/react";
import { mergeScores } from "@/lib/helpers";

interface ScoresContextType {
  scores: Score[];
  addScore: (score: Score) => void;
}

const ScoresContext = createContext<ScoresContextType>({
  scores: [],
  addScore: () => {},
});

export const useScores = () => useContext(ScoresContext);

export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const userId = session?.data?.user?.id;

  // Get scores from local storage or set to empty array
  const [scores, setScores] = useState<Score[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScores = localStorage.getItem("scores");
      setScores(savedScores ? JSON.parse(savedScores) : []);
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
    setScores(updatedScores);
    localStorage.setItem("scores", JSON.stringify(updatedScores));
  };

  return (
    <ScoresContext.Provider value={{ scores, addScore }}>
      {children}
    </ScoresContext.Provider>
  );
}

export default ScoresContext;
