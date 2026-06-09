// src/ui/render.js
// UI rendering helpers, deliberately seeded with several low/medium issues:
//   - >=3 console.log/warn/error calls -> LOW "console logs"
//   - .innerHTML = x                   -> MEDIUM "innerHTML"
//   - setTimeout(fn, 0)                -> LOW "setTimeout(fn, 0)"
//   - new Array(n).fill(...)           -> LOW "new Array(n).fill"

export function renderTaskList(container, tasks) {
  console.log("rendering tasks:", tasks.length);

  // XSS-prone: assigns untrusted task titles directly into innerHTML.
  const html = tasks.map((t) => `<li>${t.title}</li>`).join("");
  container.innerHTML = "<ul>" + html + "</ul>";

  console.warn("render complete");
}

export function renderEmptyState(container) {
  // new Array(n).fill -> low-severity pattern the agent flags.
  const placeholders = new Array(5).fill("<li class='skeleton'></li>");
  container.innerHTML = placeholders.join("");
  console.error("rendered empty state (this should be info, not error)");
}

export function scheduleRepaint(callback) {
  // setTimeout(fn, 0) -> low-severity pattern; suggests requestAnimationFrame.
  setTimeout(callback, 0);
}

export function logDebug(message) {
  console.log("[debug]", message);
}
