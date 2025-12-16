// src/utils/api.ts
const API_URL = 'http://localhost:3001/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Projects
export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function createProject(name: string, color: string) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, color }),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

export async function updateProject(id: number, name: string, color: string) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, color }),
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
}

export async function deleteProject(id: number) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete project');
  return response.json();
}

// Session tracking
export async function startSession(type: 'pomodoro' | 'shortBreak' | 'longBreak', taskId?: string) {
  const response = await fetch(`${API_URL}/sessions/start`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ type, taskId }),
  });
  
  if (!response.ok) throw new Error('Failed to start session');
  return response.json();
}

export async function completeSession(sessionId: string, duration: number) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/complete`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ duration }),
  });
  
  if (!response.ok) throw new Error('Failed to complete session');
  return response.json();
}

// Analytics
export async function getSummary() {
  const response = await fetch(`${API_URL}/analytics/summary`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch summary');
  return response.json();
}

export async function getFocusHours(period: 'week' | 'month' | 'year') {
  const response = await fetch(`${API_URL}/analytics/focus-hours?period=${period}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch focus hours');
  return response.json();
}

export async function getProjectsTime(period: 'week' | 'month' | 'year') {
  const response = await fetch(`${API_URL}/analytics/projects-time?period=${period}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch projects time');
  return response.json();
}

export async function getDetailedHistory(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/analytics/detail?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}