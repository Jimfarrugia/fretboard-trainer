import {
  parseLocalStorageScores,
  setLocalStorageScores,
  sortScoresByTimestamp,
  sortScoresByPoints,
  findHighScore,
  mergeScores,
  saveRemoteScoresLocally,
  filterScores,
} from "@/lib/utils";
import { Score, ScoreFilters } from "@/lib/types";

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

const moreSampleScores = [
  {
    points: 35,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-20T23:47:32.572Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: false,
  },
  {
    points: 19,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-20T20:46:14.158Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: false,
  },
  {
    points: 17,
    instrument: "bass",
    tuning: "E Standard",
    timestamp: "2024-04-20T20:54:07.200Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: false,
  },
  {
    points: 15,
    instrument: "bass",
    tuning: "E Standard",
    timestamp: "2024-04-20T20:59:47.344Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: false,
  },
  {
    points: 12,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-25T16:40:36.087Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: true,
  },
  {
    points: 11,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-27T01:01:26.118Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: true,
  },
  {
    points: 9,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-25T16:53:16.822Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: true,
  },
  {
    points: 8,
    instrument: "guitar",
    tuning: "E Standard",
    timestamp: "2024-04-30T08:15:18.650Z",
    userId: "clvm40hfw0000ikj5yheb7apb",
    hardMode: true,
  },
  {
    points: 6,
    instrument: "ukulele",
    tuning: "Standard",
    timestamp: "2024-04-26T00:32:49.143Z",
    userId: "cluzioys40008cojjbygw0jfc",
    hardMode: true,
  },
];

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

describe("filterScores", () => {
  it("should return all scores when no filters are active", () => {
    const filters: ScoreFilters = {};
    expect(filterScores(moreSampleScores, filters)).toEqual(moreSampleScores);
  });

  it("should filter scores by hardMode when no instrument filters are active", () => {
    const filters: ScoreFilters = { hardMode: true };
    const expectedScores = moreSampleScores.filter((score) => score.hardMode);
    expect(filterScores(moreSampleScores, filters)).toHaveLength(5);
    expect(filterScores(moreSampleScores, filters)).toEqual(expectedScores);
  });

  it("should filter scores by instrument and hardMode", () => {
    const filters: ScoreFilters = {
      guitar: true,
      bass: false,
      hardMode: true,
    };
    const expectedScores = moreSampleScores.filter(
      (score) => score.instrument === "guitar" && score.hardMode,
    );
    expect(filterScores(moreSampleScores, filters)).toHaveLength(4);
    expect(filterScores(moreSampleScores, filters)).toEqual(expectedScores);
  });
});
