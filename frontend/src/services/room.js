import { request } from './auth';

const API_BASE = '/rooms';

// Create room
export async function createRoom(hostUserId, name, topic, isPublic = true) {
  return request(`${API_BASE}`, {
    method: 'POST',
    body: JSON.stringify({ hostUserId, name, topic, isPublic }),
    auth: true,
  });
}

// Get active rooms
export async function getActiveRooms(limit = 20) {
  return request(`${API_BASE}/active?limit=${limit}`, { auth: true });
}

// Get room details
export async function getRoomDetail(roomId) {
  return request(`${API_BASE}/${roomId}`, { auth: true });
}

// Join room
export async function joinRoom(roomId, userId) {
  return request(`${API_BASE}/${roomId}/join`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
    auth: true,
  });
}

// Leave room
export async function leaveRoom(roomId, userId) {
  return request(`${API_BASE}/${roomId}/leave`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
    auth: true,
  });
}

// Get playback state
export async function getRoomState(roomId) {
  return request(`${API_BASE}/${roomId}/state`, { auth: true });
}

// Get room queue
export async function getRoomQueue(roomId) {
  return request(`${API_BASE}/${roomId}/queue`, { auth: true });
}

// Add to queue
export async function addToQueue(roomId, trackId, trackPayloadJson, addedByUserId) {
  return request(`${API_BASE}/${roomId}/queue`, {
    method: 'POST',
    body: JSON.stringify({ trackId, trackPayloadJson, addedByUserId }),
    auth: true,
  });
}

// Vote queue item
export async function voteQueueItem(roomId, queueItemId) {
  return request(`${API_BASE}/${roomId}/queue/${queueItemId}/vote`, {
    method: 'POST',
    auth: true,
  });
}
