import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const interactionsApi = {
  addComment: async (postId, content, parentId = null) => 
    unwrap(await request(`/interactions/posts/${encodeURIComponent(postId)}/comments`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ content, parentId }),
    })),

  reactToPost: async (postId, reactionType) => 
    unwrap(await request(`/interactions/posts/${encodeURIComponent(postId)}/reactions`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ reactionType }),
    })),

  deleteComment: async (commentId) => 
    unwrap(await request(`/interactions/comments/${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
      auth: true,
    })),

  reactToComment: async (commentId, reactionType) => 
    unwrap(await request(`/interactions/comments/${encodeURIComponent(commentId)}/reactions`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ reactionType }),
    })),
};
