import { Score, ScoreFilters, Instrument } from "./types";
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

// Parse scores from localStorage and return as an array of objects
// or return an empty array if no scores exist in localStorage
export const parseLocalStorageScores = () => {
  const scores = localStorage.getItem("scores");
  return scores ? JSON.parse(scores) : [];
};

// Save scores to localStorage
export const setLocalStorageScores = (scores: Score[]) =>
  localStorage.setItem("scores", JSON.stringify(scores));

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

// Append a number with its ordinal suffix (1st, 2nd, 3rd, etc.)
export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Capitalize the first letter of a string
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

// Translate a note to a human-readable string for screen readers
// eg. "F#" => "F sharp", "Db" => "D flat"
export const translateNote = (note: string) => {
  return note.length < 2
    ? note
    : note.replace("#", " sharp").replace("b", " flat");
};

// Play a audio of a note
//* Note: all of the file names for accidental notes use flats only (eg. Ab.aac)
export const playNoteAudio = (
  instrument: Instrument, // eg. "guitar", "bass"
  note: string, // eg. "A4", "A#/Bb4"
  volume: number = 1, // 1 = 100% volume
) => {
  // Use the guitar soundfont if ukulele is selected
  const dir = instrument === "ukulele" ? "guitar" : instrument;
  // Get the filename from note
  const filename = note.length > 2 ? note.substring(note.length - 3) : note;
  // Create audio context
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  // Initialize audio and connect it to the audio context
  const audio = new Audio(`/audio/${dir}/${filename}.aac`);
  const source = audioContext.createMediaElementSource(audio);
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 2;
  audio.volume = volume;
  audio.play();
  // Cut off the audio after 2 seconds
  setTimeout(() => {
    audio.pause();
    audio.remove();
  }, 2000);
};
