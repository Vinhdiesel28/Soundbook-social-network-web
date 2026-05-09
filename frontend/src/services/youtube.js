// YouTube Data API v3 service
// Get your API key from: https://console.cloud.google.com/apis/credentials

import { request } from './auth';

// Search for videos on YouTube via backend proxy
export async function searchYouTubeVideos(query, maxResults = 10) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await request(`/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`, {
      auth: true
    });
    
    return Array.isArray(response) ? response : [];
  } catch {
    return [];
  }
}

// Get video details (duration, etc) via backend proxy
export async function getYouTubeVideoDetails(videoId) {
  try {
    const response = await request(`/youtube/videos/${videoId}`, {
      auth: true
    });
    return response;
  } catch {
    return null;
  }
}

// Parse ISO 8601 duration to seconds
function parseDuration(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

// Format seconds to MM:SS
export function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
