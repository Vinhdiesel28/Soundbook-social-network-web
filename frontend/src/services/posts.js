import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const postsApi = {
  create: async (payload) => unwrap(await request('/posts', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })),

  update: async (postId, payload) => unwrap(await request(`/posts/${encodeURIComponent(postId)}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  })),

  remove: async (postId) => unwrap(await request(`/posts/${encodeURIComponent(postId)}`, {
    method: 'DELETE',
    auth: true,
  })),

  toggleComments: async (postId, enabled) => unwrap(await request(`/posts/${encodeURIComponent(postId)}/comments-enabled?enabled=${encodeURIComponent(enabled)}`, {
    method: 'PATCH',
    auth: true,
  })),

  react: async (postId, reactionType) => unwrap(await request(`/posts/${encodeURIComponent(postId)}/reaction`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ reactionType }),
  })),

  comment: async (postId, content) => unwrap(await request(`/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ content }),
  })),

  deleteComment: async (commentId) => unwrap(await request(`/posts/comments/${encodeURIComponent(commentId)}`, {
    method: 'DELETE',
    auth: true,
  })),

  share: async (postId, payload = {}) => unwrap(await request(`/posts/${encodeURIComponent(postId)}/share`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })),
};
