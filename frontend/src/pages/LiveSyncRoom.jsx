import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, Users, MessageSquare, Heart, Settings, Plus, List, MoreHorizontal } from 'lucide-react';

const QUEUE = [
  { id: 1, title: 'Starboy', artist: 'The Weeknd', cover: 'bg-gradient-to-br from-red-500 to-black', duration: '3:50', votes: 12 },
  { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', cover: 'bg-gradient-to-br from-red-600 to-yellow-500', duration: '3:20', votes: 8 },
  { id: 3, title: 'Midnight City', artist: 'M83', cover: 'bg-gradient-to-br from-indigo-500 to-purple-600', duration: '4:03', votes: 5 },
];

const MEMBERS = [
  { id: 1, name: 'Dat Nguyen (Host)', avatar: 'bg-orange-500', isHost: true },
  { id: 2, name: 'Sarah', avatar: 'bg-pink-500', isHost: false },
  { id: 3, name: 'Mike', avatar: 'bg-green-500', isHost: false },
  { id: 4, name: 'Emma', avatar: 'bg-purple-500', isHost: false },
];

const CHAT = [
  { id: 1, user: 'Sarah', text: 'This intro is so good 🔥' },
  { id: 2, user: 'Mike', text: 'Turn it up!!' },
  { id: 3, user: 'Dat Nguyen', text: 'Next song is a banger, trust me.' },
];

const LiveSyncRoom = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [activeRightPanel, setActiveRightPanel] = useState('chat'); // 'chat' | 'queue' | 'members'
  
  // Fake visualizer bars
  const bars = Array.from({ length: 40 });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* LEFT PANEL: Media Player (65%) */}
      <div className="flex-1 lg:w-[65%] flex flex-col gap-6 h-full">
        
        {/* Main Player Area */}
        <div className="flex-1 bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col relative">
          
          {/* Room Header Overlay */}
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
            <div className="text-white">
              <h2 className="font-bold text-lg drop-shadow-md">Midnight Vibes 🎧</h2>
              <p className="text-xs text-white/80 drop-shadow-md flex items-center gap-1">
                <Users size={12} /> {MEMBERS.length} listening
              </p>
            </div>
            <button className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors">
              <Settings size={18} />
            </button>
          </div>

          {/* Album Cover & Visualizer */}
          <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden w-full">
            {/* Blurry Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-black opacity-40 blur-3xl scale-125" />
            
            {/* Spinning Vinyl Cover */}
            <div className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-2xl z-10 border-4 border-gray-800 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
               <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-black rounded-full" />
               <div className="absolute inset-1/3 bg-black rounded-full border border-gray-700 flex items-center justify-center">
                 <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600" />
               </div>
            </div>

            {/* Visualizer Waves */}
            <div className="absolute bottom-10 left-0 w-full flex items-end justify-center gap-1 z-0 px-4 opacity-50">
              {bars.map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 bg-primary-500 rounded-t-sm transition-all duration-75"
                  style={{ 
                    height: isPlaying ? `${Math.random() * 60 + 10}px` : '10px',
                    opacity: isPlaying ? Math.random() * 0.5 + 0.5 : 0.3
                  }}
                />
              ))}
            </div>
            
            {/* Floating Hearts Animation (Simulated) */}
            {isPlaying && (
              <div className="absolute bottom-20 right-20 text-rose-500 animate-[bounce_2s_infinite] opacity-50">
                <Heart size={24} fill="currentColor" />
              </div>
            )}
          </div>

          {/* Transport Controls */}
          <div className="px-6 py-4 bg-surface-color border-t border-gray-200 dark:border-gray-800 z-10 w-full">
            <div className="flex flex-col gap-3">
              {/* Progress */}
              <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
                <span>1:24</span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full cursor-pointer overflow-hidden relative group">
                  <div className="absolute top-0 left-0 h-full bg-primary-500 w-1/3 group-hover:bg-primary-400" />
                </div>
                <span>3:50</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-text-muted">
                  <button className="hover:text-primary-500 transition-colors"><Volume2 size={20} /></button>
                </div>
                
                <div className="flex items-center gap-6">
                  <button className="text-text-muted hover:text-text-color transition-colors"><SkipBack size={24} fill="currentColor" /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary-500/30"
                  >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                  <button className="text-text-muted hover:text-text-color transition-colors"><SkipForward size={24} fill="currentColor" /></button>
                </div>

                <div className="flex items-center gap-4 text-text-muted">
                  <button className="hover:text-primary-500 transition-colors"><Maximize2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Up Next / Queue Snippet (Only visible on large screens to save space) */}
        <div className="hidden lg:flex items-center justify-between bg-surface-color rounded-xl p-3 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md ${QUEUE[1].cover}`}></div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Up Next</p>
              <p className="text-sm font-bold truncate">{QUEUE[1].title} • <span className="text-text-muted font-normal">{QUEUE[1].artist}</span></p>
            </div>
          </div>
          <button 
            onClick={() => setActiveRightPanel('queue')}
            className="text-xs font-semibold px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            View Queue
          </button>
        </div>

      </div>

      {/* RIGHT PANEL: Chat / Queue / Members (35%) */}
      <div className="flex-1 lg:w-[35%] bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Panel Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setActiveRightPanel('chat')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeRightPanel === 'chat' ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <MessageSquare size={16} /> Chat
          </button>
          <button 
            onClick={() => setActiveRightPanel('queue')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeRightPanel === 'queue' ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <List size={16} /> Queue
          </button>
          <button 
            onClick={() => setActiveRightPanel('members')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeRightPanel === 'members' ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <Users size={16} /> {MEMBERS.length}
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 dark:bg-black/10">
          
          {/* Chat View */}
          {activeRightPanel === 'chat' && (
            <div className="flex flex-col gap-4 min-h-full">
              <div className="mt-auto space-y-4">
                {CHAT.map((msg) => (
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
          )}

          {/* Queue View */}
          {activeRightPanel === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">Now Playing</h3>
              </div>
              <div className="flex items-center gap-3 p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
                <div className={`w-12 h-12 rounded-lg ${QUEUE[0].cover} shadow-md flex items-center justify-center`}>
                  <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-primary-500">{QUEUE[0].title}</p>
                  <p className="text-xs text-text-muted">{QUEUE[0].artist}</p>
                </div>
                <div className="text-xs text-text-muted pr-2">{QUEUE[0].duration}</div>
              </div>

              <div className="flex items-center justify-between mt-6 mb-2">
                <h3 className="font-bold text-sm">Up Next</h3>
                <button className="text-xs text-primary-500 font-semibold hover:underline">Add Song</button>
              </div>
              <div className="space-y-2">
                {QUEUE.slice(1).map((song) => (
                  <div key={song.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group">
                    <div className={`w-10 h-10 rounded-lg ${song.cover}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{song.title}</p>
                      <p className="text-xs text-text-muted">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md">
                        <Plus size={14} />
                      </button>
                      <span className="text-xs font-medium text-text-muted w-4 text-center">{song.votes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members View */}
          {activeRightPanel === 'members' && (
            <div className="space-y-3">
              {MEMBERS.map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${member.avatar} relative`}>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-surface-color" />
                    </div>
                    <span className="font-medium text-sm">{member.name} {member.isHost && '👑'}</span>
                  </div>
                  <button className="text-text-muted hover:text-text-color">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))}
              <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-text-muted hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Invite Friends
              </button>
            </div>
          )}

        </div>

        {/* Chat Input (Only visible in chat tab) */}
        {activeRightPanel === 'chat' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-surface-color">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something nice..."
                className="w-full bg-gray-100 dark:bg-gray-800 border-none outline-none rounded-full py-2.5 pl-4 pr-12 text-sm text-text-color placeholder-gray-500"
              />
              <button className="absolute right-1 top-1 bottom-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Heart size={14} fill="currentColor" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LiveSyncRoom;
