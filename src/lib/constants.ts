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
    instrument: "guitar",
    strings: ["E4", "B3", "G3", "D3", "A2", "E2"],
  },
  {
    name: "Open G",
    instrument: "guitar",
    strings: ["D4", "B3", "G3", "D3", "G2", "D2"],
  },
  {
    name: "Eb Standard",
    instrument: "guitar",
    strings: ["D#/Eb4", "A#/Bb3", "F#/Gb3", "C#/Db3", "G#/Ab2", "D#/Eb2"],
  },
  {
    name: "Drop D",
    instrument: "guitar",
    strings: ["E4", "B3", "G3", "D3", "A2", "D2"],
  },
  {
    name: "D Standard",
    instrument: "guitar",
    strings: ["D4", "A3", "F3", "C3", "G2", "D2"],
  },
  {
    name: "Open D",
    instrument: "guitar",
    strings: ["D4", "A3", "F#/Gb3", "D3", "A2", "D2"],
  },
  {
    name: "DADGAD",
    instrument: "guitar",
    strings: ["D4", "A3", "G3", "D3", "A2", "D2"],
  },
  {
    name: "Drop C",
    instrument: "guitar",
    strings: ["D4", "A3", "F3", "C3", "G2", "C2"],
  },
  {
    name: "C# Standard",
    instrument: "guitar",
    strings: ["C#/Db4", "G#/Ab3", "E", "B2", "F#/Gb2", "C#/Db2"],
  },
  {
    name: "C Standard",
    instrument: "guitar",
    strings: ["C4", "G3", "D#/Eb3", "A#/Bb2", "F2", "C2"],
  },
  {
    name: "Drop B",
    instrument: "guitar",
    strings: ["C#/Db4", "G#/Ab3", "E3", "B2", "F#/Gb2", "B1"],
  },
  {
    name: "E Standard",
    instrument: "bass",
    strings: ["G2", "D2", "A1", "E1"],
  },
  {
    name: "Eb Standard",
    instrument: "bass",
    strings: ["F#/Gb2", "C#/Db2", "G#/Ab1", "D#/Eb1"],
  },
  {
    name: "Drop D",
    instrument: "bass",
    strings: ["G2", "D2", "A1", "D1"],
  },
  {
    name: "D Standard",
    instrument: "bass",
    strings: ["F2", "C2", "G1", "D1"],
  },
  {
    name: "Drop C#",
    instrument: "bass",
    strings: ["F#/Gb2", "C#/Db2", "G#/Ab1", "C#/Db1"],
  },
  {
    name: "C# Standard",
    instrument: "bass",
    strings: ["E2", "B1", "F#/Gb1", "C#/Db1"],
  },
  {
    name: "Standard",
    instrument: "ukulele",
    strings: ["A4", "E4", "C4", "G4"],
  },
  {
    name: "Traditional Hawaiian",
    instrument: "ukulele",
    strings: ["B4", "F#/Gb4", "D4", "A4"],
  },
  {
    name: "Open G",
    instrument: "ukulele",
    strings: ["G4", "D4", "B3", "G4"],
  },
  {
    name: "Baritone",
    instrument: "ukulele",
    strings: ["E4", "B3", "G3", "D4"],
  },
  {
    name: "Bass",
    instrument: "ukulele",
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
