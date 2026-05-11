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

  comment: async (postId, content, parentId = null) => unwrap(await request(`/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ content, parentId }),
  })),

  deleteComment: async (commentId) => unwrap(await request(`/posts/comments/${encodeURIComponent(commentId)}`, {
    method: 'DELETE',
    auth: true,
  })),

  reactComment: async (commentId, reactionType) => unwrap(await request(`/posts/comments/${encodeURIComponent(commentId)}/reaction`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ reactionType }),
  })),

  share: async (postId, payload = {}) => unwrap(await request(`/posts/${encodeURIComponent(postId)}/share`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })),

  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return unwrap(await request('/posts/media', {
      method: 'POST',
      auth: true,
      body: formData,
      // Note: request helper should NOT set Content-Type to application/json for FormData
    }));
  },
  
  getReactions: async (targetId, targetType = 'POST', page = 0, size = 20) => 
    unwrap(await request(`/posts/${encodeURIComponent(targetId)}/reactions?targetType=${targetType}&page=${page}&size=${size}`, {
      method: 'GET',
      auth: true,
    })),
    
  getComments: async (postId, page = 0, size = 50) => 
    unwrap(await request(`/posts/${encodeURIComponent(postId)}/comments?page=${page}&size=${size}`, {
      method: 'GET',
      auth: true,
    })),
    
  getCommentReplies: async (postId, commentId) =>
    unwrap(await request(`/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/replies`, {
      method: 'GET',
      auth: true,
    })),
};
