import React, { useState } from 'react';
import { Search, Plus, Phone, Video, Info, MoreVertical, Play, Pause, Disc3, BookOpen, Send, Mic, Image, Smile, Users, MessageSquare } from 'lucide-react';

const CHATS = [
  { id: 1, name: 'Dat Nguyen', type: 'direct', avatar: 'bg-orange-500', unread: 2, lastMsg: 'Wait till you hear this new track...', time: '10:42 AM', isLive: true },
  { id: 2, name: 'Indie Heads 🎸', type: 'group', avatar: 'bg-indigo-500', unread: 0, lastMsg: 'Sarah: Just finished reading Dune!', time: 'Yesterday' },
  { id: 3, name: 'Synthwave Chill', type: 'group', avatar: 'bg-purple-600', unread: 5, lastMsg: 'Mike started a Live Sync Room', time: 'Tuesday', isLive: true },
  { id: 4, name: 'Emma', type: 'direct', avatar: 'bg-pink-500', unread: 0, lastMsg: 'Thanks for the recommendation', time: 'Mon' },
];

const MESSAGES = [
  { id: 1, user: 'Dat Nguyen', isMe: false, text: 'Hey! Did you check out that album I sent?', time: '10:30 AM', avatar: 'bg-orange-500' },
  { id: 2, user: 'Me', isMe: true, text: 'Yeah I did! The production is insane. Especially track 3.', time: '10:35 AM' },
  { id: 3, user: 'Dat Nguyen', isMe: false, text: 'Right?? Wait till you hear this new track...', time: '10:42 AM', avatar: 'bg-orange-500' },
  { 
    id: 4, 
    user: 'Dat Nguyen', 
    isMe: false, 
    type: 'audio',
    media: { title: 'Neon Night', artist: 'Synthwave Runner', cover: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500' },
    time: '10:43 AM',
    avatar: 'bg-orange-500'
  },
  {
    id: 5,
    user: 'Me',
    isMe: true,
    type: 'book',
    text: 'Nice! While we are sharing stuff, you have to read this:',
    media: { title: 'Neuromancer', author: 'William Gibson', cover: 'bg-gray-800' },
    time: '10:45 AM'
  }
];

const Chat = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [playingId, setPlayingId] = useState(null);

  const activeData = CHATS.find(c => c.id === activeChat);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      
      {/* LEFT SIDEBAR: Chat List (320px) */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50/50 dark:bg-black/10">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl">Messages</h2>
            <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-text-muted hover:text-text-color hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-surface-color border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {CHATS.map(chat => (
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

      {/* RIGHT MAIN: Chat Window (flex-1) */}
      <div className="flex-1 flex flex-col h-full bg-surface-color">
        {activeData ? (
          <>
            {/* Window Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between bg-surface-color shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${activeData.avatar} ${activeData.type === 'group' && 'rounded-xl'}`}></div>
                <div>
                  <h3 className="font-bold">{activeData.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    {activeData.isLive ? (
                      <span className="text-red-500 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Now</span>
                    ) : (
                      <span className="text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-4 text-text-muted">
                {activeData.type === 'group' && (
                  <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-500 font-medium rounded-lg hover:bg-primary-500/20 transition-colors text-sm">
                    <Disc3 size={16} /> Start Live Room
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block"><Phone size={18} /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block"><Video size={18} /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><Info size={18} /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat bg-[length:100px] dark:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:opacity-20 relative">
              <div className="absolute inset-0 bg-surface-color opacity-95 dark:opacity-90 point-events-none" />
              
              <div className="relative z-10 space-y-6">
                {MESSAGES.map(msg => (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    {!msg.isMe && (
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${msg.avatar} shadow-sm self-end`} />
                    )}
                    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      {!msg.isMe && <span className="text-[10px] text-text-muted ml-1 mb-1">{msg.user}</span>}
                      
                      {/* Normal Text Message */}
                      {msg.text && (
                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${msg.isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-text-color rounded-bl-sm'}`}>
                          {msg.text}
                        </div>
                      )}

                      {/* Embed Audio/Book */}
                      {msg.media && (
                        <div className={`mt-1 bg-surface-color border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex gap-3 shadow-md w-64 ${msg.isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                          <div className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden ${msg.media.cover}`}>
                            <div className="absolute inset-0 bg-black/20" />
                            {msg.type === 'audio' ? <Disc3 size={24} className="text-white z-10 opacity-50" /> : <BookOpen size={24} className="text-white z-10 opacity-50" />}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="font-bold text-sm truncate">{msg.media.title}</p>
                            <p className="text-[10px] text-text-muted truncate">{msg.type === 'audio' ? msg.media.artist : msg.media.author}</p>
                            {msg.type === 'audio' && (
                              <button 
                                onClick={() => setPlayingId(playingId === msg.id ? null : msg.id)}
                                className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center mt-1 hover:bg-primary-600 transition-colors"
                              >
                                {playingId === msg.id ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-0.5" />}
                              </button>
                            )}
                            {msg.type === 'book' && (
                              <button className="text-[10px] font-bold text-orange-500 mt-1 hover:underline">View Book</button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-surface-color">
              <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 pb-2">
                <button className="p-2 text-gray-500 hover:text-primary-500 transition-colors shrink-0">
                  <Plus size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-primary-500 transition-colors shrink-0">
                  <Image size={20} />
                </button>
                <textarea 
                  rows="1"
                  placeholder={`Message ${activeData.name}...`}
                  className="w-full bg-transparent border-none outline-none resize-none py-2 text-sm text-text-color custom-scrollbar max-h-32"
                />
                <button className="p-2 text-gray-500 hover:text-primary-500 transition-colors shrink-0">
                  <Smile size={20} />
                </button>
                <button className="p-2 mx-1 mb-0.5 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform">
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center flex-col text-text-muted">
             <MessageSquare size={48} className="mb-4 opacity-20" />
             <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;
