import React, { useState } from 'react';
import { Grid3X3, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfo from '../components/profile/PersonalInfo';
import AccountInfo from '../components/profile/AccountInfo';
import FriendsList from '../components/profile/FriendsList';
import ConnectedAccounts from '../components/profile/ConnectedAccounts';
import ProfileShelves from '../components/profile/ProfileShelves';
import ProfilePosts from '../components/profile/ProfilePosts';

// Mock Data
const PROFILE_DATA = {
  name: 'Dat Nguyen',
  username: '@datnguyen',
  bio: 'Đam mê kết nối mọi người qua âm nhạc và những trang sách. Luôn tìm kiếm góc nhìn mới và sẵn sàng chia sẻ câu chuyện của chính mình.',
  description: 'Đam mê kết nối mọi người qua âm nhạc và những trang sách. Luôn tìm kiếm góc nhìn mới và sẵn sàng chia sẻ câu chuyện của chính mình.',
  avatar: 'bg-orange-500',
  themeColor: 'from-orange-500/20 to-purple-900/40',
  matchScore: null, // null means owner viewing
  pinnedSong: { title: 'Space Song', artist: 'Beach House', cover: 'bg-gradient-to-br from-indigo-500 to-purple-600' }
};

const getShelves = (t) => [
  {
    id: 'playlists',
    title: t('profile.shelf.playlists', { defaultValue: 'Playlists' }),
    items: [
      { id: 1, type: 'music', title: 'Moody Mix', author: 'Dat Nguyen', style: 'bg-blue-900 rounded-md shrink-0 aspect-square w-24 sm:w-32' },
      { id: 2, type: 'music', title: 'Coding Focus', author: 'Dat Nguyen', style: 'bg-indigo-700 rounded-md shrink-0 aspect-square w-24 sm:w-32' },
      { id: 3, type: 'music', title: 'Chill Vibes', author: 'Dat Nguyen', style: 'bg-teal-600 rounded-md shrink-0 aspect-square w-24 sm:w-32' },
    ]
  },
  {
    id: 'library',
    title: t('profile.shelf.library', { defaultValue: 'Library' }),
    items: [
      { id: 4, type: 'music', title: 'Brat', author: 'Charli XCX', style: 'bg-lime-400 rounded-md shrink-0 aspect-square w-24 sm:w-32', rating: 5 },
      { id: 5, type: 'book', title: 'Project Hail Mary', author: 'Andy Weir', style: 'bg-blue-600 rounded-sm shrink-0 w-16 sm:w-20 h-28 sm:h-36', progress: 65 },
      { id: 6, type: 'book', title: 'The Three-Body Problem', author: 'Cixin Liu', style: 'bg-gray-800 rounded-sm shrink-0 w-16 sm:w-20 h-28 sm:h-36 border border-gray-600 opacity-80' },
    ]
  }
];

const MOCK_FRIENDS = [
  { id: 1, name: 'Alex', avatar: 'bg-blue-500', isOnline: true },
  { id: 2, name: 'Sarah', avatar: 'bg-pink-500', isOnline: true },
  { id: 3, name: 'Mike', avatar: 'bg-green-500', isOnline: false },
  { id: 4, name: 'Emma', avatar: 'bg-purple-500', isOnline: true },
  { id: 5, name: 'John Doe', avatar: 'bg-teal-500', isOnline: false },
  { id: 6, name: 'Jane Smith', avatar: 'bg-rose-500', isOnline: true },
];

const getProfilePosts = (t) => [
  {
    id: 1,
    user: { name: 'Dat Nguyen', avatar: 'bg-orange-500', time: t('time.2h_ago', { defaultValue: '2h ago' }) },
    type: 'audio',
    content: t('post.1.content', { defaultValue: 'Just discovered this amazing track! 🎧' }),
    media: { title: 'Midnight City', artist: 'M83', cover: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    reactions: { flame: 124, sad: 2, comments: 18, shares: 5 }
  },
  {
    id: 2,
    user: { name: 'Dat Nguyen', avatar: 'bg-orange-500', time: t('time.1d_ago', { defaultValue: '1d ago' }) },
    type: 'book_review',
    content: t('post.2.content', { defaultValue: 'A masterpiece of science fiction.' }),
    media: { title: 'Dune', author: 'Frank Herbert', cover: 'bg-gradient-to-br from-orange-400 to-red-600', rating: 5 },
    reactions: { flame: 89, sad: 0, comments: 32, shares: 12 }
  }
];

const Profile = ({ isGuest = false }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('shelf');
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Mock initial data for Profile Info
  const [formData, setFormData] = useState({
    username: PROFILE_DATA.username,
    bio: PROFILE_DATA.bio,
    pinnedTrack: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT', // Space Song by Beach House
    allowPreview: true,
  });

  const lastUpdate = '10/03/2026 14:30';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePreview = () => {
    setFormData(prev => ({ ...prev, allowPreview: !prev.allowPreview }));
  };

  const handleSaveInfo = () => {
    console.log('Saving profile info:', formData);
    // Here you would typically make an API call to save the data
    setIsEditingInfo(false);
  };

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountData, setAccountData] = useState({
    email: 'datnguyen@soundbook.vn',
    displayName: PROFILE_DATA.username,
    googleSub: '103829491820491823901' // Mock Google sub
  });

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAccountInfo = () => {
    console.log('Saving account info:', accountData);
    setIsEditingAccount(false);
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = () => {
    console.log('Saving new password...', passwordData);

    // Reset after saving
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="flex flex-col gap-6 -mt-6"> {/* Negative margin to offset layout padding for full width header header */}

      {/* Dynamic Header */}
      <ProfileHeader 
        profileData={PROFILE_DATA} 
        isGuest={isGuest} 
        isPlaying={isPlaying} 
        onTogglePlay={() => setIsPlaying(!isPlaying)} 
        t={t} 
      />

      {/* Main Body (Kệ sách/đĩa) */}
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-4">

        {/* Controls */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{t('profile.title')}</h2>
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

        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          {/* LEFT SIDEBAR: Friends (30%) */}
          <div className="w-full lg:w-[30%] space-y-6 lg:sticky lg:top-24 pb-4">

            {/* Personal Info */}
            <PersonalInfo 
              t={t} 
              isGuest={isGuest} 
              isEditingInfo={isEditingInfo} 
              setIsEditingInfo={setIsEditingInfo} 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleTogglePreview={handleTogglePreview} 
              handleSaveInfo={handleSaveInfo} 
              lastUpdate={lastUpdate} 
            />

            {/* Account Info */}
            <AccountInfo 
              t={t} 
              isGuest={isGuest} 
              isEditingAccount={isEditingAccount} 
              setIsEditingAccount={setIsEditingAccount} 
              accountData={accountData} 
              handleAccountInputChange={handleAccountInputChange} 
              handleSaveAccountInfo={handleSaveAccountInfo} 
              isChangingPassword={isChangingPassword} 
              setIsChangingPassword={setIsChangingPassword} 
              passwordData={passwordData} 
              handlePasswordInputChange={handlePasswordInputChange} 
              handleSavePassword={handleSavePassword} 
              lastUpdate={lastUpdate} 
            />

            {/* Friends */}
            <FriendsList t={t} friends={MOCK_FRIENDS} />

            {/* Connected Accounts */}
            <ConnectedAccounts t={t} />
          </div>

          {/* RIGHT CONTENT: Shelves & Posts (70%) */}
          <div className="flex-1 w-full lg:w-[70%] space-y-16">

            {/* Shelves */}
            <ProfileShelves t={t} shelves={getShelves(t)} isGuest={isGuest} />

            {/* Posts Section */}
            <ProfilePosts t={t} posts={getProfilePosts(t)} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
