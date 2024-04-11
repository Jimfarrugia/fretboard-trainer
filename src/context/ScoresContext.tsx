import { createContext, useContext, useState, useEffect } from "react";
import { Score } from "@/interfaces";

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
  // Get scores from localStorage or set to empty array
  const [scores, setScores] = useState<Score[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScores = localStorage.getItem("scores");
      setScores(savedScores ? JSON.parse(savedScores) : []);
    }
  }, []);

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
