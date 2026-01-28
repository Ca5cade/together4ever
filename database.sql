-- Enable UUID extension if you want to use auto-generated UUIDs (Optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    id TEXT PRIMARY KEY,                     -- ID matching the app's format (e.g., 'u_170...')
    username TEXT UNIQUE NOT NULL,           -- Unique login identifier
    password TEXT NOT NULL,                  -- Store hashed passwords here in production
    name TEXT NOT NULL,                      -- Display name
    avatar TEXT,                             -- URL to avatar image
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. POSTS TABLE
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,                          -- Optional image attachment
    created_at BIGINT NOT NULL               -- Storing timestamp as Epoch ms to match frontend
);

-- 3. POST LIKES (Many-to-Many relationship)
CREATE TABLE post_likes (
    post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)           -- Prevent duplicate likes
);

-- 4. FRIENDSHIPS
-- Stores bidirectional relationships. For a friendship, insert (A, B).
-- Depending on logic, you might also insert (B, A) or query for both directions.
CREATE TABLE friends (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    friend_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- 5. MESSAGES TABLE
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reply_to_post_id TEXT REFERENCES posts(id) ON DELETE SET NULL, -- Context if replying to status
    is_read BOOLEAN DEFAULT FALSE,
    created_at BIGINT NOT NULL               -- Storing timestamp as Epoch ms
);

-- INDEXES for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_receiver_unread ON messages(receiver_id) WHERE is_read = FALSE;
