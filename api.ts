import { User, Post, Message } from './types';

const API_URL = '/api'; // Relative path for same-origin deployment

export const api = {
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },

  login: async (username: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  register: async (user: User): Promise<User> => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Register failed');
    return res.json();
  },

  getPosts: async (): Promise<Post[]> => {
    const res = await fetch(`${API_URL}/posts`);
    return res.json();
  },

  createPost: async (post: Post): Promise<Post> => {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    return res.json();
  },

  toggleLike: async (postId: string, userId: string): Promise<string[]> => {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  getMessages: async (): Promise<Message[]> => {
    const res = await fetch(`${API_URL}/messages`);
    return res.json();
  },

  sendMessage: async (message: Message): Promise<Message> => {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    return res.json();
  },

  addFriend: async (userId: string, friendId: string): Promise<void> => {
    await fetch(`${API_URL}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendId })
    });
  },

  updateUser: async (userId: string, payload: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  }
};
