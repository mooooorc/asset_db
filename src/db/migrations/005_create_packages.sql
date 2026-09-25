CREATE TABLE packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE package_instances (
    package_id TEXT NOT NULL
        REFERENCES packages(id)
        ON DELETE CASCADE,
    asset_id TEXT NOT NULL,
    instance_id TEXT NOT NULL,
    PRIMARY KEY (package_id, asset_id, instance_id)
);

CREATE INDEX package_instances_asset_instance_idx
    ON package_instances (asset_id, instance_id);