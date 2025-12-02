const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Tasks
  getTasks: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${userId}`);
    return response.json();
  },

  createTask: async (userId: string, text: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, text }),
    });
    return response.json();
  },

  toggleTask: async (taskId: string, completed: boolean) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    return response.json();
  },

  deleteTask: async (taskId: string) => {
    await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  // Sessions
  getSessions: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${userId}`);
    return response.json();
  },

  createSession: async (userId: string, type: string, duration: number) => {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        type,
        duration,
        started_at: new Date().toISOString(),
      }),
    });
    return response.json();
  },

  completeSession: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/complete`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // Analytics
  getAnalytics: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/analytics/${userId}`);
    return response.json();
  },
};