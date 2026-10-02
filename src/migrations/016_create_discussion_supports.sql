CREATE TABLE discussion_supports (
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consumer_id TEXT NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,

    PRIMARY KEY (discussion_id, user_id, consumer_id)
);