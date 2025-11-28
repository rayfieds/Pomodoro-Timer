// src/utils/api.ts
const API_URL = 'http://localhost:3001/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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

export async function getDetailedHistory(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/analytics/detail?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}