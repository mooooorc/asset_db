CREATE TABLE discussion_comments (

    id UUID PRIMARY KEY,

    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,

    author_id UUID NOT NULL REFERENCES users(id),

    content TEXT NOT NULL

);