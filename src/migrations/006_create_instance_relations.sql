CREATE TABLE instance_relations (
    definition_id TEXT NOT NULL REFERENCES definitions(id),

    asset_a_id TEXT NOT NULL REFERENCES assets(id),
    instance_a_id UUID NOT NULL,

    asset_b_id TEXT NOT NULL REFERENCES assets(id),
    instance_b_id UUID NOT NULL,

    PRIMARY KEY (
        definition_id,
        asset_a_id,
        instance_a_id,
        asset_b_id,
        instance_b_id
    )
);