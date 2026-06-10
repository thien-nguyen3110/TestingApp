// src/config/secrets.ts
// All secrets are read exclusively from environment variables.
// Copy .env.example to .env, fill in real values, and ensure .env is in .gitignore.
// NEVER commit real credentials to source control.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Check .env.example for the full list of required variables.`
    );
  }
  return value;
}

export const config = {
  openaiKey: requireEnv("OPENAI_API_KEY"),
  githubToken: requireEnv("GITHUB_TOKEN"),
  gitlabToken: requireEnv("GITLAB_TOKEN"),
  googleApiKey: requireEnv("GOOGLE_API_KEY"),
  awsAccessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
};

export const credentials = {
  password: requireEnv("APP_PASSWORD"),
  api_key: requireEnv("API_KEY"),
  secret: requireEnv("APP_SECRET"),
};
