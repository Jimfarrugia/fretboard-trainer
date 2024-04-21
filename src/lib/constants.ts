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

// strings ordered from 1st to 6th
export const tunings = [
  { name: "E Standard", strings: ["E", "B", "G", "D", "A", "E"] },
  { name: "Open G", strings: ["D", "B", "G", "D", "G", "D"] },
  {
    name: "Eb Standard",
    strings: ["D#/Eb", "A#/Bb", "F#/Gb", "C#/Db", "G#/Ab", "D#/Eb"],
  },
  { name: "Drop D", strings: ["E", "B", "G", "D", "A", "D"] },
  { name: "D Standard", strings: ["D", "A", "F", "C", "G", "D"] },
  { name: "Open D", strings: ["D", "A", "F#", "D", "A", "D"] },
  { name: "DADGAD", strings: ["D", "A", "G", "D", "A", "D"] },
  { name: "Drop C", strings: ["D", "A", "F", "C", "G", "C"] },
  { name: "C Standard", strings: ["C", "G", "D#/Eb", "A#/Bb", "F", "C"] },
  { name: "Drop B", strings: ["C#/Db", "G#/Ab", "E", "B", "F#/Gb", "B"] },
];

export const defaultSettings = {
  instrument: instruments[0],
  tuning: tunings[0],
  enabledStrings: [true, true, true, true, true, true],
  sharps: true,
  flats: false,
};
