import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const CHATS = [
  { id: 1, name: 'Đạt Nguyễn', type: 'direct', avatar: 'bg-orange-500', unread: 2, lastMsg: 'Đợi đến khi ông nghe bài này...', time: '10:42 SA', isLive: true },
  { id: 2, name: 'Hội Indie 🎸', type: 'group', avatar: 'bg-indigo-500', unread: 0, lastMsg: 'Mai Linh: Vừa đọc xong cuốn Dune!', time: 'Hôm qua' },
  { id: 3, name: 'Chill cùng Synthwave', type: 'group', avatar: 'bg-purple-600', unread: 5, lastMsg: 'Minh Tuấn đã bắt đầu một Phòng Nghe chung', time: 'Thứ Ba', isLive: true },
  { id: 4, name: 'Bảo Trâm', type: 'direct', avatar: 'bg-pink-500', unread: 0, lastMsg: 'Cảm ơn vì lời giới thiệu nhé', time: 'Thứ Hai' },
];

const MESSAGES = [
  { id: 1, user: 'Đạt Nguyễn', isMe: false, text: 'Ê! Ông nghe thử album tôi gửi chưa?', time: '10:30 SA', avatar: 'bg-orange-500' },
  { id: 2, user: 'Tôi', isMe: true, text: 'Nghe rồi! Bản phối đỉnh thật sự. Nhất là bài số 3.', time: '10:35 SA' },
  { id: 3, user: 'Đạt Nguyễn', isMe: false, text: 'Đúng không?? Đợi đến khi ông nghe bài này...', time: '10:42 SA', avatar: 'bg-orange-500' },
  {
    id: 4,
    user: 'Đạt Nguyễn',
    isMe: false,
    type: 'audio',
    media: { title: 'Na na na', artist: 'Daux Mysie', cover: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500' },
    time: '10:43 SA',
    avatar: 'bg-orange-500'
  },
  {
    id: 5,
    user: 'Tôi',
    isMe: true,
    type: 'book',
    text: 'Quá đỉnh! Nhân tiện đang chia sẻ đồ hay, ông phải đọc thử cuốn này:',
    media: { title: 'Lịch sử Đảng Cộng Sản Việt Nam', author: 'PTIT', cover: 'bg-gray-800' },
    time: '10:45 SA'
  }
];

const Chat = () => {
  const { t } = useLanguage();
  const [activeChat, setActiveChat] = useState(1);
  const [playingId, setPlayingId] = useState(null);

  const activeData = CHATS.find(c => c.id === activeChat);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

      <ChatList
        t={t}
        chats={CHATS}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

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
