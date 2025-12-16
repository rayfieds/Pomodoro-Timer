// src/components/ProjectManager.tsx
import { useState } from 'react';

interface Project {
  id: number;
  name: string;
  color: string;
}

interface ProjectManagerProps {
  projects: Project[];
  onCreateProject: (name: string, color: string) => Promise<void>;
  onUpdateProject: (id: number, name: string, color: string) => Promise<void>;
  onDeleteProject: (id: number) => Promise<void>;
  themeColor?: string;
}

const PRESET_COLORS = [
  '#ba4949', '#38858a', '#397097', '#9b59b6',
  '#e67e22', '#27ae60', '#e74c3c', '#3498db',
];

export function ProjectManager({
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  themeColor = '#ba4949',
}: ProjectManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(themeColor);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await onCreateProject(newName.trim(), newColor);
    setNewName('');
    setNewColor(themeColor);
    setIsAdding(false);
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    await onUpdateProject(id, editName.trim(), editColor);
    setEditingId(null);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditColor(project.color);
  };

  return (
    <div className="project-manager">
      <div className="project-manager-header">
        <h3>Projects</h3>
        <button
          className="add-project-btn"
          onClick={() => setIsAdding(!isAdding)}
          style={{ backgroundColor: themeColor }}
        >
          {isAdding ? '✕' : '+ New Project'}
        </button>
      </div>

      {isAdding && (
        <div className="project-form">
          <input
            type="text"
            placeholder="Project name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="color-picker">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={`color-option ${newColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewColor(color)}
              />
            ))}
          </div>
          <button 
            className="save-btn" 
            onClick={handleAdd}
            style={{ backgroundColor: themeColor }}
          >
            Save
          </button>
        </div>
      )}

      <div className="projects-list">
        {projects.length === 0 && !isAdding && (
          <p className="no-projects">No projects yet. Create one to get started!</p>
        )}
        {projects.map((project) => (
          <div key={project.id} className="project-item">
            {editingId === project.id ? (
              <div className="project-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(project.id)}
                  autoFocus
                />
                <div className="color-picker">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${editColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditColor(color)}
                    />
                  ))}
                </div>
                <div className="form-actions">
                  <button 
                    className="save-btn" 
                    onClick={() => handleUpdate(project.id)}
                    style={{ backgroundColor: themeColor }}
                  >
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="project-color"
                  style={{ backgroundColor: project.color }}
                />
                <span className="project-name">{project.name}</span>
                <div className="project-actions">
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(project)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (confirm(`Delete project "${project.name}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}