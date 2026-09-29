CREATE TABLE package_conditions (
    package_id TEXT NOT NULL
        REFERENCES packages(id)
        ON DELETE CASCADE,
    definition_id TEXT NOT NULL,
    operator TEXT NOT NULL,
    value JSONB,
    PRIMARY KEY (package_id, definition_id, operator)
);