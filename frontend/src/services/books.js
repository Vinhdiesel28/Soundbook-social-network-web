import { request } from './auth';

/**
 * Search for books using Google Books API via backend proxy
 * @param {string} query The search term
 * @param {number} maxResults Maximum number of results to return
 * @returns {Promise<Array>} List of book items
 */
export async function searchGoogleBooks(query, maxResults = 10) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await request(`/books/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`, {
      auth: true
    });
    
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error searching Google Books:', error);
    if (error?.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    }
    return [];
  }
}

export function normalizeBook(item) {
  if (!item) return null;
  
  // Flattened structure from backend
  return {
    id: item.id,
    title: item.title || 'Unknown Title',
    authors: item.authors || ['Unknown Author'],
    description: item.description || '',
    thumbnail: item.thumbnail,
    previewLink: item.previewLink,
    pageCount: item.pageCount,
    publishedDate: item.publishedDate,
    rating: item.rating,
  };
}
