// src/payments/webhook.test.ts
// Sibling test for webhook.ts. Its presence is what makes webhook.ts "covered".

import { test } from "node:test";
import assert from "node:assert/strict";
import { handleWebhook, formatAmount, WebhookEvent } from "./webhook.js";

function ev(overrides: Partial<WebhookEvent> = {}): WebhookEvent {
  return {
    id: "evt_1",
    type: "payment.succeeded",
    amount: 1999,
    currency: "usd",
    ...overrides,
  };
}

test("rejects events without an id", () => {
  const res = handleWebhook(ev({ id: "" }));
  assert.equal(res.ok, false);
});

test("handles a successful payment", () => {
  const res = handleWebhook(ev());
  assert.equal(res.ok, true);
  assert.match(res.message, /charged/);
});

test("formats amounts in major units", () => {
  assert.equal(formatAmount(ev({ amount: 1999, currency: "usd" })), "19.99 USD");
});
