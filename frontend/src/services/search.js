import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const searchApi = {
  search: async (query, limit = 5) => {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return unwrap(await request(`/search?${params.toString()}`, {
      method: 'GET',
      auth: true,
    }));
  },
};
