export const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];

export const notesWithSharps = [
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

export const notesWithFlats = [
  "A",
  "Bb",
  "B",
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
];

export const notesWithSharpsAndFlats = [
  "A",
  "A#/Bb",
  "B",
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E",
  "F",
  "F#/Gb",
  "G",
  "G#/Ab",
];

export const instruments = ["guitar", "bass"] as const;

export const tunings = [
  { name: "E Standard", strings: ["E", "B", "G", "D", "A", "E"] },
  { name: "Drop D", strings: ["E", "B", "G", "D", "A", "D"] },
  { name: "D Standard", strings: ["D", "A", "F", "C", "G", "D"] },
];

export const defaultSettings = {
  instrument: instruments[0],
  tuning: tunings[0],
  enabledStrings: [true, true, true, true, true, true],
  sharps: true,
  flats: false,
};
