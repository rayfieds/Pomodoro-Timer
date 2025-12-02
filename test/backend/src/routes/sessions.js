import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all sessions for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM pomodoro_sessions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Create a new session
router.post('/', async (req, res) => {
  try {
    const { user_id, type, duration, task_id, started_at } = req.body;
    
    const result = await pool.query(
      `INSERT INTO pomodoro_sessions (user_id, type, duration, task_id, started_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, type, duration, task_id, started_at]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Complete a session
router.patch('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const completed_at = new Date().toISOString();
    
    const result = await pool.query(
      `UPDATE pomodoro_sessions 
       SET completed = true, completed_at = $1
       WHERE id = $2
       RETURNING *`,
      [completed_at, sessionId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

export default router;