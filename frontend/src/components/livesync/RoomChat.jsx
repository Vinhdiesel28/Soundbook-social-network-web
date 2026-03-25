import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const RoomChat = ({ chatMessages, chatInput, setChatInput }) => {
  const { t } = useLanguage();
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 dark:bg-black/10">
        <div className="flex flex-col gap-4 min-h-full">
          <div className="mt-auto space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div>
                  <span className="font-semibold text-xs text-text-muted">{msg.user}</span>
                  <p className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tl-sm text-text-color inline-block mt-0.5 shadow-sm">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-surface-color">
        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={t('room.chat_placeholder')}
            className="w-full bg-gray-100 dark:bg-gray-800 border-none outline-none rounded-full py-2.5 pl-4 pr-12 text-sm text-text-color placeholder-gray-500"
          />
          <button className="absolute right-1 top-1 bottom-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
            <Heart size={14} fill="currentColor" />
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomChat;
