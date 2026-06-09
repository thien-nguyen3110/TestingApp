// src/todos.ts
// Aggregated backlog notes. Contains 5+ TODO/FIXME/HACK markers ->
// LOW "TODO/FIXME" detection.

export const ROADMAP = "TaskFlow backlog";

// TODO: add pagination to the task list endpoint.
export function listTasks() {
  // FIXME: this returns a hardcoded list instead of querying the database.
  return [{ id: 1, title: "Sample task" }];
}

// TODO: implement soft-delete instead of hard delete.
export function deleteTask(id: number): boolean {
  // HACK: pretend it always succeeds for now.
  return id > 0;
}

// TODO: wire up real auth middleware here.
// FIXME: rate limiting is completely missing on write endpoints.
export function archiveTask(id: number): boolean {
  return id > 0;
}
