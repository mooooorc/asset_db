CREATE TABLE definition_definitions (
    definition_id TEXT NOT NULL REFERENCES definitions(id),
    child_definition_id TEXT NOT NULL REFERENCES definitions(id),
    PRIMARY KEY (definition_id, child_definition_id)
);