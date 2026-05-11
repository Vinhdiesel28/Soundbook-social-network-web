import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const reportsApi = {
  createReport: async ({ targetType, targetId, reason, description }) => 
    unwrap(await request('/reports', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ targetType, targetId, reason, description }),
    })),
};
