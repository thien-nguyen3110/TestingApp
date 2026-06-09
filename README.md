# TaskFlow

TaskFlow is a lightweight task-management web app where users sign in, create projects, and process payment webhooks for paid plans. It is intentionally seeded with realistic code-quality problems — missing tests, a hardcoded secret, an oversized module, unsafe DOM and `eval` usage, swallowed errors, and lingering TODOs — so that a code-analysis agent can detect, report, and help fix each one.

## Why this repo exists

This repository is a **deterministic test fixture** for the DevFlow analysis agent. Every file below is crafted to trip exactly one (or more) of the agent's detection rules so the full pipeline — file scan, problem detection, alignment with open issues, and auto-created issues — can be exercised end to end.

## Layout

```
README.md                     one real paragraph -> becomes the project summary
package.json                  project manifest
src/
  auth/login.ts               >15 lines, NO sibling test  -> HIGH test-gap (auth path)
  utils/helpers.ts            >15 lines, NO sibling test  -> MEDIUM test-gap + empty catch
  payments/webhook.ts         has a sibling test          -> COVERED
  payments/webhook.test.ts    the sibling test
  config/secrets.ts           hardcoded sk-/ghp_/glpat-/AKIA secrets -> HIGH secret
  legacy/giant.ts             400+ lines                  -> MEDIUM complexity / large file
  ui/render.js                3x console.log + .innerHTML + setTimeout(fn,0) + new Array().fill
  danger/run.js               eval(userInput)             -> HIGH eval
  todos.ts                    5+ TODO/FIXME               -> low
```

## Detection coverage matrix

| Rule | File | Expected severity |
|------|------|-------------------|
| Test gap (auth) | `src/auth/login.ts` | high |
| Test gap | `src/utils/helpers.ts` | medium |
| Covered (sibling test) | `src/payments/webhook.ts` | — |
| Hardcoded secret | `src/config/secrets.ts` | high |
| Large file | `src/legacy/giant.ts` | medium |
| Console logs | `src/ui/render.js` | low |
| innerHTML | `src/ui/render.js` | medium |
| setTimeout(fn, 0) | `src/ui/render.js` | low |
| new Array(n).fill | `src/ui/render.js` | low |
| Empty catch | `src/utils/helpers.ts` | medium |
| eval() | `src/danger/run.js` | high |
| TODO/FIXME | `src/todos.ts` | low |

## Suggested issues for the alignment verifier

Create these issues on the project **before** running the agent to exercise all three alignment states:

- `Add tests for login.ts` → **aligned** (matches a real detected problem)
- `Fix bug in src/removed/ghost.ts` (file does not exist) → **orphaned**
- Leave `helpers.ts` test-gap untracked → **hidden**, auto-created if the token has `api` scope
