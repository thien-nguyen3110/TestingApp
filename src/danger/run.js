// src/danger/run.js
// Safe arithmetic evaluation. The former eval()-based implementation was
// replaced with a restricted shunting-yard parser (no eval / no Function),
// so untrusted input can no longer execute arbitrary code.

const ALLOWED = /^[0-9+\-*/%.()\s]+$/;

export function runUserExpression(userInput) {
  if (typeof userInput !== "string" || !ALLOWED.test(userInput)) {
    throw new Error("Unsupported or unsafe expression");
  }
  return evaluateArithmetic(userInput);
}

export function computeFormula(formula, vars) {
  let expr = String(formula);
  for (const [k, v] of Object.entries(vars)) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`Variable "${k}" must be a finite number`);
    }
    expr = expr.replace(new RegExp(`\\b${k}\\b`, "g"), `(${v})`);
  }
  return runUserExpression(expr);
}

// Arithmetic-only evaluator (shunting-yard). No code execution.
function evaluateArithmetic(expr) {
  const tokens = expr.match(/\d+(?:\.\d+)?|[+\-*/%()]/g) || [];
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };
  const output = [];
  const ops = [];
  const apply = () => {
    const op = ops.pop();
    const b = output.pop();
    const a = output.pop();
    if (a === undefined || b === undefined) throw new Error("Malformed expression");
    if (op === "+") output.push(a + b);
    else if (op === "-") output.push(a - b);
    else if (op === "*") output.push(a * b);
    else if (op === "/") output.push(a / b);
    else if (op === "%") output.push(a % b);
    else throw new Error("Malformed expression");
  };
  for (const t of tokens) {
    if (/^\d/.test(t)) {
      output.push(parseFloat(t));
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") apply();
      if (ops.pop() !== "(") throw new Error("Mismatched parentheses");
    } else {
      while (ops.length && ops[ops.length - 1] !== "(" && prec[ops[ops.length - 1]] >= prec[t]) apply();
      ops.push(t);
    }
  }
  while (ops.length) {
    if (ops[ops.length - 1] === "(") throw new Error("Mismatched parentheses");
    apply();
  }
  if (output.length !== 1) throw new Error("Malformed expression");
  return output[0];
}
