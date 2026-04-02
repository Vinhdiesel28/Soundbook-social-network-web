import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Bell, Sun, Moon, Menu, MessageCircle, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-color border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <a href="/feed" className="flex items-center gap-2 outline-none">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold dark:animate-pulse">
                SB
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent hidden sm:block">
                {t('app.name')}
              </span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl px-4 mx-auto relative">
            <div className={`relative flex items-center w-full h-10 rounded-full bg-gray-100 dark:bg-gray-800 border transition-all duration-300 ${isSearchFocused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent'}`}>
              <div className="pl-4 pr-2 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="w-full h-full bg-transparent border-none outline-none text-sm px-2 text-text-color placeholder-gray-400"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
            </div>

            {/* Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-12 left-4 right-4 bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2 uppercase tracking-wider">{t('header.search_users')}</div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                    <div className="text-sm font-medium">Hải Đăng <span className="text-xs text-gray-500">85% Match</span></div>
                  </div>

                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2 uppercase tracking-wider mt-2">{t('header.search_music')}</div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white text-xs">🎵</div>
                    <div className="text-sm font-medium">Sau Lời Từ Khước <span className="text-xs text-gray-500">Phan Mạnh Quỳnh</span></div>
                  </div>

                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 p-2 uppercase tracking-wider mt-2">{t('header.search_books')}</div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <div className="w-6 h-8 rounded-sm bg-orange-500 flex items-center justify-center text-white text-xs">📚</div>
                    <div className="text-sm font-medium">Đắc Nhân Tâm <span className="text-xs text-gray-500">Dale Carnegie</span></div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 text-center text-sm text-primary-500 hover:text-primary-600 cursor-pointer font-medium border-t border-gray-200 dark:border-gray-800">
                  {t('header.see_all_results')} "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title={t('header.toggle_theme')}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={toggleLanguage}
              className="px-2 py-1 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-xs tracking-wider transition-colors border border-gray-200 dark:border-gray-700 uppercase"
              title="Toggle Language"
            >
              {language}
            </button>

            {/* Messages */}
            <Link
              to="/chat"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title={t('header.messages')}
            >
              <MessageCircle size={20} />
              {/* Unread message */}
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none border border-white dark:border-gray-900">
                3
              </span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-gray-900"></span>
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-semibold text-md">{t('header.notifications')}</h3>
                    <button className="text-xs text-primary-500 hover:underline">{t('header.mark_all_read')}</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto w-full">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm"><span className="font-semibold">Mai Linh</span> {t('header.notification.liked_review')} "Đắc Nhân Tâm"</p>
                          <p className="text-xs text-gray-500 mt-1">{t('time.2h_ago')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center text-sm text-primary-500 hover:underline cursor-pointer border-t border-gray-100 dark:border-gray-800">
                    {t('header.view_all_notifications')}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                onBlur={() => setTimeout(() => setShowProfileMenu(false), 300)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 border-2 border-white dark:border-gray-800 relative">
                  <div className="absolute inset-0 rounded-full ring-2 ring-primary-500 opacity-50"></div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-12 right-0 w-56 bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-semibold">Dat Nguyen</p>
                    <p className="text-xs text-gray-500">@datnguyen</p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    {/* <Link to="/profile/me" 
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <User size={16} />
                      {t('header.profile')}
                    </Link> */}

                    <div
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile/me");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                    >
                      <User size={16} />
                      {t('header.profile')}
                    </div>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <LogOut size={16} />
                      {t('header.logout')}
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
