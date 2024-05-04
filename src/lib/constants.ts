import { Tuning } from "./types";

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

export const instruments = ["guitar", "bass", "ukulele"] as const;

// strings ordered from 1st to 6th
export const tunings: Tuning[] = [
  {
    name: "E Standard",
    instruments: ["guitar", "bass"],
    strings: ["E4", "B3", "G3", "D3", "A2", "E2"],
  },
  // BASS => G2 - D2 - A1 - E1
  {
    name: "Open G",
    instruments: ["guitar", "bass"],
    strings: ["D4", "B3", "G3", "D3", "G2", "D2"],
  },
  {
    name: "Eb Standard",
    instruments: ["guitar", "bass"],
    strings: ["D#/Eb4", "A#/Bb3", "F#/Gb3", "C#/Db3", "G#/Ab2", "D#/Eb2"],
  },
  {
    name: "Drop D",
    instruments: ["guitar", "bass"],
    strings: ["E4", "B3", "G3", "D3", "A2", "D2"],
  },
  {
    name: "D Standard",
    instruments: ["guitar", "bass"],
    strings: ["D4", "A3", "F3", "C3", "G2", "D2"],
  },
  {
    name: "Open D",
    instruments: ["guitar", "bass"],
    strings: ["D4", "A3", "F#3", "D3", "A2", "D2"],
  },
  {
    name: "DADGAD",
    instruments: ["guitar", "bass"],
    strings: ["D4", "A3", "G3", "D3", "A2", "D2"],
  },
  {
    name: "Drop C",
    instruments: ["guitar", "bass"],
    strings: ["D4", "A3", "F3", "C3", "G2", "C2"],
  },
  {
    name: "C Standard",
    instruments: ["guitar", "bass"],
    strings: ["C4", "G3", "D#/Eb3", "A#/Bb2", "F2", "C2"],
  },
  {
    name: "Drop B",
    instruments: ["guitar", "bass"],
    strings: ["C#/Db4", "G#/Ab3", "E3", "B2", "F#/Gb2", "B1"],
  },
  {
    name: "Standard",
    instruments: ["ukulele"],
    strings: ["A4", "E4", "C4", "G4"],
  },
  {
    name: "Traditional Hawaiian",
    instruments: ["ukulele"],
    strings: ["B4", "F#/Gb4", "D4", "A4"],
  },
  {
    name: "Open G",
    instruments: ["ukulele"],
    strings: ["G4", "D4", "B3", "G4"],
  },
  {
    name: "Baritone",
    instruments: ["ukulele"],
    strings: ["E4", "B3", "G3", "D4"],
  },
  {
    name: "Bass",
    instruments: ["ukulele"],
    strings: ["G3", "D3", "A2", "E2"],
  },
];

export const defaultSettings = {
  instrument: instruments[0],
  tuning: tunings[0],
  enabledStrings: [true, true, true, true, true, true],
  sharps: true,
  flats: false,
  leftHanded: false,
  hardMode: false,
};
