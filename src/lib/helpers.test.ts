import {
  getNextNote,
  randomNote,
  generateFretboard,
  hideNoteLabels,
  parseLocalStorageScores,
  setLocalStorageScores,
  mergeScores,
  saveRemoteScoresLocally,
  dateFromTimestamp,
  sortScoresByTimestamp,
  sortScoresByPoints,
  findHighScore,
  ordinal,
  capitalize,
} from "./helpers";
import { notesWithSharps, notesWithSharpsAndFlats } from "./constants";
import { Score } from "./types";

const sampleScores = [
  {
    points: 7,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-25T16:30:46.716Z",
    hardMode: true,
  },
  {
    points: 18,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-24T03:25:09.264Z",
    hardMode: false,
    userId: "testid",
  },
  {
    points: 0,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-24T03:03:55.683Z",
    hardMode: false,
  },
];

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
    const result = generateFretboard(["E", "B", "G", "D"], 2);
    expect(result).toHaveLength(4);
    expect(result[0][0]).toBe("E");
    expect(result[1][0]).toBe("B");
    expect(result[2][0]).toBe("G");
    expect(result[3][0]).toBe("D");
  });

  it("returns nested arrays with length equal to the number of frets + 1", () => {
    const result = generateFretboard(["E", "B", "G", "D"], 4);
    expect(result[0]).toHaveLength(5);
    expect(result[1]).toHaveLength(5);
    expect(result[2]).toHaveLength(5);
    expect(result[3]).toHaveLength(5);
  });

  it("returns nested arrays containing notes ascending the chromatic scale", () => {
    const result = generateFretboard(["E", "B", "G", "D"], 4);
    expect(result[0]).toStrictEqual(["E", "F", "F#/Gb", "G", "G#/Ab"]);
    expect(result[1]).toStrictEqual(["B", "C", "C#/Db", "D", "D#/Eb"]);
    expect(result[2]).toStrictEqual(["G", "G#/Ab", "A", "A#/Bb", "B"]);
    expect(result[3]).toStrictEqual(["D", "D#/Eb", "E", "F", "F#/Gb"]);
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

describe("parseLocalStorageScores", () => {
  beforeEach(() => localStorage.clear());

  it("returns an empty array if no scores exist in localStorage", () => {
    const parsedScores = parseLocalStorageScores();
    expect(parsedScores).toEqual([]);
  });

  it("returns an array of objects if scores exist in localStorage", () => {
    localStorage.setItem("scores", JSON.stringify(sampleScores));
    const parsedScores = parseLocalStorageScores();
    expect(parsedScores).toEqual(sampleScores);
  });
});

describe("setLocalStorageScores", () => {
  it("saves scores to localStorage", () => {
    setLocalStorageScores(sampleScores);
    const savedScores = JSON.parse(localStorage.getItem("scores") || "[]");
    expect(savedScores).toEqual(sampleScores);
  });
});

describe("mergeScores", () => {
  it("returns an empty array when merging two empty arrays", () => {
    const scores: Score[] = [];
    const newScores: Score[] = [];
    const mergedScores = mergeScores(scores, newScores);
    expect(mergedScores).toEqual([]);
  });

  it("returns the non-empty array when merging an empty array with a non-empty array", () => {
    const scores: Score[] = [];
    const newScores: Score[] = sampleScores;
    const mergedScores = mergeScores(scores, newScores);
    expect(mergedScores).toEqual(newScores);
  });

  it("returns the non-empty array when merging a non-empty array with an empty array", () => {
    const scores: Score[] = sampleScores;
    const newScores: Score[] = [];
    const mergedScores = mergeScores(scores, newScores);
    expect(mergedScores).toEqual(scores);
  });

  it("returns a new array with all the scores when merging two arrays with no duplicate timestamps", () => {
    const scores: Score[] = [sampleScores[0]];
    const newScores: Score[] = [sampleScores[1], sampleScores[2]];
    const mergedScores = mergeScores(scores, newScores);
    expect(mergedScores).toEqual([...scores, ...newScores]);
  });

  it("returns a new array with only unique scores based on the timestamp property when merging two arrays with duplicate timestamps", () => {
    const scores: Score[] = [sampleScores[0], sampleScores[1]];
    const newScores: Score[] = [sampleScores[1], sampleScores[2]];
    const mergedScores = mergeScores(scores, newScores);
    expect(mergedScores).toEqual(sampleScores);
  });
});

describe("saveRemoteScoresLocally", () => {
  const userId = "testid";
  const sampleRemoteScores = [
    { ...sampleScores[0], userId },
    sampleScores[1],
    { ...sampleScores[2], userId },
  ];
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
    jest
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("saves remote scores to localStorage if there are scores not saved locally", () => {
    saveRemoteScoresLocally(sampleRemoteScores, userId);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "scores",
      JSON.stringify(sampleRemoteScores.map((score) => ({ ...score, userId }))),
    );
  });

  it("does not save remote scores to localStorage if all scores are already saved locally", () => {
    const localScores = [...sampleRemoteScores];
    const remoteScores = [...localScores];
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue(JSON.stringify(localScores));
    saveRemoteScoresLocally(remoteScores, userId);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("merges new remote scores with existing local scores when saving", () => {
    const localScores = [sampleRemoteScores[0], sampleRemoteScores[1]];
    const remoteScores = sampleRemoteScores;
    const expectedRemoteScoresToSave = [...localScores, sampleRemoteScores[2]];
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue(JSON.stringify(localScores));
    saveRemoteScoresLocally(remoteScores, userId);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "scores",
      JSON.stringify(expectedRemoteScoresToSave),
    );
  });
});

describe("dateFromTimestamp", () => {
  it("returns a string in the format 'YYYY-MM-DD'", () => {
    const result = dateFromTimestamp("2024-04-27T02:07:07.924Z");
    expect(result).toBe("2024-04-27");
  });
});

describe("sortScoresByTimestamp", () => {
  it("sorts scores by timestamp in descending order", () => {
    const scores: Score[] = [sampleScores[2], sampleScores[0], sampleScores[1]];
    const sortedScores = sortScoresByTimestamp(scores);
    expect(sortedScores).toEqual(sampleScores);
  });

  it("returns an empty array if given an empty array", () => {
    const sortedScores = sortScoresByTimestamp([]);
    expect(sortedScores).toEqual([]);
  });

  it("returns the input array if given an array with one element", () => {
    const scores: Score[] = [sampleScores[0]];
    const sortedScores = sortScoresByTimestamp(scores);
    expect(sortedScores).toEqual(scores);
  });
});

describe("sortScoresByPoints", () => {
  it("sorts scores by points in descending order", () => {
    const sortedScores = sortScoresByPoints([...sampleScores]);
    expect(sortedScores).toStrictEqual([
      sampleScores[1],
      sampleScores[0],
      sampleScores[2],
    ]);
  });

  it("returns an empty array if given an empty array", () => {
    const sortedScores = sortScoresByPoints([]);
    expect(sortedScores).toEqual([]);
  });

  it("returns the input array if given an array with one element", () => {
    const scores: Score[] = [sampleScores[0]];
    const sortedScores = sortScoresByPoints(scores);
    expect(sortedScores).toEqual(scores);
  });
});

describe("findHighScore", () => {
  it("returns 0 when the scores array is empty", () => {
    const scores: Score[] = [];
    expect(findHighScore(scores)).toBe(0);
  });

  it("returns the points value when the scores array has one score", () => {
    const scores: Score[] = [sampleScores[0]];
    expect(findHighScore(scores)).toBe(sampleScores[0].points);
  });

  it("returns the highest score value when the scores array has multiple scores", () => {
    expect(findHighScore(sampleScores)).toBe(18);
  });
});

describe("findHighScore", () => {
  it("returns correct suffix for numbers ending in 1st, 2nd, 3rd, etc.", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(2)).toBe("2nd");
    expect(ordinal(3)).toBe("3rd");
    expect(ordinal(4)).toBe("4th");
    expect(ordinal(10)).toBe("10th");
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(12)).toBe("12th");
    expect(ordinal(13)).toBe("13th");
  });

  it("returns correct suffix for numbers ending in 11th, 12th, 13th, etc.", () => {
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(12)).toBe("12th");
    expect(ordinal(13)).toBe("13th");
    expect(ordinal(21)).toBe("21st");
    expect(ordinal(22)).toBe("22nd");
    expect(ordinal(23)).toBe("23rd");
  });

  it("returns correct suffix for numbers ending in 21st, 22nd, 23rd, etc.", () => {
    expect(ordinal(21)).toBe("21st");
    expect(ordinal(22)).toBe("22nd");
    expect(ordinal(23)).toBe("23rd");
    expect(ordinal(31)).toBe("31st");
    expect(ordinal(32)).toBe("32nd");
    expect(ordinal(33)).toBe("33rd");
  });
});

describe("capitalize", () => {
  it("returns an empty string when given an empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("capitalizes the first letter of a string with all lowercase letters", () => {
    expect(capitalize("foo bar")).toBe("Foo bar");
  });

  it("does not affect strings beginning with a capitalized character", () => {
    expect(capitalize("Hello world")).toBe("Hello world");
  });
});
