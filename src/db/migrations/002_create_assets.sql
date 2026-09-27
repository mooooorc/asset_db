CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    expose_as_package BOOLEAN NOT NULL DEFAULT FALSE
);