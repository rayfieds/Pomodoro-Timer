// src/pages/Analytics.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BarChart } from '../components/BarChart';
import { PieChart } from '../components/PieChart';
import { ProjectManager } from '../components/ProjectManager';
import {
  getSummary,
  getFocusHours,
  getProjectsTime,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../utils/api';
import type { Settings } from '../types';

type Period = 'week' | 'month' | 'year';

interface Summary {
  hours_focused: string;
  days_accessed: number;
  total_sessions: number;
}

interface FocusData {
  label: string;
  hours: number;
}

interface ProjectData {
  project_name: string;
  project_color: string;
  hours: number;
  session_count: number;
}

interface Project {
  id: number;
  name: string;
  color: string;
}

interface AnalyticsProps {
  settings: Settings;
}

export function Analytics({ settings }: AnalyticsProps) {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('week');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [focusData, setFocusData] = useState<FocusData[]>([]);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [period, user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [summaryData, focusHours, projectsTime, projectsList] = await Promise.all([
        getSummary(),
        getFocusHours(period),
        getProjectsTime(period),
        getProjects(),
      ]);

      setSummary(summaryData);
      setFocusData(focusHours);
      setProjectData(projectsTime);
      setProjects(projectsList);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name: string, color: string) => {
    await createProject(name, color);
    await loadData();
  };

  const handleUpdateProject = async (id: number, name: string, color: string) => {
    await updateProject(id, name, color);
    await loadData();
  };

  const handleDeleteProject = async (id: number) => {
    await deleteProject(id);
    await loadData();
  };

  // Not logged in
  if (!user) {
    return (
      <div className="page analytics-page">
        <div className="analytics-container">
          <h2>📊 Analytics</h2>
          <div className="auth-prompt">
            <div className="auth-prompt-icon">📈</div>
            <h3>Track Your Productivity</h3>
            <p>
              <Link to="/login" className="auth-link">
                Login or create an account
              </Link>{" "}
              to unlock detailed analytics including:
            </p>
            <ul className="features-list">
              <li>📊 Visual charts of your focus time</li>
              <li>📅 Weekly, monthly, and yearly reports</li>
              <li>🎯 Track time across different projects</li>
              <li>📈 See your productivity trends</li>
              <li>✅ Completed pomodoros count</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !summary) {
    return (
      <div className="page analytics-page">
        <div className="analytics-container">
          <h2>📊 Analytics</h2>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your stats...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get theme colors for gradients
  const themeColors = [
    settings.pomodoroColor,
    settings.shortBreakColor,
    settings.longBreakColor,
  ];

  return (
    <div className="page analytics-page">
      <div className="analytics-container">
        <h2>📊 Analytics</h2>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div 
            className="summary-card"
            style={{
              background: `linear-gradient(135deg, ${settings.pomodoroColor} 0%, ${adjustColor(settings.pomodoroColor, -20)} 100%)`
            }}
          >
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <div className="card-value">{summary?.hours_focused || '0.0'}h</div>
              <div className="card-label">Total Focus Time</div>
            </div>
          </div>

          <div 
            className="summary-card"
            style={{
              background: `linear-gradient(135deg, ${settings.shortBreakColor} 0%, ${adjustColor(settings.shortBreakColor, -20)} 100%)`
            }}
          >
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <div className="card-value">{summary?.total_sessions || 0}</div>
              <div className="card-label">Pomodoros Completed</div>
            </div>
          </div>

          <div 
            className="summary-card"
            style={{
              background: `linear-gradient(135deg, ${settings.longBreakColor} 0%, ${adjustColor(settings.longBreakColor, -20)} 100%)`
            }}
          >
            <div className="card-icon">📅</div>
            <div className="card-content">
              <div className="card-value">{summary?.days_accessed || 0}</div>
              <div className="card-label">Days Active</div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="period-selector">
          <button
            className={period === 'week' ? 'active' : ''}
            onClick={() => setPeriod('week')}
            style={period === 'week' ? { color: settings.pomodoroColor } : {}}
          >
            Week
          </button>
          <button
            className={period === 'month' ? 'active' : ''}
            onClick={() => setPeriod('month')}
            style={period === 'month' ? { color: settings.pomodoroColor } : {}}
          >
            Month
          </button>
          <button
            className={period === 'year' ? 'active' : ''}
            onClick={() => setPeriod('year')}
            style={period === 'year' ? { color: settings.pomodoroColor } : {}}
          >
            Year
          </button>
        </div>

        {/* Focus Hours Chart */}
        <div className="chart-section">
          <h3>Focus Hours</h3>
          {focusData.length > 0 ? (
            <BarChart
              data={focusData.map((d, index) => ({
                label: d.label.trim(),
                value: parseFloat(d.hours.toString()),
                color: themeColors[index % themeColors.length],
              }))}
              height={250}
            />
          ) : (
            <p className="no-data">No focus time recorded for this period yet. Start a pomodoro to see your stats!</p>
          )}
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <div className="chart-section">
            <h3>Time by Project</h3>
            {projectData.length > 0 ? (
              <PieChart
                data={projectData.map((p) => ({
                  label: p.project_name,
                  value: parseFloat(p.hours.toString()),
                  color: p.project_color,
                }))}
                size={250}
              />
            ) : (
              <p className="no-data">
                No project data for this period. Create projects below and assign them to your pomodoros!
              </p>
            )}
          </div>

          <ProjectManager
            projects={projects}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            themeColor={settings.pomodoroColor}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
