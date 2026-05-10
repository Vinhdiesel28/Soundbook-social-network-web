/**
 * Google Books API service
 * Documentation: https://developers.google.com/books/docs/v1/using
 */

/**
 * Search for books using Google Books API
 * @param {string} query The search term
 * @param {number} maxResults Maximum number of results to return
 * @returns {Promise<Array>} List of book items
 */
export async function searchGoogleBooks(query, maxResults = 10) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );
    
    if (!response.ok) {
      throw new Error('Google Books API request failed');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching Google Books:', error);
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
