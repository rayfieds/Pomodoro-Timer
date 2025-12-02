import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get analytics for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const totalResult = await pool.query(
      `SELECT COUNT(*) as total_pomodoros 
       FROM pomodoro_sessions 
       WHERE user_id = $1 AND type = 'pomodoro' AND completed = true`,
      [userId]
    );
    
    const byDayResult = await pool.query(
      `SELECT DATE(completed_at) as date, COUNT(*) as count
       FROM pomodoro_sessions
       WHERE user_id = $1 AND completed = true AND completed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(completed_at)
       ORDER BY date DESC`,
      [userId]
    );
    
    res.json({
      totalPomodoros: parseInt(totalResult.rows[0].total_pomodoros),
      byDay: byDayResult.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;