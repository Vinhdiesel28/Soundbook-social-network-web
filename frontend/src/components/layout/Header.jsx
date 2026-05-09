import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  MessageCircle,
  User,
  LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, resolveHomePath } from '../../services/auth';

const Header = ({ unreadMessages = 3 }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUser] = useState(() => getCurrentUser());

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  const userName = currentUser?.displayName || 'Soundbook User';
  const userUsername = currentUser?.username || (currentUser?.email ? `@${currentUser.email.split('@')[0]}` : '@soundbook');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowProfileMenu(false);
  };

  const handleToggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);

    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const homePath = resolveHomePath(currentUser?.role);
  const profilePath = currentUser?.id ? `/profile/${currentUser.id}` : '/profile/me';
  const showSearchDropdown = isSearchFocused && searchQuery.trim().length > 0;

  return (
      <header className="sticky top-0 z-50 w-full bg-surface-color border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link
                  to={homePath}
                  className="flex items-center gap-2 outline-none rounded-md focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label={t('app.name')}
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold dark:animate-pulse">
                  SB
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent hidden sm:block">
                {t('app.name')}
              </span>
              </Link>
            </div>

            <div ref={searchRef} className="flex-1 max-w-2xl px-2 sm:px-4 mx-auto relative">
              <div
                  className={`relative flex items-center w-full h-10 rounded-full bg-gray-100 dark:bg-gray-800 border transition-all duration-300 ${
                      isSearchFocused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent'
                  }`}
              >
                <div className="pl-4 pr-2 text-gray-400" aria-hidden="true">
                  <Search size={18} />
                </div>

                <input
                    type="text"
                    className="w-full h-full bg-transparent border-none outline-none text-sm px-2 text-text-color placeholder-gray-400"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    aria-label={t('common.search')}
                    aria-expanded={showSearchDropdown}
                    aria-controls="header-search-dropdown"
                />
              </div>

              {showSearchDropdown && (
                  <div
                      id="header-search-dropdown"
                      role="listbox"
                      className="absolute top-12 left-2 right-2 sm:left-4 sm:right-4 bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top"
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2 uppercase tracking-wider">
                        {t('header.search_users')}
                      </div>
                      <button type="button" className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full text-left">
                        <div className="w-8 h-8 rounded-full bg-blue-500" />
                        <div className="text-sm font-medium">Hải Đăng <span className="text-xs text-gray-500">85% Match</span></div>
                      </button>

                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2 uppercase tracking-wider mt-2">
                        {t('header.search_music')}
                      </div>
                      <button type="button" className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full text-left">
                        <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white text-xs">🎵</div>
                        <div className="text-sm font-medium">Sau Lời Từ Khước <span className="text-xs text-gray-500">Phan Mạnh Quỳnh</span></div>
                      </button>

                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2 uppercase tracking-wider mt-2">
                        {t('header.search_books')}
                      </div>
                      <button type="button" className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full text-left">
                        <div className="w-6 h-8 rounded-sm bg-orange-500 flex items-center justify-center text-white text-xs">📚</div>
                        <div className="text-sm font-medium">Đắc Nhân Tâm <span className="text-xs text-gray-500">Dale Carnegie</span></div>
                      </button>
                    </div>

                    <button type="button" className="bg-gray-50 dark:bg-gray-900/50 p-3 text-center text-sm text-primary-500 hover:text-primary-600 cursor-pointer font-medium border-t border-gray-200 dark:border-gray-800 w-full">
                      {t('header.see_all_results')} "{searchQuery}"
                    </button>
                  </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
                  title={t('header.toggle_theme')}
                  aria-label={t('header.toggle_theme')}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-2 py-1 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-xs tracking-wider transition-colors border border-gray-200 dark:border-gray-700 uppercase focus-visible:ring-2 focus-visible:ring-primary-500"
                  title="Toggle Language"
                  aria-label="Toggle language"
              >
                {language}
              </button>

              <Link to="/chat" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500" title={t('header.messages')} aria-label={t('header.messages')}>
                <MessageCircle size={20} />
                {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none border border-white dark:border-gray-900">
                  {unreadMessages}
                </span>
                )}
              </Link>

              <div ref={notificationsRef} className="relative">
                <button
                    type="button"
                    onClick={handleToggleNotifications}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
                    aria-label={t('header.notifications')}
                    aria-haspopup="menu"
                    aria-expanded={showNotifications}
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-gray-900" />
                </button>

                {showNotifications && (
                    <div role="menu" className="absolute top-12 right-0 w-80 max-w-[calc(100vw-2rem)] bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="font-semibold text-md">{t('header.notifications')}</h3>
                        <button type="button" className="text-xs text-primary-500 hover:underline">{t('header.mark_all_read')}</button>
                      </div>
                    </div>
                )}
              </div>

              <div ref={profileMenuRef} className="relative">
                <button
                    type="button"
                    onClick={handleToggleProfileMenu}
                    className="flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
                    aria-haspopup="menu"
                    aria-expanded={showProfileMenu}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold overflow-hidden">
                    {currentUser?.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{userName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </button>

                {showProfileMenu && (
                    <div role="menu" className="absolute top-12 right-0 w-72 max-w-[calc(100vw-2rem)] bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="font-semibold">{userName}</div>
                        <div className="text-sm text-text-muted">{userUsername}</div>
                        <div className="text-xs mt-1 uppercase tracking-wide text-primary-500">{currentUser?.role || 'USER'}</div>
                      </div>

                      <div className="p-2">
                        <Link to={profilePath} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setShowProfileMenu(false)}>
                          <User size={18} />
                          <span>{t('header.view_profile')}</span>
                        </Link>

                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left text-red-500">
                          <LogOut size={18} />
                          <span>{t('header.logout')}</span>
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;