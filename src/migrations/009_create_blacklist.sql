CREATE TABLE package_blacklist (
    package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES assets(id),
    instance_id UUID NOT NULL,
    PRIMARY KEY (package_id, asset_id, instance_id)
);