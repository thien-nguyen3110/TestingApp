// src/utils/helpers.ts
// General helpers for TaskFlow.
// >15 lines and has NO sibling test -> MEDIUM test-gap.
// Also contains an empty catch block -> MEDIUM "empty catch" detection.

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function safeParseJSON<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    // Empty catch: the error is silently swallowed.
    // The agent should flag this and suggest logging or rethrowing.
  }
  return fallback;
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
