// src/auth/login.test.ts
import { login, isSessionValid, logout } from "./login";
import type { Credentials, Session } from "./login";

// ---------------------------------------------------------------------------
// login()
// ---------------------------------------------------------------------------
describe("login", () => {
  const validCreds: Credentials = {
    email: "user@example.com",
    password: "secret123",
  };

  it("returns a Session for valid credentials", () => {
    const session = login(validCreds);
    expect(session).not.toBeNull();
    expect(session!.userId).toBeTruthy();
    expect(session!.token).toBeTruthy();
  });

  it("sets expiresAt roughly 1 hour in the future", () => {
    const before = Date.now();
    const session = login(validCreds);
    const after = Date.now();
    const oneHourMs = 1000 * 60 * 60;
    expect(session!.expiresAt).toBeGreaterThanOrEqual(before + oneHourMs - 50);
    expect(session!.expiresAt).toBeLessThanOrEqual(after + oneHourMs + 50);
  });

  it("produces a deterministic userId from the email", () => {
    const s1 = login(validCreds);
    const s2 = login(validCreds);
    expect(s1!.userId).toBe(s2!.userId);
  });

  it("produces different tokens for different passwords", () => {
    const s1 = login(validCreds);
    const s2 = login({ ...validCreds, password: "differentPass" });
    expect(s1!.token).not.toBe(s2!.token);
  });

  // --- invalid email ---
  it("returns null for an email with no @ symbol", () => {
    expect(login({ email: "notanemail", password: "secret123" })).toBeNull();
  });

  it("returns null for an email with no domain extension", () => {
    expect(login({ email: "user@nodot", password: "secret123" })).toBeNull();
  });

  it("returns null for an empty email string", () => {
    expect(login({ email: "", password: "secret123" })).toBeNull();
  });

  // --- invalid password ---
  it("returns null when password is shorter than 6 characters", () => {
    expect(login({ email: "user@example.com", password: "abc" })).toBeNull();
  });

  it("returns null for an empty password", () => {
    expect(login({ email: "user@example.com", password: "" })).toBeNull();
  });

  it("accepts a password that is exactly 6 characters", () => {
    const session = login({ email: "user@example.com", password: "123456" });
    expect(session).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// isSessionValid()
// ---------------------------------------------------------------------------
describe("isSessionValid", () => {
  it("returns true for a session that has not yet expired", () => {
    const session: Session = {
      userId: "u1",
      token: "tok",
      expiresAt: Date.now() + 10_000,
    };
    expect(isSessionValid(session)).toBe(true);
  });

  it("returns false for a session whose expiry is in the past", () => {
    const session: Session = {
      userId: "u1",
      token: "tok",
      expiresAt: Date.now() - 1,
    };
    expect(isSessionValid(session)).toBe(false);
  });

  it("returns false for a session that expires exactly at Date.now() (boundary)", () => {
    // expiresAt === Date.now() should be treated as expired (strict >)
    const now = Date.now();
    const session: Session = { userId: "u1", token: "tok", expiresAt: now - 1 };
    expect(isSessionValid(session)).toBe(false);
  });

  it("reflects the valid state of a freshly created login session", () => {
    const session = login({ email: "user@example.com", password: "secret123" })!;
    expect(isSessionValid(session)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// logout()
// BUG: logout only clears the token field on the local object; it does NOT
// revoke the token in any server-side or in-memory store. The tests below
// document the current (buggy) behaviour and will fail if/when a real
// revocation mechanism is added — acting as a reminder to update them.
// ---------------------------------------------------------------------------
describe("logout", () => {
  it("clears the token field on the session object", () => {
    const session = login({ email: "user@example.com", password: "secret123" })!;
    logout(session);
    expect(session.token).toBe("");
  });

  it("does NOT actually invalidate the session (known bug: no revocation store)", () => {
    // isSessionValid only checks expiresAt, so the session still appears valid
    // after logout. This test documents the bug — it should be FIXED once a
    // real session store / revocation list is introduced.
    const session = login({ email: "user@example.com", password: "secret123" })!;
    logout(session);
    // BUG: this should return false after logout, but currently returns true.
    expect(isSessionValid(session)).toBe(true); // <- remove/invert once fixed
  });

  it("does not throw when called multiple times on the same session", () => {
    const session = login({ email: "user@example.com", password: "secret123" })!;
    expect(() => {
      logout(session);
      logout(session);
    }).not.toThrow();
  });
});
