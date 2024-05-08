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
} from "@/lib/utils";
import { notesWithSharps, notesWithSharpsAndFlats } from "@/lib/constants";

describe("removeOctaveNumber", () => {
  it("returns a natural note with the octave number removed", () => {
    const note = "A4";
    expect(removeOctaveNumber(note)).toBe("A");
  });

  it("returns an accidental note with the octave number removed", () => {
    const note = "A#/Bb4";
    expect(removeOctaveNumber(note)).toBe("A#/Bb");
  });

  it("returns a natural note as-is if it doesn't have an octave number", () => {
    const note = "A";
    expect(removeOctaveNumber(note)).toBe(note);
  });

  it("returns an accidental note as-is if it doesn't have an octave number", () => {
    const note = "A#/Bb";
    expect(removeOctaveNumber(note)).toBe(note);
  });
});

describe("sharpNote", () => {
  it("returns the sharp note name from an accidental note", () => {
    const note = "A#/Bb";
    expect(sharpNote(note)).toBe("A#");
  });
});

describe("flatNote", () => {
  it("returns the flat note name from an accidental note", () => {
    const note = "A#/Bb";
    expect(flatNote(note)).toBe("Bb");
  });
});

describe("isCorrectNote", () => {
  it("returns true if the natural note is the correct answer for the challenge", () => {
    const note = "A4";
    const challenge = "A";
    expect(isCorrectNote(note, challenge)).toBe(true);
  });

  it("returns false if the natural note is not the correct answer for the challenge", () => {
    const note = "A4";
    const challenge = "B";
    expect(isCorrectNote(note, challenge)).toBe(false);
  });

  it("returns true if the accidental note is the correct answer for the challenge", () => {
    const note = "A#/Bb4";
    const challenge = "Bb";
    expect(isCorrectNote(note, challenge)).toBe(true);
  });

  it("returns false if the accidental note is not the correct answer for the challenge", () => {
    const note = "A#/Bb4";
    const challenge = "C#";
    expect(isCorrectNote(note, challenge)).toBe(false);
  });
});

describe("randomNote", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns a note from the notes array", () => {
    const notes = notesWithSharps;
    const result = randomNote(notes);
    expect(notes).toContain(result);
  });

  it("properly returns an accidental note when useSharpsAndFlats is true and pickSharp is true", () => {
    const notes = ["C", "C#/Db", "D"];
    jest.spyOn(Math, "floor").mockReturnValue(1);
    const result = randomNote(notes, true);
    expect(result).toBe("C#");
  });

  it("properly returns a flat note when useSharpsAndFlats is true and pickSharp is false", () => {
    const notes = ["A#/Bb", "B", "C", "C#/Db"];
    jest.spyOn(Math, "floor").mockReturnValue(0);
    const result = randomNote(notes, true);
    expect(result).toBe("Bb");
  });
});

describe("getNextNote", () => {
  it("returns the next note when current note is the last note", () => {
    const notes = notesWithSharpsAndFlats;
    const currentNote = notes[notes.length - 1];
    const nextNote = getNextNote(currentNote);
    expect(nextNote).toBe(notes[0]);
  });

  it("returns the next note when current note is not the last note", () => {
    const notes = notesWithSharpsAndFlats;
    const currentNote = notes[1];
    const nextNote = getNextNote(currentNote);
    expect(nextNote).toBe(notes[2]);
  });
});

describe("generateFretboard", () => {
  it("returns an array with one child array for each string", () => {
    const result = generateFretboard(["E4", "B3", "G3", "D3"], 2);
    expect(result).toHaveLength(4);
    expect(result[0][0]).toBe("E4");
    expect(result[1][0]).toBe("B3");
    expect(result[2][0]).toBe("G3");
    expect(result[3][0]).toBe("D3");
  });

  it("returns nested arrays with length equal to the number of frets + 1", () => {
    const result = generateFretboard(["E4", "B3", "G3", "D3"], 4);
    expect(result[0]).toHaveLength(5);
    expect(result[1]).toHaveLength(5);
    expect(result[2]).toHaveLength(5);
    expect(result[3]).toHaveLength(5);
  });

  it("returns nested arrays containing notes ascending the chromatic scale in scientific pitch notation", () => {
    const result = generateFretboard(["E4", "B3", "G3", "D3"], 4);
    expect(result[0]).toStrictEqual(["E4", "F4", "F#/Gb4", "G4", "G#/Ab4"]);
    expect(result[1]).toStrictEqual(["B3", "C4", "C#/Db4", "D4", "D#/Eb4"]);
    expect(result[2]).toStrictEqual(["G3", "G#/Ab3", "A3", "A#/Bb3", "B3"]);
    expect(result[3]).toStrictEqual(["D3", "D#/Eb3", "E3", "F3", "F#/Gb3"]);
  });
});

describe("hideNoteLabels", () => {
  beforeEach(() => {
    // Mock the document.querySelectorAll function
    jest.spyOn(document, "querySelectorAll").mockReturnValue({
      forEach: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls document.querySelectorAll with 'button span'", () => {
    hideNoteLabels();
    expect(document.querySelectorAll).toHaveBeenCalledWith("button span");
  });

  it("calls forEach on the result of document.querySelectorAll", () => {
    const mockSpan = { classList: { remove: jest.fn() } };
    const mockSpans = {
      forEach: jest
        .fn()
        .mockImplementation((callback: (span: Element) => void) => {
          callback(mockSpan as unknown as Element);
        }),
    };
    jest
      .spyOn(document, "querySelectorAll")
      .mockReturnValue(mockSpans as unknown as NodeListOf<Element>);

    hideNoteLabels();
    expect(mockSpans.forEach).toHaveBeenCalled();
    expect(mockSpan.classList.remove).toHaveBeenCalledWith(
      "clicked",
      "correct",
      "incorrect",
    );
  });
});

describe("translateNote", () => {
  it("returns the input string if given a natural note", () => {
    expect(translateNote("A")).toBe("A");
  });

  it("replaces '#' character with the word 'sharp'", () => {
    expect(translateNote("A#")).toBe("A sharp");
  });

  it("replaces 'b' character with the word 'flat'", () => {
    expect(translateNote("Ab")).toBe("A flat");
  });
});
