import { notesWithSharpsAndFlats } from "@/lib/constants";

// Choose a random note from notes array
export function randomNote(
  notes: string[],
  useSharpsAndFlats: boolean = false,
) {
  //* useSharpsAndFlats should be set to true if notesWithSharpsAndFlats is passed in
  //* as the first argument. (each accidental will include both # and b, eg. "A#/Bb")
  const randomNoteIndex = Math.floor(Math.random() * notes.length);
  const randomNote = notes[randomNoteIndex];
  // if not using sharps and flats, or if randomNote is a natural, return the note
  if (!useSharpsAndFlats || randomNote.length === 1) {
    return randomNote;
  }
  // if note is an accidental, pick sharp or flat randomly
  const pickSharp = Math.floor(Math.random() * 2);
  return pickSharp
    ? randomNote.substring(0, 2) // first two chars (sharp)
    : randomNote.substring(randomNote.length - 2); // last two chars (flat)
}

// Get the next note based on current note
export function getNextNote(currentNote: string) {
  const notes = notesWithSharpsAndFlats;
  // remove octave number from note
  const note = currentNote.replace(/\d/g, "");
  // get index of current note in notes array
  const index = notes.indexOf(note);
  // add 1 to index to get next note
  return notes[(index + 1) % notes.length];
}

// Generate a two dimensional array representing the notes of the fretboard
export function generateFretboard(strings: string[], totalFrets: number) {
  const fretboard = [];
  // Iterate over each string
  for (let string of strings) {
    // This array will hold the notes for the current string
    const stringNotes = [string]; // Start with open string note
    // Get the octave number of the open string note
    let octave = parseInt(string[string.length - 1]);
    // Generate the notes for each fret
    for (let i = 1; i <= totalFrets; i++) {
      // Determine the next note
      const nextNote = getNextNote(stringNotes[i - 1]);
      // If the next note is C, increment the octave number
      if (nextNote === "C") octave++;
      // Append the octave number to nextNote and push to stringNotes
      stringNotes.push(`${nextNote}${octave}`);
    }
    // Push stringNotes to fretboard
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

// Translate a note to a human-readable string for screen readers
// eg. "F#" => "F sharp", "Db" => "D flat"
export const translateNote = (note: string) => {
  return note.length < 2
    ? note
    : note.replace("#", " sharp").replace("b", " flat");
};
