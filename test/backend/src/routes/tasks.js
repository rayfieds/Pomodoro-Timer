import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const { user_id, text } = req.body;
    
    const result = await pool.query(
      `INSERT INTO tasks (user_id, text)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, text]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Toggle task completion
router.patch('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;
    
    const result = await pool.query(
      `UPDATE tasks 
       SET completed = $1
       WHERE id = $2
       RETURNING *`,
      [completed, taskId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;