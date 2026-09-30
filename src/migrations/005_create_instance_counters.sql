CREATE TABLE instance_counters (
    asset_id TEXT PRIMARY KEY REFERENCES assets(id),
    next_index INTEGER NOT NULL DEFAULT 1
);