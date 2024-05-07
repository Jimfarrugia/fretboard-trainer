import {
  dateFromTimestamp,
  capitalize,
  ordinal,
  playNoteAudio,
} from "@/lib/utils";

describe("dateFromTimestamp", () => {
  it("returns a string in the format 'YYYY-MM-DD'", () => {
    const result = dateFromTimestamp("2024-04-27T02:07:07.924Z");
    expect(result).toBe("2024-04-27");
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

describe("ordinal", () => {
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

describe("playNoteAudio", () => {
  class MockAudioContext {
    createGain() {
      return {
        connect: jest.fn(),
        disconnect: jest.fn(),
        gain: { value: 0 },
      };
    }
    createMediaElementSource() {
      return {
        connect: jest.fn(),
        mock: {
          results: [
            {
              value: {
                pause: jest.fn(),
                remove: jest.fn(),
              },
            },
          ],
        },
      };
    }
  }

  class MockAudio {
    volume = 1;
    play() {}
    pause() {}
    remove() {}
  }

  beforeEach(() => {
    (window as any).AudioContext = jest.fn(() => new MockAudioContext());
    (window as any).Audio = jest.fn(() => new MockAudio());
  });

  afterEach(() => {
    (window as any).AudioContext.mockRestore();
    (window as any).Audio.mockRestore();
  });

  it("plays a natural note from the guitar soundfont", () => {
    expect(() => playNoteAudio("guitar", "A4")).not.toThrow();
  });

  it("plays a flat note from the guitar soundfont", () => {
    expect(() => playNoteAudio("guitar", "Ab4")).not.toThrow();
  });

  it("plays a natural note from the bass soundfont", () => {
    expect(() => playNoteAudio("bass", "A4")).not.toThrow();
  });

  it("plays a flat note from the bass soundfont", () => {
    expect(() => playNoteAudio("bass", "Ab4")).not.toThrow();
  });

  it("uses the guitar soundfont if the instrument argument is 'ukulele'", () => {
    expect(() => playNoteAudio("ukulele", "Ab4")).not.toThrow();
  });

  it("pauses and removes the audio after 2 seconds", async () => {
    jest.useFakeTimers();

    const removeSpy = jest.fn();
    const pauseSpy = jest.fn();

    class MockAudio {
      volume = 1;
      play() {}
      pause = pauseSpy;
      remove = removeSpy;
    }

    jest
      .spyOn(window, "Audio")
      .mockImplementation(() => new (MockAudio as any)());

    playNoteAudio("guitar", "A4");

    jest.advanceTimersByTime(2000);
    await Promise.resolve();

    expect(pauseSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});
