// src/auth/login.ts
// Authentication entry point for TaskFlow.
// >15 lines and has NO sibling test (no login.test.ts / login.spec.ts).
// Because the path contains "auth", the test-gap detection should rank this HIGH.

export interface Credentials {
  email: string;
  password: string;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: number;
}

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

function hashPassword(password: string): string {
  // NOTE: deliberately naive — this is a test fixture, not real crypto.
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function validateEmail(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

export function login(creds: Credentials): Session | null {
  if (!validateEmail(creds.email)) {
    return null;
  }
  if (!creds.password || creds.password.length < 6) {
    return null;
  }

  const userId = hashPassword(creds.email);
  const token = hashPassword(creds.email + ":" + creds.password);

  return {
    userId,
    token,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

export function isSessionValid(session: Session): boolean {
  return session.expiresAt > Date.now();
}

export function logout(session: Session): void {
  // BUG: logout does not actually invalidate the token anywhere — the agent
  // can suggest implementing a real session store / revocation list.
  session.token = "";
}
