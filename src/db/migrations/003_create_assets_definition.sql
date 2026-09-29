CREATE TABLE asset_definitions (
    asset_id TEXT NOT NULL REFERENCES assets(id),
    definition_id TEXT NOT NULL REFERENCES definitions(id),
    required BOOLEAN NOT NULL DEFAULT FALSE,
    identifiable BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (asset_id, definition_id)
);