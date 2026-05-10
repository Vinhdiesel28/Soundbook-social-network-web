import React, { useEffect, useRef, useState } from 'react';
import { Info, MoreVertical, Disc3, Plus, Image, Smile, Send, MessageSquare, Flag } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ReportModal from '../common/ReportModal';

const ChatWindow = ({
  t,
  activeData,
  messages,
  playingId,
  setPlayingId,
  draftMessage,
  setDraftMessage,
  onSendMessage,
  isSending,
  isLoadingMessages,
}) => {
  const messagesContainerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const scrollElement = messagesContainerRef.current.parentElement;
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 0);
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-color">
      {activeData ? (
        <>
          {/* Window */}
          <div className="h-16 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between bg-surface-color shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${activeData.avatar} ${activeData.type === 'group' && 'rounded-xl'}`}></div>
              <div>
                <h3 className="font-bold">{activeData.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  {activeData.isLive ? (
                    <span className="text-red-500 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> {t('chat.live_now')}</span>
                  ) : (
                    <span className="text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {t('chat.online')}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-4 text-text-muted">
              {activeData.type === 'group' && (
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-500 font-medium rounded-lg hover:bg-primary-500/20 transition-colors text-sm">
                  <Disc3 size={16} /> {t('chat.start_live_room')}
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><Info size={18} /></button>
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(m => !m)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1 z-50">
                    <button 
                      onClick={() => { setShowMenu(false); setIsReportModalOpen(true); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Flag size={16} /> Báo cáo tin nhắn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ReportModal 
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            type="USER"
            targetId={activeData.userId}
          />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat bg-[length:100px] relative">
            <div ref={messagesContainerRef} className="min-h-full bg-white/95 dark:bg-[#121212]/95 px-6 py-6 space-y-6 flex flex-col justify-end">
              {isLoadingMessages ? (
                <div className="text-sm text-text-muted">Đang tải tin nhắn...</div>
              ) : (
                messages.map(msg => (
                  <ChatMessage
                    key={msg.id}
                    msg={msg}
                    playingId={playingId}
                    setPlayingId={setPlayingId}
                    isUserOnline={!msg.isMe}
                  />
                ))
              )}
            </div>
          </div>

          {/* Input */}
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
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                placeholder={`${t('chat.message_placeholder')} ${activeData.name}...`}
                className="w-full bg-transparent border-none outline-none resize-none py-2 text-sm text-text-color custom-scrollbar max-h-32"
              />
              <button className="p-2 text-gray-500 hover:text-primary-500 transition-colors shrink-0">
                <Smile size={20} />
              </button>
              <button
                onClick={onSendMessage}
                disabled={isSending || !draftMessage.trim()}
                className="p-2 mx-1 mb-0.5 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center flex-col text-text-muted">
          <MessageSquare size={48} className="mb-4 opacity-20" />
          <p>{t('chat.select_chat')}</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
