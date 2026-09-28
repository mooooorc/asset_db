CREATE TABLE definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type_id TEXT REFERENCES types(id)
);