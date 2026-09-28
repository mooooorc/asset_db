CREATE TABLE types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    base_type TEXT NOT NULL,
    default_value JSONB
);

INSERT INTO types (
    id,
    name,
    base_type
)
VALUES
    ('string', 'String', 'string'),
    ('number', 'Number', 'number'),
    ('boolean', 'Boolean', 'boolean');