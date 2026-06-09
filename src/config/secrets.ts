// src/config/secrets.ts
// Hardcoded secrets — should trigger the HIGH "hardcoded secret" detection.
// These are FAKE, non-functional placeholders that match the agent's regexes
// (OpenAI sk-, GitHub ghp_, GitLab glpat-, Google AIza, AWS AKIA, and
// the password/api_key/secret = "..." pattern). Never commit real secrets.

export const config = {
  // OpenAI-style key
  openaiKey: "sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",

  // GitHub-style token
  githubToken: "ghp_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",

  // GitLab-style token
  gitlabToken: "glpat-aaaaaaaaaaaaaaaaaaaa",

  // Google API key
  googleApiKey: "AIzaSyAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",

  // AWS access key id
  awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE",
};

// Generic assignment patterns
const password = "hunter2-do-not-use-in-prod";
const api_key = "key_live_abcdef0123456789";
const secret = "topsecretvalue";

export const credentials = { password, api_key, secret };
