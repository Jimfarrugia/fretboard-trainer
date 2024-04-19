import { Score } from "./interfaces";
import { notes } from "@/lib/constants";

// Choose a random note from notes array
export function randomNote(notes: string[]) {
  const randomNoteIndex = Math.floor(Math.random() * notes.length);
  return notes[randomNoteIndex];
}

// Get the next note based on current note
function getNextNote(currentNote: string) {
  let currentIndex = notes.indexOf(currentNote);
  return notes[(currentIndex + 1) % notes.length];
}

// Generate a two dimensional array representing the notes of the fretboard
export function generateFretboard(strings: string[], totalFrets: number) {
  const fretboard = [];
  // Iterate over each string
  for (let string of strings) {
    const stringNotes = [string]; // Start with open string note
    // Generate notes for each fret
    for (let i = 1; i <= totalFrets; i++) {
      stringNotes.push(getNextNote(stringNotes[i - 1]));
    }
    fretboard.push(stringNotes);
  }
  return fretboard;
}

// Hide any visible note labels on the fretboard
export function hideNoteLabels() {
  const allSpans = document.querySelectorAll("button span");
  allSpans.forEach((span) => {
    span.classList.remove("clicked", "correct", "incorrect");
  });
}

// Parse scores from localStorage and return as an array of objects
// or return an empty array if no scores exist in localStorage
export const parseLocalStorageScores = () => {
  const scores = localStorage.getItem("scores");
  return scores ? JSON.parse(scores) : [];
};

// Save scores to localStorage
export const setLocalStorageScores = (scores: Score[]) =>
  localStorage.setItem("scores", JSON.stringify(scores));

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
        userId,
      }));
      setLocalStorageScores([...localScores, ...remoteScoresToSave]);
    }
  }
};

// get date from timestamp
export const dateFromTimestamp = (isoDate: string) => {
  return isoDate.split("T")[0];
};

// Sort scores by timestamp (most recent first)
export const sortScoresByTimestamp = (scores: Score[]) => {
  return scores.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

// Find highest score in scores array
export const findHighScore = (scores: Score[]) => {
  return scores.length ? Math.max(...scores.map((s: Score) => s.points)) : 0;
};

// Append a number with its ordinal suffix (1st, 2nd, 3rd, etc.)
export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
