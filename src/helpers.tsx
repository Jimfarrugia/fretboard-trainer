import { Score } from "./interfaces";

export const notes = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

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
export const parseScoreHistory = () => {
  const scores = localStorage.getItem("scores");
  return scores ? JSON.parse(scores) : [];
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
  return Math.max(...scores.map((s: Score) => s.points));
};
