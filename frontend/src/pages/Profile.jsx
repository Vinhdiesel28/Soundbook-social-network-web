import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Settings, Edit3, Share2, Grid3X3, List } from 'lucide-react';

// Mock Data
const PROFILE_DATA = {
  name: 'Dat Nguyen',
  username: '@datnguyen',
  bio: '#Indie #CodeAndChill #SciFiNerd',
  avatar: 'bg-orange-500',
  themeColor: 'from-orange-500/20 to-purple-900/40',
  matchScore: null, // null means owner viewing
  pinnedSong: { title: 'Space Song', artist: 'Beach House', cover: 'bg-gradient-to-br from-indigo-500 to-purple-600' }
};

const SHELVES = [
  {
    id: 'fame',
    title: 'Hall of Fame',
    items: [
      { id: 1, type: 'music', title: 'Currents', author: 'Tame Impala', style: 'bg-purple-500 rounded-md shrink-0 aspect-square w-24 sm:w-32', rating: 5 },
      { id: 2, type: 'book', title: 'Dune', author: 'Frank Herbert', style: 'bg-orange-600 rounded-sm shrink-0 w-16 sm:w-20 h-28 sm:h-36', rating: 5 },
      { id: 3, type: 'music', title: 'Blonde', author: 'Frank Ocean', style: 'bg-green-500 rounded-md shrink-0 aspect-square w-24 sm:w-32', rating: 5 },
    ]
  },
  {
    id: 'consuming',
    title: 'Currently Consuming',
    items: [
      { id: 4, type: 'music', title: 'Brat', author: 'Charli XCX', style: 'bg-lime-400 rounded-md shrink-0 aspect-square w-24 sm:w-32', progress: 100 },
      { id: 5, type: 'book', title: 'Project Hail Mary', author: 'Andy Weir', style: 'bg-blue-600 rounded-sm shrink-0 w-16 sm:w-20 h-28 sm:h-36', progress: 65 },
    ]
  },
  {
    id: 'wishlist',
    title: 'Wishlist',
    items: [
      { id: 6, type: 'book', title: 'The Three-Body Problem', author: 'Cixin Liu', style: 'bg-gray-800 rounded-sm shrink-0 w-16 sm:w-20 h-28 sm:h-36 border border-gray-600 opacity-80' },
      { id: 7, type: 'music', title: 'Wall of Eyes', author: 'The Smile', style: 'bg-teal-700 rounded-md shrink-0 aspect-square w-24 sm:w-32 border border-gray-600 opacity-80' },
    ]
  }
];

const Profile = ({ isGuest = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('shelf');

  return (
    <div className="flex flex-col gap-6 -mt-6"> {/* Negative margin to offset layout padding for full width header header */}
      
      {/* Dynamic Header */}
      <div className={`w-full h-64 sm:h-80 relative overflow-hidden bg-gradient-to-b ${PROFILE_DATA.themeColor}`}>
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        
        {/* Actions inside header */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors">
            <Share2 size={20} />
          </button>
          {!isGuest && (
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors">
              <Settings size={20} />
            </button>
          )}
        </div>

        {/* Profile Info & Pinned Mini-player */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-end justify-between gap-6 z-10 w-auto">
          
          {/* Avatar & Info */}
          <div className="flex items-end gap-x-6 gap-y-4 flex-wrap w-full sm:w-auto">
            <div className="relative group">
              {/* Soundwave animation ring */}
              <div className="absolute -inset-2 rounded-full border-4 border-white/20 animate-pulse" />
              <div className="absolute -inset-4 rounded-full border-4 border-white/10 animate-ping" style={{ animationDuration: '3s' }} />
              
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-surface-color shadow-2xl relative z-10 ${PROFILE_DATA.avatar}`} />
              {!isGuest && (
                <button className="absolute bottom-2 right-2 p-2 bg-surface-color text-text-color rounded-full shadow-lg z-20 hover:scale-110 transition-transform">
                  <Edit3 size={16} />
                </button>
              )}
            </div>
            
            <div className="text-white drop-shadow-md pb-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{PROFILE_DATA.name}</h1>
              <p className="text-sm font-medium text-white/80 mt-1">{PROFILE_DATA.username}</p>
              <div className="flex gap-2 mt-2">
                {PROFILE_DATA.bio.split(' ').map((tag, i) => (
                  <span key={i} className="text-xs font-semibold px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Match Score (If Guest) */}
          {isGuest && (
            <div className="hidden sm:flex flex-col items-center bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">
              <span className="text-xs text-white/80 font-semibold uppercase tracking-wider mb-1">Match Score</span>
              <div className="text-3xl font-bold text-primary-400">85%</div>
            </div>
          )}

          {/* Pinned Mini-player */}
          <div className="w-full sm:w-64 bg-black/40 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl flex items-center gap-3">
            <div className={`relative w-14 h-14 rounded-full shadow-lg overflow-hidden flex-shrink-0 ${PROFILE_DATA.pinnedSong.cover} ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <div className="absolute inset-0 border-4 border-black/50 rounded-full" />
              <div className="absolute inset-1/3 bg-black rounded-full border border-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{PROFILE_DATA.pinnedSong.title}</p>
              <p className="text-white/70 text-xs truncate">{PROFILE_DATA.pinnedSong.artist}</p>
              <div className="w-full h-1 bg-white/20 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-white w-1/4 rounded-full" />
              </div>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
          </div>

        </div>
      </div>

      {/* Main Body (Kệ sách/đĩa) */}
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-4">
        
        {/* Controls */}
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold font-serif tracking-tight">Căn phòng tâm hồn</h2>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('shelf')}
              className={`p-1.5 rounded-md ${viewMode === 'shelf' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-text-muted transition-colors'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-text-muted transition-colors'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Shelves */}
        <div className="space-y-16">
          {SHELVES.map((shelf) => (
            <div key={shelf.id} className="relative">
              <h3 className="text-lg font-bold text-text-muted mb-6 px-2 flex items-center gap-3">
                {shelf.title}
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              </h3>

              {/* Shelf Items Container */}
              <div className="flex gap-x-6 sm:gap-x-10 gap-y-12 flex-wrap items-end px-4 sm:px-8 min-h-[160px]">
                {shelf.items.map((item) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -10, scale: 1.05, rotateY: item.type === 'book' ? -10 : 0, rotateX: item.type === 'music' ? 10 : 0 }}
                    className="relative cursor-pointer group perspective-1000"
                  >
                    {/* The Item visually */}
                    <div className={`shadow-xl transition-shadow duration-300 group-hover:shadow-2xl ${item.style} flex items-center justify-center text-white/50 text-xs font-bold text-center p-2 break-words`}>
                      {item.title}
                    </div>

                    {/* Reflection / Shelf shadow (fake 3D base) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-black/20 dark:bg-black/50 blur-sm rounded-full" />

                    {/* Progress Bar (Currently Consuming) */}
                    {item.progress !== undefined && (
                      <div className="absolute -bottom-5 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                    )}
                    
                    {/* Tooltip Overlay */}
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                      <div className="bg-surface-color text-text-color rounded-xl shadow-2xl p-3 text-sm w-48 border border-gray-200 dark:border-gray-700 transform scale-95 group-hover:scale-100 transition-transform">
                        <p className="font-bold truncate">{item.title}</p>
                        <p className="text-text-muted text-xs truncate mb-1">{item.author}</p>
                        {item.rating && (
                          <div className="flex text-yellow-500 text-[10px]">
                            {'★'.repeat(item.rating)}
                          </div>
                        )}
                        <p className="text-xs mt-2 line-clamp-2 text-gray-500 italic">"Ghi chú review của chủ nhà nằm ở đây, tối đa 2 dòng..."</p>
                      </div>
                      {/* Arrow toolip */}
                      <div className="w-3 h-3 bg-surface-color border-b border-r border-gray-200 dark:border-gray-700 absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45" />
                    </div>

                  </motion.div>
                ))}
              </div>

              {/* The Wooden Shelf Graphic */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-sm shadow-md flex -z-10 items-end overflow-hidden">
                <div className="w-full h-1 bg-black/10" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;
