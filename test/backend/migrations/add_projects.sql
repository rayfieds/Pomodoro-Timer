-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#ba4949',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archived BOOLEAN DEFAULT FALSE
);

-- Add project_id to pomodoro_sessions
ALTER TABLE pomodoro_sessions 
ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_project ON pomodoro_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_completed ON pomodoro_sessions(user_id, completed_at);s