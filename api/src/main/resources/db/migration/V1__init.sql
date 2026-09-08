-- Phase 0 baseline: identity + raw manifest store for webhook-synced repos.
-- Phase 1 may add extracted columns via follow-up migrations (append-only).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_full_name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  manifest JSONB NOT NULL DEFAULT '{}'::jsonb,
  synced_sha CHAR(40),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
