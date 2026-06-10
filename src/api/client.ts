import type { User, ForumPost, AuthResponse } from '../types';

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('fin_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login(email: string, password: string): Promise<AuthResponse> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  resetPassword(email: string): Promise<{ message: string }> {
    return request('/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // User
  getMe(): Promise<User> {
    return request('/users/me');
  },

  updateProfile(updates: Partial<User>): Promise<User> {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Posts
  getPosts(): Promise<ForumPost[]> {
    return request('/posts');
  },

  createPost(title: string, category: string, body: string): Promise<ForumPost> {
    return request('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, category, body }),
    });
  },

  toggleLike(postId: string): Promise<ForumPost> {
    return request(`/posts/${postId}/like`, { method: 'POST' });
  },

  addComment(postId: string, text: string): Promise<ForumPost> {
    return request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('fin_token', token);
  } else {
    localStorage.removeItem('fin_token');
  }
}
