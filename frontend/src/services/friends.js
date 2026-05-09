import { request } from './auth';

const unwrap = (payload) => payload?.data ?? payload;

export const friendsApi = {
  getFriendHub: async () => unwrap(await request('/friends', { method: 'GET', auth: true })),

  sendRequest: async (receiverId) => unwrap(await request(`/friends/requests/${encodeURIComponent(receiverId)}`, {
    method: 'POST',
    auth: true,
  })),

  acceptRequest: async (requestId) => unwrap(await request(`/friends/requests/${encodeURIComponent(requestId)}/accept`, {
    method: 'POST',
    auth: true,
  })),

  declineRequest: async (requestId) => unwrap(await request(`/friends/requests/${encodeURIComponent(requestId)}/decline`, {
    method: 'POST',
    auth: true,
  })),

  cancelRequest: async (requestId) => unwrap(await request(`/friends/requests/${encodeURIComponent(requestId)}`, {
    method: 'DELETE',
    auth: true,
  })),

  removeFriend: async (friendId) => unwrap(await request(`/friends/${encodeURIComponent(friendId)}`, {
    method: 'DELETE',
    auth: true,
  })),

  startChat: async (friendId) => unwrap(await request(`/friends/${encodeURIComponent(friendId)}/chat`, {
    method: 'POST',
    auth: true,
  })),
};
