import React from 'react';
import { Disc3, BookOpen, Pause, Play } from 'lucide-react';

const ChatMessage = ({ msg, playingId, setPlayingId }) => {
  return (
    <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
      {!msg.isMe && (
        <div className={`w-8 h-8 rounded-full flex-shrink-0 ${msg.avatar} shadow-sm self-end`} />
      )}
      <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
        {!msg.isMe && <span className="text-[10px] text-text-muted ml-1 mb-1">{msg.user}</span>}

        {/* Message */}
        {msg.text && (
          <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${msg.isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-text-color rounded-bl-sm'}`}>
            {msg.text}
          </div>
        )}

        {/* Audio/Book */}
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
  );
};

export default ChatMessage;
