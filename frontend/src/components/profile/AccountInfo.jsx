import React from 'react';
import { ArrowLeft, Edit3, User, Mail, Fingerprint, Lock, Save, Info } from 'lucide-react';

const AccountInfo = ({ t, isGuest, isEditingAccount, setIsEditingAccount, accountData, handleAccountInputChange, handleSaveAccountInfo, isChangingPassword, setIsChangingPassword, passwordData, handlePasswordInputChange, handleSavePassword, lastUpdate }) => {
  return (
    <div className={`bg-surface-color rounded-2xl ${isEditingAccount ? 'p-5' : 'px-5 py-4'} shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300`}>
      <div className={`flex items-center justify-between ${isEditingAccount ? 'mb-4' : 'mb-0'}`}>
        <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted">{t('profile.account_info', { defaultValue: 'Account Information' })}</h3>
        {!isGuest && (
          <button
            onClick={() => setIsEditingAccount(!isEditingAccount)}
            className="text-text-muted hover:text-text-color transition-colors"
          >
            {isEditingAccount ? <ArrowLeft size={16} /> : <Edit3 size={16} />}
          </button>
        )}
      </div>

      {isEditingAccount ? (
        <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Display Name */}
          <div>
            <label className="flex items-center text-xs font-semibold mb-1.5 text-text-muted">
              <User size={14} className="mr-1.5" />
              {t('account_info.display_name', { defaultValue: 'Display Name' })}
            </label>
            <input
              type="text"
              name="displayName"
              value={accountData.displayName}
              onChange={handleAccountInputChange}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center text-xs font-semibold mb-1.5 text-text-muted">
              <Mail size={14} className="mr-1.5" />
              {t('account_info.email', { defaultValue: 'Login Email' })}
            </label>
            <input
              type="email"
              name="email"
              value={accountData.email}
              onChange={handleAccountInputChange}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="example@mail.com"
            />
          </div>

          {/* Google Sub */}
          <div>
            <label className="flex items-center text-xs font-semibold mb-1.5 text-text-muted">
              <Fingerprint size={14} className="mr-1.5" />
              {t('account_info.google_sub', { defaultValue: 'Google Identifier' })}
            </label>
            <input
              type="text"
              name="googleSub"
              value={accountData.googleSub}
              disabled
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
              placeholder="Null"
            />
          </div>

          {/* Settings / Toggles */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-500/10 rounded-md text-primary-500">
                  <Lock size={16} />
                </div>
                <span className="text-sm font-semibold">{t('account_info.change_password', { defaultValue: 'Change Password' })}</span>
              </div>
            </button>

            {/* Change Password Form */}
            {isChangingPassword && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-muted">
                    {t('account_info.current_pwd', { defaultValue: 'Current Password' })}
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-muted">
                    {t('account_info.new_pwd', { defaultValue: 'New Password' })}
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-muted">
                    {t('account_info.confirm_pwd', { defaultValue: 'Confirm New Password' })}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-text-muted bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('account_info.pwd_cancel', { defaultValue: 'Cancel' })}
                  </button>
                  <button
                    onClick={handleSavePassword}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors"
                  >
                    {t('account_info.pwd_save', { defaultValue: 'Save Password' })}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 flex flex-col items-center justify-between gap-3">
            <button
              onClick={handleSaveAccountInfo}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-500/20"
            >
              <Save size={16} />
              {t('common.save', { defaultValue: 'Save Changes' })}
            </button>
            <div className="flex items-center text-[10px] text-text-muted mt-1 w-full justify-center">
              <Info size={12} className="mr-1" />
              {t('account_info.last_update', { defaultValue: 'Last updated:' })} {lastUpdate}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AccountInfo;
