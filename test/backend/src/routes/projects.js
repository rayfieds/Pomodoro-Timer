// backend/src/routes/projects.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all projects for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      `SELECT * FROM projects 
       WHERE user_id = $1 AND archived = false 
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO projects (user_id, name, color) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, name, color || '#ba4949']
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE projects 
       SET name = $1, color = $2 
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [name, color, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Archive project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE projects 
       SET archived = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Archive project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;