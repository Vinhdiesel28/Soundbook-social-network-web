import React, { useState } from 'react';
import { Users, AlertTriangle, Activity, Search, Filter, MoreVertical, Ban, CheckCircle, Disc3, BookOpen, BarChart3, Settings, MessageSquare, Video, ShieldAlert, Key, Edit, Trash2, Camera, LogOut, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminPosts from '../components/admin/AdminPosts';
import AdminMessages from '../components/admin/AdminMessages';
import AdminRooms from '../components/admin/AdminRooms';
import AdminReports from '../components/admin/AdminReports';
import AdminProfile from '../components/admin/AdminProfile';

const AdminDashboard = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'posts' | 'messages' | 'rooms' | 'profile'
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-color text-text-color flex">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'} fixed lg:static inset-y-0 left-0 z-50 shrink-0 bg-surface-color border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform lg:transition-all duration-300`}>
        <div className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-800 ${isSidebarOpen ? 'px-6 gap-3' : 'justify-center px-0'} transition-all duration-300`}>
          <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center shrink-0">
            <Disc3 size={20} />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">Soundbook <span className="text-primary-500">Admin</span></span>}
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
          <button
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'overview' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={!isSidebarOpen ? t('admin.nav.overview') : ''}
          >
            <Activity size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.nav.overview')}</span>}
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'users' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={!isSidebarOpen ? t('admin.nav.users') : ''}
          >
            <Users size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.nav.users')}</span>}
          </button>
          <button
            onClick={() => handleTabChange('posts')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'posts' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={!isSidebarOpen ? t('admin.nav.posts') : ''}
          >
            <BookOpen size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.nav.posts')}</span>}
          </button>
          <button
            onClick={() => handleTabChange('messages')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'messages' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={!isSidebarOpen ? t('admin.nav.messages') : ''}
          >
            <MessageSquare size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.nav.messages')}</span>}
          </button>
          <button
            onClick={() => handleTabChange('rooms')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'rooms' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={!isSidebarOpen ? t('admin.nav.rooms') : ''}
          >
            <Video size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.nav.rooms')}</span>}
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'reports' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={!isSidebarOpen ? t('admin.nav.reports') : ''}
          >
            <ShieldAlert size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.nav.reports')}</span>}
          </button>
        </div>

        <div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${isSidebarOpen ? '' : 'flex justify-center px-2'}`}>
          <button
            className={`flex items-center ${isSidebarOpen ? 'w-full gap-3 px-4' : 'justify-center p-3'} py-3 rounded-xl transition-colors font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10`}
            title={!isSidebarOpen ? t('admin.profile.logout') : ''}
          >
            <LogOut size={18} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">{t('admin.profile.logout')}</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        <header className="h-16 shrink-0 bg-surface-color border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors flex items-center justify-center shrink-0"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold capitalize">{t(`admin.nav.${activeTab}`)}</h1>
          </div>
          <div className="flex items-center gap-4">

            <button
              onClick={toggleLanguage}
              className="px-2 py-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg text-text-muted hover:text-text-color font-semibold text-xs tracking-wider transition-colors border border-gray-200 dark:border-gray-700 uppercase"
              title="Toggle Language"
            >
              {language}
            </button>
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-2 border-surface-color cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {showProfileMenu && (
                <div className="absolute top-12 right-0 w-48 bg-surface-color rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                    <p className="font-semibold text-sm">Dat Nguyen</p>
                    <p className="text-xs text-gray-500">{t('admin.profile.role')}</p>
                  </div>
                  <button onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">{t('admin.profile.my_account')}</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg mt-1">{t('admin.profile.logout')}</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-gray-50/50 dark:bg-black/10">

          {activeTab === 'overview' && <AdminOverview t={t} />}
          {activeTab === 'users' && <AdminUsers t={t} />}

          {activeTab === 'posts' && <AdminPosts t={t} />}
          {activeTab === 'messages' && <AdminMessages t={t} />}

          {activeTab === 'rooms' && <AdminRooms t={t} />}
          {activeTab === 'reports' && <AdminReports t={t} />}
          {activeTab === 'profile' && <AdminProfile t={t} />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
