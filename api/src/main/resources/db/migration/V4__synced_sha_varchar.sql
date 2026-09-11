-- CHAR(40) blank-pads short SHAs, breaking the idempotency equals against
-- real Postgres. Plain text column; SHAs are content hashes, not fixed width.
ALTER TABLE projects ALTER COLUMN synced_sha TYPE VARCHAR(40);
UPDATE projects SET synced_sha = TRIM(TRAILING ' ' FROM synced_sha)
  WHERE synced_sha LIKE '% ';
