CREATE TABLE definitions (
    id TEXT PRIMARY KEY,
    tag TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT
);