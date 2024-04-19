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

export const instruments = ["guitar", "bass"] as const;

export const tunings = [
  { name: "E Standard", strings: ["E", "B", "G", "D", "A", "E"] },
  { name: "Drop D", strings: ["E", "B", "G", "D", "A", "D"] },
  { name: "D Standard", strings: ["D", "A", "F", "C", "G", "D"] },
];
