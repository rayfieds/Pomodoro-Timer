// backend/src/routes/analytics.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.userId;

    const hoursResult = await pool.query(
      `SELECT COALESCE(SUM(duration), 0) / 3600.0 as total_hours
       FROM pomodoro_sessions
       WHERE user_id = $1 AND type = 'pomodoro' AND completed = true`,
      [userId]
    );

    const daysResult = await pool.query(
      `SELECT COUNT(DISTINCT DATE(completed_at)) as days_accessed
       FROM pomodoro_sessions
       WHERE user_id = $1 AND completed = true`,
      [userId]
    );

    const streakResult = await pool.query(
      `SELECT 0 as current_streak`,
      []
    );

    res.json({
      hours_focused: parseFloat(hoursResult.rows[0].total_hours).toFixed(1),
      days_accessed: parseInt(daysResult.rows[0].days_accessed),
      day_streak: parseInt(streakResult.rows[0]?.current_streak || 0)
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/focus-hours', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'week' } = req.query;

    let dateFilter;
    
    switch (period) {
      case 'week':
        dateFilter = "completed_at >= DATE_TRUNC('week', CURRENT_DATE)";
        break;
      case 'month':
        dateFilter = "completed_at >= DATE_TRUNC('month', CURRENT_DATE)";
        break;
      case 'year':
        dateFilter = "completed_at >= DATE_TRUNC('year', CURRENT_DATE)";
        break;
      default:
        dateFilter = "completed_at >= DATE_TRUNC('week', CURRENT_DATE)";
    }

    const result = await pool.query(
      `SELECT 
        TO_CHAR(completed_at, 'Day') as label,
        DATE(completed_at) as date,
        SUM(duration) / 3600.0 as hours
       FROM pomodoro_sessions
       WHERE user_id = $1 
         AND type = 'pomodoro' 
         AND completed = true
         AND ${dateFilter}
       GROUP BY DATE(completed_at), TO_CHAR(completed_at, 'Day')
       ORDER BY DATE(completed_at)`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Focus hours error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/detail', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        DATE(completed_at) as date,
        t.text as task_name,
        SUM(CASE WHEN ps.type = 'pomodoro' THEN ps.duration ELSE 0 END) / 60 as minutes
       FROM pomodoro_sessions ps
       LEFT JOIN tasks t ON ps.task_id = t.id
       WHERE ps.user_id = $1 AND ps.completed = true
       GROUP BY DATE(completed_at), t.text
       ORDER BY DATE(completed_at) DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT DATE(completed_at)) as total
       FROM pomodoro_sessions
       WHERE user_id = $1 AND completed = true`,
      [userId]
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Detail error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;