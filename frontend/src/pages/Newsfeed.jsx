import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, Plus, Flame, MoreHorizontal, Music, Disc3, Book, Image, Video, Send, Smile } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import LiveRadar from '../components/newsfeed/LiveRadar';
import CreatePost from '../components/newsfeed/CreatePost';
import FeedPost from '../components/newsfeed/FeedPost';
import NewsfeedSidebar from '../components/newsfeed/NewsfeedSidebar';

// Mock Data
const LIVE_RADAR = [
  { id: 1, name: 'Alex', avatar: 'bg-blue-500', isLive: true },
  { id: 2, name: 'Sarah', avatar: 'bg-pink-500', isLive: true },
  { id: 3, name: 'Mike', avatar: 'bg-green-500', isLive: false },
  { id: 4, name: 'Emma', avatar: 'bg-purple-500', isLive: false },
  { id: 5, name: 'Chill Room', avatar: 'bg-yellow-500', isRoom: true },
];

const getFeedPosts = (t) => [
  {
    id: 1,
    user: { name: 'Dat Nguyen', avatar: 'bg-orange-500', time: t('time.2h_ago') },
    type: 'audio',
    content: t('post.1.content'),
    media: { title: 'Midnight City', artist: 'M83', cover: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    reactions: { flame: 124, sad: 2, comments: 18, shares: 5 },
    comments: [
      { id: 1, user: { name: 'Alex', avatar: 'bg-blue-500' }, text: 'Bài này đỉnh thật sự, nghe mãi không chán 🔥', time: t('time.1h_ago'), reacts: 12,
        reactors: [
          { name: 'Sarah Connor', react: 'fire' }, { name: 'Mike', react: 'like' },
          { name: 'Emma', react: 'heart' }, { name: 'John Doe', react: 'like' },
        ]
      },
      { id: 2, user: { name: 'Emma', avatar: 'bg-purple-500' }, text: 'M83 luôn là một level khác 😍 synthwave huyền thoại!', time: t('time.2h_ago'), reacts: 7,
        reactors: [
          { name: 'Dat Nguyen', react: 'fire' }, { name: 'Alex', react: 'like' },
          { name: 'Jane Smith', react: 'heart' },
        ]
      },
    ]
  },
  {
    id: 2,
    user: { name: 'Sarah Connor', avatar: 'bg-pink-500', time: t('time.5h_ago') },
    type: 'book_review',
    content: t('post.2.content'),
    media: { title: 'Dune', author: 'Frank Herbert', cover: 'bg-gradient-to-br from-orange-400 to-red-600', rating: 5 },
    reactions: { flame: 89, sad: 0, comments: 32, shares: 12 },
    comments: [
      { id: 1, user: { name: 'Mike', avatar: 'bg-green-500' }, text: 'Dune là một trong những cuốn sách tôi đọc nhiều lần nhất. Thế giới quan quá phức tạp và thú vị!', time: t('time.3h_ago') },
      { id: 2, user: { name: 'John Doe', avatar: 'bg-teal-500' }, text: 'Bộ phim năm 2021 và 2024 cũng rất hay, xứng đáng với nguyên tác 👏', time: t('time.5h_ago') },
      { id: 3, user: { name: 'Jane Smith', avatar: 'bg-rose-500' }, text: 'Tôi cũng vừa đọc xong, phần 2 "Messiah of Dune" còn hay hơn nữa!', time: t('time.1d_ago') },
    ]
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
  const { t } = useLanguage();
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
        <LiveRadar radarData={LIVE_RADAR} />

        {/* Create Post */}
        <CreatePost />

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 px-2">
          <button
            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'following' ? 'text-primary-500' : 'text-text-muted hover:text-text-color'}`}
            onClick={() => setActiveTab('following')}
          >
            {t('feed.following')}
            {activeTab === 'following' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />}
          </button>
          <button
            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'foryou' ? 'text-primary-500' : 'text-text-muted hover:text-text-color'}`}
            onClick={() => setActiveTab('foryou')}
          >
            {t('feed.foryou')}
            {activeTab === 'foryou' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />}
          </button>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6 pb-20">
          {getFeedPosts(t).map((post) => (
            <FeedPost 
              key={post.id} 
              post={post} 
              isPlaying={playingId === post.id} 
              onTogglePlay={() => togglePlay(post.id)} 
            />
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar (30%) */}
      <NewsfeedSidebar suggestions={SUGGESTIONS} trending={TRENDING} />

    </div>
  );
};

export default Newsfeed;
