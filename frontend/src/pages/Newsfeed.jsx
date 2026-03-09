import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, Plus, Flame, MoreHorizontal, Music, Disc3, Book } from 'lucide-react';

// Mock Data
const LIVE_RADAR = [
  { id: 1, name: 'Alex', avatar: 'bg-blue-500', isLive: true },
  { id: 2, name: 'Sarah', avatar: 'bg-pink-500', isLive: true },
  { id: 3, name: 'Mike', avatar: 'bg-green-500', isLive: false },
  { id: 4, name: 'Emma', avatar: 'bg-purple-500', isLive: false },
  { id: 5, name: 'Chill Room', avatar: 'bg-yellow-500', isRoom: true },
];

const FEED_POSTS = [
  {
    id: 1,
    user: { name: 'Dat Nguyen', avatar: 'bg-orange-500', time: '2h ago' },
    type: 'audio',
    content: 'Can\'t stop listening to this masterpiece 🎧',
    media: { title: 'Midnight City', artist: 'M83', cover: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    reactions: { flame: 124, sad: 2, comments: 18, shares: 5 }
  },
  {
    id: 2,
    user: { name: 'Sarah Connor', avatar: 'bg-pink-500', time: '5h ago' },
    type: 'book_review',
    content: 'Just finished "Dune". The world-building is absolutely incredible. Frank Herbert created a masterpiece that still holds up today. The political intrigue, the ecology of Arrakis, everything is just top-tier science fiction.',
    media: { title: 'Dune', author: 'Frank Herbert', cover: 'bg-gradient-to-br from-orange-400 to-red-600', rating: 5 },
    reactions: { flame: 89, sad: 0, comments: 32, shares: 12 }
  }
];

const TRENDING = [
  { id: 1, title: 'Starboy', subtitle: 'The Weeknd', type: 'music', count: '1.2k mentions' },
  { id: 2, title: 'Atomic Habits', subtitle: 'James Clear', type: 'book', count: '856 mentions' },
  { id: 3, title: 'Die With A Smile', subtitle: 'Lady Gaga, Bruno Mars', type: 'music', count: '645 mentions' },
];

const SUGGESTIONS = [
  { id: 1, name: 'John Doe', match: 92, avatar: 'bg-teal-500' },
  { id: 2, name: 'Jane Smith', match: 88, avatar: 'bg-rose-500' },
  { id: 3, name: 'Bob Wilson', match: 81, avatar: 'bg-indigo-500' },
];

const Newsfeed = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (id) => {
    // Global Audio State Logic: If playing another, switch logic handles auto-pause.
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: Main Feed (70%) */}
      <div className="flex-1 lg:w-[70%] space-y-6 overflow-hidden">
        
        {/* Live Radar */}
        <div className="bg-surface-color rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 overflow-x-auto custom-scrollbar">
          <div className="flex gap-4 min-w-max pb-2">
            {LIVE_RADAR.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-1 cursor-pointer group w-16">
                <div className={`relative w-14 h-14 rounded-full p-0.5 ${item.isLive ? 'bg-gradient-to-tr from-primary-500 to-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                  <div className={`w-full h-full rounded-full border-2 border-surface-color ${item.avatar} flex items-center justify-center`}>
                    {item.isRoom && <Music size={20} className="text-white" />}
                  </div>
                  {item.isLive && (
                    <div className="absolute -bottom-1 -right-1 bg-surface-color rounded-full p-0.5">
                      <div className="bg-red-500 text-white rounded-full p-1 animate-pulse">
                        <Disc3 size={10} />
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-center truncate w-full">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 px-2">
          <button 
            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'following' ? 'text-primary-500' : 'text-text-muted hover:text-text-color'}`}
            onClick={() => setActiveTab('following')}
          >
            Đang theo dõi
            {activeTab === 'following' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />}
          </button>
          <button 
            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'foryou' ? 'text-primary-500' : 'text-text-muted hover:text-text-color'}`}
            onClick={() => setActiveTab('foryou')}
          >
            Giai điệu mới
            {activeTab === 'foryou' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />}
          </button>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6 pb-20">
          {FEED_POSTS.map((post) => (
            <div key={post.id} className="bg-surface-color rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-800">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${post.user.avatar}`}></div>
                  <div>
                    <h4 className="font-semibold text-sm">{post.user.name}</h4>
                    <span className="text-xs text-text-muted">{post.user.time}</span>
                  </div>
                </div>
                <button className="text-text-muted hover:text-text-color p-1">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-sm mb-4 leading-relaxed">{post.content}</p>

              {/* Media Card */}
              {post.type === 'audio' ? (
                // Quick Note (Mini-player)
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
                  <div className={`w-16 h-16 rounded-lg flex-shrink-0 ${post.media.cover} shadow-md`}></div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm truncate">{post.media.title}</h5>
                    <p className="text-xs text-text-muted truncate">{post.media.artist}</p>
                    {/* Fake Progress Bar */}
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary-500 w-1/3"></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => togglePlay(post.id)}
                    className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                  >
                    {playingId === post.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-1" fill="currentColor" />}
                  </button>
                </div>
              ) : (
                // Review Card (to hơn, ảnh bìa to)
                <div className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
                  <div className={`w-24 h-36 rounded-md flex-shrink-0 ${post.media.cover} shadow-md`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-lg leading-tight">{post.media.title}</h5>
                      <div className="flex items-center text-yellow-500 text-xs">
                        {'★'.repeat(post.media.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mb-2">{post.media.author}</p>
                    <button className="text-xs font-semibold text-primary-500 mt-2 hover:underline">Read Full Review</button>
                  </div>
                </div>
              )}

              {/* Reactions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-text-muted hover:text-rose-500 transition-colors group">
                    <Flame size={18} className="group-hover:fill-rose-500" />
                    <span className="text-xs font-medium">{post.reactions.flame}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-text-muted hover:text-blue-500 transition-colors group">
                    <span className="text-lg leading-none mb-1 group-hover:scale-110 transition-transform">💔</span>
                    <span className="text-xs font-medium">{post.reactions.sad}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-text-muted hover:text-primary-500 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-xs font-medium">{post.reactions.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-text-muted hover:text-green-500 transition-colors">
                    <Share2 size={18} />
                    <span className="text-xs font-medium hidden sm:inline">{post.reactions.shares}</span>
                  </button>
                </div>
                <button className="text-text-muted hover:text-primary-500 p-1 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                  <Plus size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar (30%) */}
      <div className="hidden lg:block lg:w-[30%] space-y-6">
        
        {/* Friend Suggestions */}
        <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-text-muted">Gợi ý kết bạn</h3>
          <div className="space-y-4">
            {SUGGESTIONS.map(user => (
              <div key={user.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${user.avatar}`}></div>
                  <div>
                    <p className="font-semibold text-sm group-hover:underline cursor-pointer">{user.name}</p>
                    <p className="text-xs text-primary-500 font-medium">{user.match}% Match</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Now */}
        <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-text-muted">Trending Now</h3>
          <div className="space-y-4">
            {TRENDING.map((item, i) => (
              <div key={item.id} className="flex gap-3 group cursor-pointer">
                <div className="text-text-muted font-bold text-lg select-none w-4">{i + 1}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm group-hover:underline">{item.title}</p>
                    {item.type === 'music' ? <Music size={12} className="text-purple-500" /> : <Book size={12} className="text-orange-500" />}
                  </div>
                  <p className="text-xs text-text-muted">{item.subtitle}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-xs text-text-muted flex flex-wrap gap-x-3 gap-y-2 px-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">© 2026 Soundbook</a>
        </div>
      </div>

    </div>
  );
};

export default Newsfeed;
