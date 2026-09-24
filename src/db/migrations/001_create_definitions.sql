CREATE TABLE definitions (
    id TEXT PRIMARY KEY,
    value_type TEXT,
    parent_id TEXT REFERENCES definitions(id)
);