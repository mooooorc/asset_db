CREATE TABLE instance_counters (
    asset_id TEXT PRIMARY KEY REFERENCES assets(id),
    next_index BIGINT NOT NULL DEFAULT 1
);