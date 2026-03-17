import React from 'react';
import { ArrowLeft, Edit3, User, AlignLeft, Music, ToggleRight, ToggleLeft, Save, Info } from 'lucide-react';

const PersonalInfo = ({ t, isGuest, isEditingInfo, setIsEditingInfo, formData, handleInputChange, handleTogglePreview, handleSaveInfo, lastUpdate }) => {
  return (
    <div className={`bg-surface-color rounded-2xl ${isEditingInfo ? 'p-5' : 'px-5 py-4'} shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300`}>
      <div className={`flex items-center justify-between ${isEditingInfo ? 'mb-4' : 'mb-0'}`}>
        <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted">{t('profile.personal_info', { defaultValue: 'Personal Information' })}</h3>
        {!isGuest && (
          <button
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="text-text-muted hover:text-text-color transition-colors"
          >
            {isEditingInfo ? <ArrowLeft size={16} /> : <Edit3 size={16} />}
          </button>
        )}
      </div>

      {isEditingInfo ? (
        <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Username */}
          <div>
            <label className="flex items-center text-xs font-semibold mb-1.5 text-text-muted">
              <User size={14} className="mr-1.5" />
              {t('profile_info.username', { defaultValue: 'Username' })}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="@username"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center text-xs font-semibold mb-1.5 text-text-muted">
              <AlignLeft size={14} className="mr-1.5" />
              {t('profile_info.bio', { defaultValue: 'Bio' })}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-none"
              placeholder={t('profile_info.bio_placeholder', { defaultValue: 'Tell us a little bit about yourself...' })}
            />
          </div>

          {/* Pinned Track (Spotify) */}
          <div>
            <label className="flex items-center text-xs font-semibold mb-1.5 text-text-muted">
              <Music size={14} className="mr-1.5" />
              {t('profile_info.pinned_track', { defaultValue: 'Pinned Spotify Track' })}
            </label>
            <input
              type="text"
              name="pinnedTrack"
              value={formData.pinnedTrack}
              onChange={handleInputChange}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              placeholder="https://open..."
            />
          </div>

          {/* Settings / Toggles */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs">{t('profile_info.allow_preview', { defaultValue: 'Allow 15s Preview' })}</h4>
              </div>
              <button
                onClick={handleTogglePreview}
                className={`transition-colors ${formData.allowPreview ? 'text-primary-500' : 'text-gray-400 dark:text-gray-600'}`}
              >
                {formData.allowPreview ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>

          <div className="pt-3 flex flex-col items-center justify-between gap-3">
            <button
              onClick={handleSaveInfo}
              className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-500/20"
            >
              <Save size={16} />
              {t('common.save', { defaultValue: 'Save Changes' })}
            </button>
            <div className="flex items-center text-[10px] text-text-muted mt-1 w-full justify-center">
              <Info size={12} className="mr-1" />
              {t('profile_info.last_update', { defaultValue: 'Last updated:' })} {lastUpdate}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PersonalInfo;
