CREATE TABLE consumer_packages (
    consumer_id TEXT NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    PRIMARY KEY (consumer_id, package_id)
);