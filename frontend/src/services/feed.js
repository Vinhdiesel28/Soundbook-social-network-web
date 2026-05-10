import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const feedApi = {
  getFeed: async ({ tab = 'discover', limit = 20 } = {}) => unwrap(await request(
    `/feed?tab=${encodeURIComponent(tab)}&limit=${encodeURIComponent(limit)}`,
    { method: 'GET', auth: true },
  )),
};
