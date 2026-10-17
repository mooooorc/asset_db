CREATE TABLE healthy_issues (
    instance_id TEXT NOT NULL,
    issue_code INTEGER NOT NULL,
    field TEXT NOT NULL,
    PRIMARY KEY (instance_id, issue_code, field)
);