import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const profileApi = {
  getProfile: async (userId = 'me') => unwrap(await request(`/profiles/${encodeURIComponent(userId)}`, {
    method: 'GET',
    auth: true,
  })),

  updateProfile: async (payload) => unwrap(await request('/profiles/me', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })),

  followProfile: async (userId) => unwrap(await request(`/profiles/${encodeURIComponent(userId)}/follow`, {
    method: 'POST',
    auth: true,
  })),

  unfollowProfile: async (userId) => unwrap(await request(`/profiles/${encodeURIComponent(userId)}/follow`, {
    method: 'DELETE',
    auth: true,
  })),

  addMusic: async (payload) => unwrap(await request('/profiles/me/music', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })),

  updateMusic: async (itemId, payload) => unwrap(await request(`/profiles/me/music/${encodeURIComponent(itemId)}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })),

  deleteMusic: async (itemId) => unwrap(await request(`/profiles/me/music/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    auth: true,
  })),

  addBook: async (payload) => unwrap(await request('/profiles/me/books', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })),

  updateBook: async (itemId, payload) => unwrap(await request(`/profiles/me/books/${encodeURIComponent(itemId)}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })),

  deleteBook: async (itemId) => unwrap(await request(`/profiles/me/books/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    auth: true,
  })),
};
