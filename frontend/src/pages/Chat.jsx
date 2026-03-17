import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

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
  const { t } = useLanguage();
  const [activeChat, setActiveChat] = useState(1);
  const [playingId, setPlayingId] = useState(null);

  const activeData = CHATS.find(c => c.id === activeChat);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

      {/* LEFT SIDEBAR: Chat List (320px) */}
      <ChatList 
        t={t} 
        chats={CHATS} 
        activeChat={activeChat} 
        setActiveChat={setActiveChat} 
      />

      {/* RIGHT MAIN: Chat Window (flex-1) */}
      <ChatWindow 
        t={t} 
        activeData={activeData} 
        messages={MESSAGES} 
        playingId={playingId} 
        setPlayingId={setPlayingId} 
      />

    </div>
  );
};

export default Chat;
