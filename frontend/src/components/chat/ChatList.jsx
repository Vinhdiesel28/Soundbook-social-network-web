import React from 'react';
import { Search, Plus, Users, Disc3 } from 'lucide-react';

const ChatList = ({ t, chats, activeChat, setActiveChat }) => {
  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50/50 dark:bg-black/10">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">{t('chat.title')}</h2>
          <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-text-muted hover:text-text-color hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder={t('chat.search')}
            className="w-full bg-surface-color border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeChat === chat.id ? 'bg-primary-500/10 dark:bg-primary-900/20 shadow-sm' : 'hover:bg-white dark:hover:bg-gray-800'}`}
          >
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${chat.avatar} ${chat.type === 'group' && 'rounded-xl'} flex-shrink-0 flex items-center justify-center shadow-inner`}>
                {chat.type === 'group' && <Users size={20} className="text-white opacity-50" />}
              </div>
              {chat.isLive && (
                <div className="absolute -bottom-1 -right-1 bg-surface-color rounded-full p-0.5 shadow-sm">
                  <div className="w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <Disc3 size={8} className="text-white" />
                  </div>
                </div>
              )}
              {chat.unread > 0 && !chat.isLive && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface-color shadow-sm">
                  {chat.unread}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                <span className={`text-[10px] whitespace-nowrap ${chat.unread > 0 ? 'font-bold text-primary-500' : 'text-gray-500'}`}>{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unread > 0 ? 'font-semibold text-text-color' : 'text-gray-500'}`}>
                {chat.lastMsg}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
