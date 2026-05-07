import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { searchYouTubeVideos } from '../../services/youtube';

const SongSearch = ({ onSelectSong, isSearching = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const videos = await searchYouTubeVideos(query, 10);
      setResults(videos);
      setShowResults(true);
      setLoading(false);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelectSong = (video) => {
    onSelectSong(video);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      {/* Search input */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 0 && setShowResults(true)}
            placeholder="Tìm bài hát..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
          {loading && <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />}
        </div>
      </div>

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto custom-scrollbar">
          {results.map((video) => (
            <div
              key={video.videoId}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <button
                onClick={() => handleSelectSong(video)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-12 h-9 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.title}</p>
                  <p className="text-xs text-gray-500 truncate">{video.channelTitle}</p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectSong(video);
                }}
                className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors flex-shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {showResults && !loading && results.length === 0 && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-gray-500">
          Không tìm thấy bài hát nào
        </div>
      )}
    </div>
  );
};

export default SongSearch;
