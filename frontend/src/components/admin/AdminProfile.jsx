import React, { useState } from 'react';
import { Camera, Key } from 'lucide-react';

const AdminProfile = ({ t }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6 animate-in fade-in duration-300">
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-6 text-center">{t('admin.nav.profile')}</h3>

        <div className="flex flex-col items-center gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-4 border-surface-color shadow-lg overflow-hidden flex items-center justify-center">
                <span className="text-4xl text-white font-bold">DN</span>
              </div>
              <button
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-transform hover:scale-105"
                title="Change Avatar"
              >
                <Camera size={18} />
              </button>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full">
              {t('admin.profile.role')}
            </span>
          </div>

          {/* Details Section */}
          <div className="w-full max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.name')}</label>
                <input
                  type="text"
                  defaultValue="Dat Nguyen"
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.email')}</label>
                <input
                  type="email"
                  defaultValue="dat.nguyen@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.current_role')}</label>
                <div className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm text-gray-500 cursor-not-allowed">
                  System Administrator
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.last_login')}</label>
                <div className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm text-gray-500 cursor-not-allowed">
                  Oct 24, 2024 - 14:30 PM
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                onClick={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text-color rounded-lg text-sm font-semibold transition-colors"
              >
                <Key size={16} /> {t('admin.profile.change_password')}
              </button>

              <button className="w-full sm:w-auto px-10 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5">
                {t('admin.profile.update')}
              </button>
            </div>

            {/* Inline Password Change Form */}
            {isPasswordModalOpen && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
                <h4 className="text-sm font-bold mb-4">{t('admin.profile.change_password')}</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-text-muted font-medium">{t('admin.profile.current_pwd')}</label>
                    <input
                      type="password"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-text-muted font-medium">{t('admin.profile.new_pwd')}</label>
                    <input
                      type="password"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-text-muted font-medium">{t('admin.profile.confirm_pwd')}</label>
                    <input
                      type="password"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="px-4 py-2 rounded-lg font-medium text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {t('admin.profile.pwd_cancel')}
                    </button>
                    <button className="px-5 py-2 rounded-lg font-bold text-sm bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                      {t('admin.profile.pwd_save')}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
