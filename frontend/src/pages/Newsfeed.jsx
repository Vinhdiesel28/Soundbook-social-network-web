import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, Plus, Flame, MoreHorizontal, Music, Disc3, Book, Image, Video, Send, Smile } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import LiveRadar from '../components/newsfeed/LiveRadar';
import CreatePost from '../components/newsfeed/CreatePost';
import FeedPost from '../components/newsfeed/FeedPost';
import NewsfeedSidebar from '../components/newsfeed/NewsfeedSidebar';

// Mock Data
const LIVE_RADAR = [
  { id: 1, name: 'Hải Đăng', avatar: 'bg-blue-500', isLive: true },
  { id: 2, name: 'Mai Linh', avatar: 'bg-pink-500', isLive: true },
  { id: 3, name: 'Minh Tuấn', avatar: 'bg-green-500', isLive: false },
  { id: 4, name: 'Bảo Trâm', avatar: 'bg-purple-500', isLive: false },
  { id: 5, name: 'Phòng thư giãn', avatar: 'bg-yellow-500', isRoom: true },
];

const getFeedPosts = (t) => [
  {
    id: 1,
    user: { name: 'Đạt Nguyễn', avatar: 'bg-orange-500', time: t('time.2h_ago') },
    type: 'audio',
    content: "Không thể ngừng nghe !",
    media: { title: 'Đừng Làm Trái Tim Anh Đau', artist: 'Sơn Tùng M-TP', cover: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    reactions: { flame: 124, sad: 2, comments: 18, shares: 5 },
    comments: [
      {
        id: 1, user: { name: 'Hải Đăng', avatar: 'bg-blue-500' }, text: 'Bài này đỉnh thật sự, nghe mãi không chán !!!', time: t('time.1h_ago'), reacts: 12,
        reactors: [
          { name: 'Mai Linh', react: 'fire' }, { name: 'Minh Tuấn', react: 'like' },
          { name: 'Bảo Trâm', react: 'heart' }, { name: 'Thanh Sơn', react: 'like' },
        ]
      },
      {
        id: 2, user: { name: 'Bảo Trâm', avatar: 'bg-purple-500' }, text: 'Sếp luôn là một level khác!', time: t('time.2h_ago'), reacts: 7,
        reactors: [
          { name: 'Đạt Nguyễn', react: 'fire' }, { name: 'Hải Đăng', react: 'like' },
          { name: 'Hương Giang', react: 'heart' },
        ]
      },
    ]
  },
  {
    id: 2,
    user: { name: 'Trần Quỳnh', avatar: 'bg-pink-500', time: t('time.5h_ago') },
    type: 'book_review',
    content: "Vừa đọc xong 'CTDL&GT'. Tôi đã khóc.",
    media: { title: 'Cấu Trúc Dữ Liệu & Giải Thuật', author: 'PTIT', cover: 'bg-gradient-to-br from-orange-400 to-red-600', rating: 5 },
    reactions: { flame: 89, sad: 0, comments: 32, shares: 12 },
    comments: [
      { id: 1, user: { name: 'Minh Tuấn', avatar: 'bg-green-500' }, text: 'CTDL&GT là cuốn sách tôi đọc nhiều lần nhất sau cuốn Hệ điều hành. Rất hay!', time: t('time.3h_ago') },
      { id: 2, user: { name: 'Thanh Sơn', avatar: 'bg-teal-500' }, text: 'Quá đẳng cấp.', time: t('time.5h_ago') },
      { id: 3, user: { name: 'Hương Giang', avatar: 'bg-rose-500' }, text: 'Tôi cũng vừa đọc xong, phần 2 "Messiah of Dune" còn hay hơn nữa!', time: t('time.1d_ago') },
    ]
  }
];

const TRENDING = [
  { id: 1, title: 'Na na na', subtitle: 'Daux Mysie', type: 'music', count: '1.2k lượt nghe' },
  { id: 2, title: 'Hệ điều hành', subtitle: 'PTIT', type: 'book', count: '856 lượt đọc' },
  { id: 3, title: 'Die With A Smile', subtitle: 'Lady Gaga, Bruno Mars', type: 'music', count: '645 lượt nghe' },
];

const SUGGESTIONS = [
  { id: 1, name: 'Nguyễn Văn Nam', match: 92, avatar: 'bg-teal-500' },
  { id: 2, name: 'Lê Kiều', match: 88, avatar: 'bg-rose-500' },
  { id: 3, name: 'Trần Bách', match: 81, avatar: 'bg-indigo-500' },
];

const Newsfeed = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('following');
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Left: Main */}
      <div className="flex-1 lg:w-[70%] space-y-6 overflow-hidden">

        <LiveRadar radarData={LIVE_RADAR} />

        <CreatePost />

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

        {/* Posts */}
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

      {/* Right: Sidebar */}
      <NewsfeedSidebar suggestions={SUGGESTIONS} trending={TRENDING} />

    </div>
  );
};

export default Newsfeed;
