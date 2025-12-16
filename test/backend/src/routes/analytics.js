// backend/src/routes/analytics.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Summary stats
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

    const sessionsResult = await pool.query(
      `SELECT COUNT(*) as total_sessions
       FROM pomodoro_sessions
       WHERE user_id = $1 AND type = 'pomodoro' AND completed = true`,
      [userId]
    );

    res.json({
      hours_focused: parseFloat(hoursResult.rows[0].total_hours).toFixed(1),
      days_accessed: parseInt(daysResult.rows[0].days_accessed),
      total_sessions: parseInt(sessionsResult.rows[0].total_sessions)
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Focus hours by period
router.get('/focus-hours', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'week' } = req.query;

    let dateFilter, groupBy;
    
    switch (period) {
      case 'week':
        dateFilter = "completed_at >= DATE_TRUNC('week', CURRENT_DATE)";
        groupBy = "DATE(completed_at), TO_CHAR(completed_at, 'Day')";
        break;
      case 'month':
        dateFilter = "completed_at >= DATE_TRUNC('month', CURRENT_DATE)";
        groupBy = "DATE(completed_at)";
        break;
      case 'year':
        dateFilter = "completed_at >= DATE_TRUNC('year', CURRENT_DATE)";
        groupBy = "DATE_TRUNC('month', completed_at)";
        break;
      default:
        dateFilter = "completed_at >= DATE_TRUNC('week', CURRENT_DATE)";
        groupBy = "DATE(completed_at), TO_CHAR(completed_at, 'Day')";
    }

    const result = await pool.query(
      `SELECT 
        ${period === 'year' 
          ? "TO_CHAR(DATE_TRUNC('month', completed_at), 'Mon') as label, DATE_TRUNC('month', completed_at) as date" 
          : "TO_CHAR(completed_at, 'Day') as label, DATE(completed_at) as date"},
        SUM(duration) / 3600.0 as hours
       FROM pomodoro_sessions
       WHERE user_id = $1 
         AND type = 'pomodoro' 
         AND completed = true
         AND ${dateFilter}
       GROUP BY ${groupBy}
       ORDER BY date`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Focus hours error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Hours by project
router.get('/projects-time', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'week' } = req.query;

    let dateFilter;
    switch (period) {
      case 'week':
        dateFilter = "AND ps.completed_at >= DATE_TRUNC('week', CURRENT_DATE)";
        break;
      case 'month':
        dateFilter = "AND ps.completed_at >= DATE_TRUNC('month', CURRENT_DATE)";
        break;
      case 'year':
        dateFilter = "AND ps.completed_at >= DATE_TRUNC('year', CURRENT_DATE)";
        break;
      default:
        dateFilter = "";
    }

    const result = await pool.query(
      `SELECT 
        COALESCE(p.name, 'No Project') as project_name,
        COALESCE(p.color, '#888888') as project_color,
        p.id as project_id,
        SUM(ps.duration) / 3600.0 as hours,
        COUNT(ps.id) as session_count
       FROM pomodoro_sessions ps
       LEFT JOIN projects p ON ps.project_id = p.id
       WHERE ps.user_id = $1 
         AND ps.type = 'pomodoro' 
         AND ps.completed = true
         ${dateFilter}
       GROUP BY p.id, p.name, p.color
       ORDER BY hours DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Projects time error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;