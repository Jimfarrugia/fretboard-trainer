import { Score, ScoreFilters } from "@/lib/types";

// Parse scores from localStorage and return as an array of objects
// or return an empty array if no scores exist in localStorage
export const parseLocalStorageScores = () => {
  const scores = localStorage.getItem("scores");
  return scores ? JSON.parse(scores) : [];
};

// Save scores to localStorage
export const setLocalStorageScores = (scores: Score[]) =>
  localStorage.setItem("scores", JSON.stringify(scores));

// Sort scores by timestamp (most recent first)
export const sortScoresByTimestamp = (scores: Score[]) => {
  return scores.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

// Sort scores by points (highest first)
export const sortScoresByPoints = (scores: Score[]) => {
  return scores.sort((a, b) => {
    return b.points - a.points;
  });
};

// Find highest score in scores array
export const findHighScore = (scores: Score[]) => {
  return scores.length ? Math.max(...scores.map((s: Score) => s.points)) : 0;
};

// Combine two arrays of scores into a new array with duplicate scores omitted
export const mergeScores = (scores: Score[], newScores: Score[]) => {
  const mergedScores = [...scores, ...newScores];
  // Remove duplicate scores based on timestamp property
  return mergedScores.filter(
    (obj, index, self) =>
      index === self.findIndex((o) => o.timestamp === obj.timestamp),
  );
};

// Save database scores to localStorage
export const saveRemoteScoresLocally = (
  remoteScores: Score[],
  userId: string,
) => {
  const localScores = parseLocalStorageScores();
  // check if any userScores scores are not saved in local storage
  if (remoteScores.length > localScores.length) {
    const scoresNotInLocalStorage = remoteScores.filter(
      (remoteScore) =>
        !localScores.find(
          (localScore: Score) => localScore.timestamp === remoteScore.timestamp,
        ),
    );
    // if any scores are not yet saved in local storage, save them
    if (scoresNotInLocalStorage.length > 0) {
      // only save necessary fields
      const remoteScoresToSave = scoresNotInLocalStorage.map((remoteScore) => ({
        points: remoteScore.points,
        instrument: remoteScore.instrument,
        tuning: remoteScore.tuning,
        timestamp: remoteScore.timestamp,
        hardMode: remoteScore.hardMode,
        published: remoteScore.published,
        userId,
      }));
      setLocalStorageScores([...localScores, ...remoteScoresToSave]);
    }
  }
};

// Filter an array of scores based on the provided filters
// * Note:
// 1. This function should accept any amount of instrument filters.
// 2. Any filters other than 'hardMode' are considered instrument filters.
// 3. The key of an instrument filter in the filters object must be an instrument name (see lib/constants.ts).
export const filterScores = (scores: Score[], filters: ScoreFilters) => {
  const { hardMode: hardModeFilter, ...instrumentFilters } = filters;
  // If all filters are off, return all scores
  const noActiveFilters = !Object.values(filters).includes(true);
  if (noActiveFilters) return scores;
  // If all instrument filters are off, filter scores by hardMode
  const noActiveInstrumentFilters =
    !Object.values(instrumentFilters).includes(true);
  if (noActiveInstrumentFilters) {
    return scores.filter((score) => score.hardMode === hardModeFilter);
  }
  // Filter scores by instrument and hard mode
  return scores.filter((score) => {
    const { instrument, hardMode: isHardModeScore } = score;
    // Check if the score's instrument exists as a key in instrumentFilters
    // and if the value of that key in instrumentFilters is true
    const isInstrumentMatch =
      instrument in instrumentFilters && instrumentFilters[instrument];
    // Check if hardModeFilter is off or if the score's hardMode is true
    const isHardModeMatch = !hardModeFilter || isHardModeScore;
    // Include the score if it's instrument and hardMode match with the filters
    return isInstrumentMatch && isHardModeMatch;
  });
};
