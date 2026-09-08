-- Webhook delivery log for idempotent GitHub event handling.
-- action_taken: ping | accepted | ignored | duplicate

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  delivery_id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  repo_full_name TEXT,
  action_taken TEXT NOT NULL DEFAULT 'ignored',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
