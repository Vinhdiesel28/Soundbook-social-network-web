import React from 'react';
import { Image, Book, Send, Smile } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CreatePost = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-color rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex-shrink-0"></div>
        <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full pl-4 pr-2 py-1 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <input
            type="text"
            placeholder={t('feed.whats_on_your_mind')}
            className="flex-1 bg-transparent border-none text-sm focus:outline-none py-1"
          />
          <button className="text-text-muted hover:text-primary-500 p-1.5 rounded-full transition-colors flex-shrink-0">
            <Smile size={20} />
          </button>
        </div>
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800 my-3" />
      <div className="flex justify-between items-center">
        <div className="flex gap-1 sm:gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <Image size={18} className="text-green-500" />
            <span className="text-sm font-medium hidden sm:block">{t('feed.photo_video')}</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <Book size={18} className="text-orange-500" />
            <span className="text-sm font-medium hidden sm:block">{t('feed.share_book')}</span>
          </button>
        </div>
        <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-primary-500/20">
          <Send size={16} />
          {t('feed.post_button')}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
