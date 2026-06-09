// src/payments/webhook.ts
// Payment webhook handler. This file HAS a sibling test (webhook.test.ts),
// so the test-gap detection should treat it as COVERED and it should count
// toward the test-coverage percentage.

export interface WebhookEvent {
  id: string;
  type: "payment.succeeded" | "payment.failed" | "refund.created";
  amount: number;
  currency: string;
}

export interface WebhookResult {
  ok: boolean;
  message: string;
}

export function handleWebhook(event: WebhookEvent): WebhookResult {
  if (!event.id) {
    return { ok: false, message: "missing event id" };
  }

  switch (event.type) {
    case "payment.succeeded":
      return { ok: true, message: `charged ${formatAmount(event)}` };
    case "payment.failed":
      return { ok: true, message: "payment failed, user notified" };
    case "refund.created":
      return { ok: true, message: `refunded ${formatAmount(event)}` };
    default:
      return { ok: false, message: "unknown event type" };
  }
}

export function formatAmount(event: WebhookEvent): string {
  return `${(event.amount / 100).toFixed(2)} ${event.currency.toUpperCase()}`;
}
