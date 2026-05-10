import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const aiApi = {
    getPostInsight: async (postId) => unwrap(await request(`/ai/posts/${postId}/insight`, {
        method: 'GET',
        auth: true,
    })),

    chatWithPost: async (postId, message) => unwrap(await request(`/ai/posts/${postId}/chat`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ message }),
    }))
};
