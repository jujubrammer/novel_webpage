-- db/schema.sql
-- ---------------------------------------------------------------------------
-- Canonical database schema for the "If You Had Known" archive.
-- This is the source of truth for the tables. The /api/migrate route runs
-- these same statements. They use "IF NOT EXISTS", so re-running is safe.
--
-- Notes for a beginner:
--   * Each entry gets a UUID `id` (a random unique identifier) and a `slug`
--     (a URL-friendly name like "elara-windwright") used for its public page.
--   * `age`, `threat_level`, etc. are TEXT, not numbers — fantasy values like
--     "Unknown" or "Ancient" should be allowed.
--   * `created_at` / `updated_at` track when a row was made/changed.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS characters (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  name          text NOT NULL,
  image_url     text,
  age           text,
  species       text,
  appearance    text,
  personality   text,
  abilities     text,
  relationships text,
  biography     text,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monsters (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text UNIQUE NOT NULL,
  name           text NOT NULL,
  image_url      text,
  classification text,
  habitat        text,
  appearance     text,
  behavior       text,
  threat_level   text,
  weaknesses     text,
  lore           text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  image_url   text,
  type        text,
  region      text,
  description text,
  history     text,
  connections text,  -- important characters / creatures connected to this place
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
