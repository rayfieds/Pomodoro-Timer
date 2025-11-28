// backend/src/routes/sessions.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/start', async (req, res) => {
  try {
    const { type, taskId } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO pomodoro_sessions (user_id, type, started_at, task_id, duration)
       VALUES ($1, $2, NOW(), $3, 0)
       RETURNING *`,
      [userId, type, taskId || null]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { duration } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE pomodoro_sessions
       SET completed = true, completed_at = NOW(), duration = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [duration, sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const result = await pool.query(
      `SELECT * FROM pomodoro_sessions
       WHERE user_id = $1
       ORDER BY started_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;