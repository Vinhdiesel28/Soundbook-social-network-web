import { GOOGLE_API_KEY } from '../config/env';

/**
 * Search for books using Google Books API
 * @param {string} query The search term
 * @param {number} maxResults Maximum number of results to return
 * @param {boolean} useKey Whether to use the API Key or not
 * @returns {Promise<Array>} List of book items
 */
export async function searchGoogleBooks(query, maxResults = 10, useKey = true) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}${GOOGLE_API_KEY && useKey ? `&key=${GOOGLE_API_KEY}` : ''}`;
    const response = await fetch(url);
    
    if (response.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    }

    if (!response.ok) {
      throw new Error('Google Books API request failed');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching Google Books:', error);
    if (error.message === 'QUOTA_EXCEEDED') {
      throw error; 
    }
    return [];
  }
}

/**
 * Normalizes a Google Books API item for internal use
 * @param {Object} item Raw item from Google Books API
 * @returns {Object} Normalized book object
 */
export function normalizeBook(item) {
  if (!item) return null;
  
  const info = item.volumeInfo || {};
  return {
    id: item.id,
    title: info.title || 'Unknown Title',
    authors: info.authors || ['Unknown Author'],
    description: info.description || '',
    thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null,
    previewLink: info.previewLink,
    pageCount: info.pageCount,
    publishedDate: info.publishedDate,
    rating: info.averageRating,
  };
}
