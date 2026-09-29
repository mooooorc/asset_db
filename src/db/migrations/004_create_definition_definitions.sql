CREATE TABLE definition_definitions (
    definition_id TEXT NOT NULL
        REFERENCES definitions(id)
        ON DELETE CASCADE,

    child_definition_id TEXT NOT NULL
        REFERENCES definitions(id)
        ON DELETE CASCADE,

    PRIMARY KEY (definition_id, child_definition_id)
);