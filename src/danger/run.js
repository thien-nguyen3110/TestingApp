// src/danger/run.js
// Uses eval() on user-controlled input -> HIGH "eval()" detection.
// This is the canonical "dangerous code" the agent should flag and offer to fix
// (e.g. replace with a safe expression parser or an explicit allow-list).

export function runUserExpression(userInput) {
  // DANGER: arbitrary code execution from untrusted input.
  return eval(userInput);
}

export function computeFormula(formula, vars) {
  const prelude = Object.entries(vars)
    .map(([k, v]) => `var ${k} = ${JSON.stringify(v)};`)
    .join("\n");
  // DANGER: still eval, just dressed up.
  return eval(prelude + "\n" + formula);
}
