import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const tasteApi = {
  getMyTaste: async () => unwrap(await request('/taste/me', { method: 'GET', auth: true })),

  saveMyTaste: async (payload) => unwrap(await request('/taste/me', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })),

  getMatches: async (limit = 20) => unwrap(await request(`/taste/matches?limit=${encodeURIComponent(limit)}`, {
    method: 'GET',
    auth: true,
  })),

  getMatchWithUser: async (userId) => unwrap(await request(`/taste/match/${encodeURIComponent(userId)}`, {
    method: 'GET',
    auth: true,
  })),

  getDiscoverSeed: async () => unwrap(await request('/taste/discover', {
    method: 'GET',
    auth: true,
  })),
};
