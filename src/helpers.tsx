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
