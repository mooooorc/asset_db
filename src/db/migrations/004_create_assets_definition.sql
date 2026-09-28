CREATE TABLE asset_definitions (
    asset_id TEXT NOT NULL REFERENCES assets(id),
    definition_id TEXT NOT NULL REFERENCES definitions(id),
    PRIMARY KEY (asset_id, definition_id)
);