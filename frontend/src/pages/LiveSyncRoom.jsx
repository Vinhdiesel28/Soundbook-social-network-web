import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, Users, MessageSquare, Heart, Settings, Plus, List, MoreHorizontal } from 'lucide-react';
import RoomHeader from '../components/livesync/RoomHeader';
import VisualizerCover from '../components/livesync/VisualizerCover';
import TransportControls from '../components/livesync/TransportControls';
import RoomChat from '../components/livesync/RoomChat';
import RoomQueue from '../components/livesync/RoomQueue';
import RoomMembers from '../components/livesync/RoomMembers';
import { useLanguage } from '../context/LanguageContext';

const QUEUE = [
  { id: 1, title: 'In love', artist: 'Low G (ft. JustaTee)', cover: 'bg-gradient-to-br from-red-500 to-black', duration: '3:50', votes: 12 },
  { id: 2, title: 'Na na na', artist: 'Daux Mysie', cover: 'bg-gradient-to-br from-red-600 to-yellow-500', duration: '3:20', votes: 8 },
  { id: 3, title: 'Âm thầm bên em', artist: 'Sơn Tùng M-TP', cover: 'bg-gradient-to-br from-indigo-500 to-purple-600', duration: '4:03', votes: 5 },
];

const MEMBERS = [
  { id: 1, name: 'Đạt Nguyễn', avatar: 'bg-orange-500', isHost: true },
  { id: 2, name: 'Mai Linh', avatar: 'bg-pink-500', isHost: false },
  { id: 3, name: 'Minh Tuấn', avatar: 'bg-green-500', isHost: false },
  { id: 4, name: 'Bảo Trâm', avatar: 'bg-purple-500', isHost: false },
];

const CHAT = [
  { id: 1, user: 'Mai Linh', text: 'Đoạn intro này đỉnh quá!' },
  { id: 2, user: 'Minh Tuấn', text: 'Bật to lên anh em!!' },
  { id: 3, user: 'Đạt Nguyễn', text: 'Cháy hơn phi phai.' },
];

const LiveSyncRoom = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [activeRightPanel, setActiveRightPanel] = useState('chat');

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">

      {/* Media Player */}
      <div className="flex-1 lg:w-[65%] flex flex-col gap-6 h-full">

        {/* Main */}
        <div className="flex-1 bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col relative">

          <RoomHeader membersCount={MEMBERS.length} />

          <VisualizerCover isPlaying={isPlaying} />

          <TransportControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />
        </div>

        {/* Queue */}
        <div className="hidden lg:flex items-center justify-between bg-surface-color rounded-xl p-3 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md ${QUEUE[1].cover}`}></div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">{t('room.up_next')}</p>
              <p className="text-sm font-bold truncate">{QUEUE[1].title} • <span className="text-text-muted font-normal">{QUEUE[1].artist}</span></p>
            </div>
          </div>
          <button
            onClick={() => setActiveRightPanel('queue')}
            className="text-xs font-semibold px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {t('room.view_queue')}
          </button>
        </div>

      </div>

      <div className="flex-1 lg:w-[35%] bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full overflow-hidden">

        {/* Panel */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveRightPanel('chat')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeRightPanel === 'chat' ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <MessageSquare size={16} /> {t('room.chat')}
          </button>
          <button
            onClick={() => setActiveRightPanel('queue')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeRightPanel === 'queue' ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <List size={16} /> {t('room.queue')}
          </button>
          <button
            onClick={() => setActiveRightPanel('members')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeRightPanel === 'members' ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <Users size={16} /> {MEMBERS.length}
          </button>
        </div>

        {/* Panel Content */}
        {activeRightPanel === 'chat' && (
          <RoomChat
            chatMessages={CHAT}
            chatInput={chatInput}
            setChatInput={setChatInput}
          />
        )}
        {activeRightPanel === 'queue' && <RoomQueue queue={QUEUE} />}
        {activeRightPanel === 'members' && <RoomMembers members={MEMBERS} />}

      </div>
    </div>
  );
};

export default LiveSyncRoom;
