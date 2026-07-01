// src/utils/helpers.test.ts
import { slugify, clamp, safeParseJSON, formatDate, unique } from "./helpers";

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------
describe("slugify", () => {
  it("lowercases and trims the input", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("replaces non-alphanumeric runs with a single hyphen", () => {
    expect(slugify("Foo & Bar!")).toBe("foo-bar");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  it("handles an already-valid slug unchanged", () => {
    expect(slugify("my-slug-123")).toBe("my-slug-123");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// clamp
// ---------------------------------------------------------------------------
describe("clamp", () => {
  it("returns the value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when value is below range", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns max when value is above range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("handles negative ranges", () => {
    expect(clamp(-3, -10, -1)).toBe(-3);
    expect(clamp(0, -10, -1)).toBe(-1);
    expect(clamp(-20, -10, -1)).toBe(-10);
  });
});

// ---------------------------------------------------------------------------
// safeParseJSON
// ---------------------------------------------------------------------------
describe("safeParseJSON", () => {
  it("parses valid JSON and returns the typed result", () => {
    const result = safeParseJSON<{ name: string }>("{\"name\":\"Alice\"}", { name: "default" });
    expect(result).toEqual({ name: "Alice" });
  });

  it("returns the fallback value when JSON is invalid", () => {
    const fallback = { name: "default" };
    const result = safeParseJSON<{ name: string }>("not-json", fallback);
    // NOTE: the current implementation has an empty catch block — the error
    // is silently swallowed. This test documents the expected fallback behaviour
    // and will continue to pass, but consider logging the error in the catch.
    expect(result).toBe(fallback);
  });

  it("returns the fallback value for an empty string", () => {
    expect(safeParseJSON("", 42)).toBe(42);
  });

  it("parses a JSON array", () => {
    expect(safeParseJSON<number[]>("[1,2,3]", [])).toEqual([1, 2, 3]);
  });

  it("parses a JSON primitive", () => {
    expect(safeParseJSON<number>("99", 0)).toBe(99);
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe("formatDate", () => {
  it("formats a known timestamp to YYYY-MM-DD", () => {
    // 2024-03-15T00:00:00.000Z expressed as UTC ms — use a local-noon
    // timestamp to avoid date shifting across time zones.
    const ts = new Date("2024-03-15T12:00:00").getTime();
    expect(formatDate(ts)).toMatch(/^2024-03-15$/);
  });

  it("zero-pads month and day", () => {
    const ts = new Date("2024-01-05T12:00:00").getTime();
    expect(formatDate(ts)).toMatch(/^2024-01-05$/);
  });

  it("returns a string in YYYY-MM-DD format", () => {
    const ts = Date.now();
    expect(formatDate(ts)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ---------------------------------------------------------------------------
// unique
// ---------------------------------------------------------------------------
describe("unique", () => {
  it("removes duplicate primitives", () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it("removes duplicate strings", () => {
    expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for empty input", () => {
    expect(unique([])).toEqual([]);
  });

  it("preserves insertion order", () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  it("returns the same array contents when all items are already unique", () => {
    expect(unique(["x", "y", "z"])).toEqual(["x", "y", "z"]);
  });
});
