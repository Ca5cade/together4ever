import express from 'express';
import pg from 'pg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Database Connection
// In production, strictly use process.env.DATABASE_URL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_UmH9n8zeMZxK@ep-small-bar-ag52fm4s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// --- API Endpoints ---

// Get all users (and their friends)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*, 
      COALESCE(
        (SELECT json_agg(f.friend_id) FROM friends f WHERE f.user_id = u.id), 
        '[]'::json
      ) as friends 
      FROM users u
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(`
      SELECT u.*, 
      COALESCE(
        (SELECT json_agg(f.friend_id) FROM friends f WHERE f.user_id = u.id), 
        '[]'::json
      ) as friends 
      FROM users u 
      WHERE lower(username) = lower($1) AND password = $2
    `, [username, password]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  const { id, name, username, password, bio, avatar } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (id, name, username, password, bio, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, name, username, password, bio, avatar]
    );
    res.json({ id, name, username, bio, avatar, friends: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get Posts
app.get('/api/posts', async (req, res) => {
  try {
    // Determine likes as an array of user_ids
    const result = await pool.query(`
      SELECT p.id, p.user_id as "userId", p.content, p.image_url as "imageUrl", p.created_at as "timestamp",
      COALESCE(
        (SELECT json_agg(l.user_id) FROM post_likes l WHERE l.post_id = p.id),
        '[]'::json
      ) as likes
      FROM posts p
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch posts failed' });
  }
});

// Create Post
app.post('/api/posts', async (req, res) => {
  const { id, userId, content, imageUrl, timestamp } = req.body;
  try {
    await pool.query(
      'INSERT INTO posts (id, user_id, content, image_url, created_at) VALUES ($1, $2, $3, $4, $5)',
      [id, userId, content, imageUrl, timestamp]
    );
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create post failed' });
  }
});

// Toggle Like
app.post('/api/posts/:id/like', async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.id;
  try {
    const check = await pool.query('SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    if (check.rows.length > 0) {
      await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    } else {
      await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
    }
    // Return updated likes
    const likesRes = await pool.query('SELECT json_agg(user_id) as likes FROM post_likes WHERE post_id = $1', [postId]);
    res.json(likesRes.rows[0].likes || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Like failed' });
  }
});

// Get Messages
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, sender_id as "senderId", receiver_id as "receiverId", content, 
      reply_to_post_id as "replyToPostId", is_read as "read", created_at as "timestamp"
      FROM messages
      ORDER BY created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch messages failed' });
  }
});

// Send Message
app.post('/api/messages', async (req, res) => {
  const { id, senderId, receiverId, content, replyToPostId, timestamp, read } = req.body;
  try {
    await pool.query(
      'INSERT INTO messages (id, sender_id, receiver_id, content, reply_to_post_id, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, senderId, receiverId, content, replyToPostId, read, timestamp]
    );
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Send message failed' });
  }
});

// Add Friend
app.post('/api/friends', async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    await pool.query('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)', [userId, friendId]);
    // Also add reverse for bidirectional friendship logic if desired, or handle in query.
    // For now, let's assume one direction add updates the UI enough.
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Add friend failed' });
  }
});

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
