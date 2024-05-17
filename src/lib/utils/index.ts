import {
  removeOctaveNumber,
  sharpNote,
  flatNote,
  isCorrectNote,
  randomNote,
  getNextNote,
  generateFretboard,
  hideNoteLabels,
  translateNote,
} from "@/lib/utils/fretboard";
import {
  parseLocalStorageScores,
  setLocalStorageScores,
  sortScoresByTimestamp,
  sortScoresByPoints,
  findHighScore,
  mergeScores,
  saveRemoteScoresLocally,
  filterScores,
} from "@/lib/utils/scores";
import { Instrument } from "@/lib/types";

export {
  // fretboard
  removeOctaveNumber,
  sharpNote,
  flatNote,
  isCorrectNote,
  randomNote,
  getNextNote,
  generateFretboard,
  hideNoteLabels,
  translateNote,
  // scores
  parseLocalStorageScores,
  setLocalStorageScores,
  sortScoresByTimestamp,
  sortScoresByPoints,
  findHighScore,
  mergeScores,
  saveRemoteScoresLocally,
  filterScores,
};

// get date from timestamp
export const dateFromTimestamp = (isoDate: string) => {
  return isoDate.split("T")[0];
};

// Capitalize the first letter of a string
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Append a number with its ordinal suffix (1st, 2nd, 3rd, etc.)
export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Get the last character of a string
export const lastChar = (str: string) => str.charAt(str.length - 1);

// Create an array of selectable octave numbers for a note based on the sound clips that are available
export const getAvailableOctaves = (note: string) => {
  const noteWithoutOctave = removeOctaveNumber(note);
  const widerRangeNotes = ["A", "B", "A#/Bb"];
  if (widerRangeNotes.includes(noteWithoutOctave)) {
    // there are sound clips available in octaves 0-7 for these notes
    return Array.from({ length: 8 }, (_, index) => index);
  }
  if (noteWithoutOctave === "C") {
    // there are sound clips available in octaves 1-8 for C
    return Array.from({ length: 8 }, (_, index) => index + 1);
  }
  // the rest have sound clips available in octaves 1-7
  return Array.from({ length: 7 }, (_, index) => index + 1);
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
  gainNode.gain.value = 1.5;
  audio.volume = volume;
  audio.play();
  // Cut off the audio after 2 seconds
  setTimeout(() => {
    audio.pause();
    audio.remove();
  }, 2000);
};
