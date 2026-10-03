CREATE TABLE user_consumers (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consumer_id TEXT NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,
    membership TEXT NOT NULL,
    PRIMARY KEY (user_id, consumer_id)
);