CREATE TABLE discussions (
    id UUID PRIMARY KEY,
    package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    index BIGINT NOT NULL,
    title TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    UNIQUE (package_id, index)
);

CREATE TABLE discussion_counters (
    package_id TEXT PRIMARY KEY REFERENCES packages(id) ON DELETE CASCADE,
    next_index BIGINT NOT NULL DEFAULT 1
);