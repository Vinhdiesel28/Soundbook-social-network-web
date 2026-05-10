import React, { useState, useEffect } from 'react';
import { Search, Ban, Eye, X, Users, MessageSquare, ListMusic, Trash2 } from 'lucide-react';
import { getRooms, endRoom, getRoomById, getRoomMembers, removeRoomMember, getRoomMessages, deleteRoomMessage, getRoomQueue, removeRoomQueueItem } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminRooms = ({ t, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);
  const { showToast, confirm } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [queue, setQueue] = useState([]);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'members', 'messages', 'queue'

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery || '');
    }
  }, [initialSearchQuery]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms();
      if (res.data && res.data.content) {
        setRooms(res.data.content);
      } else if (res.data && Array.isArray(res.data)) {
        setRooms(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndRoom = async (id) => {
    const ok = await confirm({
      title: 'Kết thúc phòng',
      message: 'Bạn có chắc chắn muốn KẾT THÚC phòng này? Hành động này không thể hoàn tác.',
      confirmText: 'Kết thúc',
      cancelText: 'Hủy'
    });

    if (ok) {
      try {
        await endRoom(id);
        showToast('Đã kết thúc phòng', 'success');
        fetchRooms();
        if (selectedRoomId === id) setShowDetailModal(false);
      } catch (error) {
        console.error("Failed to end room:", error);
        showToast('Lỗi khi kết thúc phòng', 'error');
      }
    }
  };

  const handleViewDetail = async (id) => {
    try {
      setSelectedRoomId(id);
      setActiveTab('info');
      const [roomRes, membersRes, messagesRes, queueRes] = await Promise.all([
        getRoomById(id),
        getRoomMembers(id).catch(() => ({ data: { content: [] } })),
        getRoomMessages(id).catch(() => ({ data: { content: [] } })),
        getRoomQueue(id).catch(() => ({ data: { content: [] } }))
      ]);
      setDetailRoom(roomRes.data);
      setMembers(membersRes.data?.content || []);
      setMessages(messagesRes.data?.content || []);
      setQueue(queueRes.data?.content || []);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
      showToast('Lỗi lấy chi tiết phòng', 'error');
    }
  };

  const handleKickMember = async (userId) => {
    const ok = await confirm({
      title: 'Kick & Ban',
      message: 'Bạn có chắc muốn KICK và BAN người dùng này khỏi phòng?',
      confirmText: 'Xác nhận',
      cancelText: 'Hủy'
    });

    if (ok) {
      try {
        await removeRoomMember(selectedRoomId, userId);
        showToast('Đã kick người dùng', 'success');
        const res = await getRoomMembers(selectedRoomId);
        setMembers(res.data?.content || []);
      } catch (e) {
        console.error(e);
        showToast('Lỗi kick người dùng', 'error');
      }
    }
  };

  const handleDeleteMessage = async (msgId) => {
    const ok = await confirm({
      title: 'Xóa tin nhắn',
      message: 'Bạn có chắc chắn muốn XÓA tin nhắn này?',
      confirmText: 'Xóa',
      cancelText: 'Hủy'
    });

    if (ok) {
      try {
        await deleteRoomMessage(msgId);
        showToast('Đã xóa tin nhắn', 'success');
        const res = await getRoomMessages(selectedRoomId);
        setMessages(res.data?.content || []);
      } catch (e) {
        console.error(e);
        showToast('Lỗi khi xóa tin nhắn', 'error');
      }
    }
  };

  const handleRemoveQueueItem = async (queueId) => {
    if (window.confirm("Bạn có chắc muốn XÓA bài hát này khỏi hàng đợi?")) {
      try {
        await removeRoomQueueItem(queueId);
        const res = await getRoomQueue(selectedRoomId);
        setQueue(res.data?.content || []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300 relative">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.rooms') || 'Quản lý Phòng'}</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo host hoặc tên phòng..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-text-muted border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4 font-medium">{t('admin.table.room_host')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.room_title')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.listeners')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.status')}</th>
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? <tr><td colSpan="5" className="text-center py-4 text-gray-500">Loading...</td></tr> : rooms.length === 0 ? <tr><td colSpan="5" className="text-center py-4 text-gray-500">No rooms found</td></tr> : rooms.filter(room => 
              room.id?.toString() === searchQuery ||
              (room.hostName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
              (room.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            ).map(room => (
              <tr key={room.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-500 overflow-hidden flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">{room.hostName?.[0] || 'H'}</span>
                  </div>
                  {room.hostName || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-sm">{room.name}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{room.memberCount || 0}</td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    room.status === 'LIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {room.status || 'LIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button onClick={() => handleViewDetail(room.id)} className="p-1 hover:text-blue-500" title="View Detail"><Eye size={16} /></button>
                    {room.status === 'LIVE' && (
                      <button onClick={() => handleEndRoom(room.id)} className="p-1 hover:text-red-500" title="End Room"><Ban size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && detailRoom && detailRoom.info && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface-color w-full max-w-3xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold">Chi tiết Phòng: {detailRoom.info.name}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-text-muted hover:text-text-color"><X size={20} /></button>
            </div>
            
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0">
              <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Thông tin</button>
              <button onClick={() => setActiveTab('members')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'members' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}><Users size={16} /> Thành viên ({members.length})</button>
              <button onClick={() => setActiveTab('messages')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'messages' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}><MessageSquare size={16} /> Chat ({messages.length})</button>
              <button onClick={() => setActiveTab('queue')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'queue' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}><ListMusic size={16} /> Hàng đợi ({queue.length})</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm font-semibold mb-1 text-text-muted">Host</p>
                      <p className="font-bold text-lg text-primary-500">{detailRoom.info.hostName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm font-semibold mb-1 text-text-muted">Chủ đề</p>
                      <p className="font-bold text-lg">{detailRoom.info.topic || 'Không có'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Trạng thái</p>
                      <p className={`font-bold ${detailRoom.info.status === 'LIVE' ? 'text-green-500' : ''}`}>{detailRoom.info.status}</p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Quyền truy cập</p>
                      <p className="font-bold">{detailRoom.info.isPublic ? 'Công khai' : 'Riêng tư'}</p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Thành viên</p>
                      <p className="font-bold">{detailRoom.info.memberCount} người</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <h4 className="font-bold mb-3 border-b border-gray-100 pb-2">Trạng thái phát nhạc</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Đang phát: </span>
                        <span className="font-bold">{detailRoom.isPlaying ? 'Có' : 'Không'}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Track ID: </span>
                        <span className="font-mono text-xs bg-gray-100 px-1 rounded">{detailRoom.currentTrackId || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Vị trí (ms): </span>
                        <span>{detailRoom.positionMs} ms</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Cập nhật lúc: </span>
                        <span>{detailRoom.lastUpdatedAt || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-2">
                  {members.length === 0 ? <p className="text-center text-gray-500 py-4">Không có dữ liệu</p> : members.map(m => (
                    <div key={m.userId} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{m.displayName}</p>
                        <p className="text-xs text-text-muted">Vai trò: <span className={m.role === 'HOST' ? 'text-primary-500 font-bold' : ''}>{m.role}</span> {m.isBanned && <span className="text-red-500 font-bold">(BANNED)</span>}</p>
                      </div>
                      {/* Kick/Ban button removed */}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-2">
                  {messages.length === 0 ? <p className="text-center text-gray-500 py-4">Không có tin nhắn</p> : messages.map(m => (
                    <div key={m.id} className="flex flex-col p-3 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-primary-500">{m.senderName}</p>
                        <span className="text-xs text-text-muted">{new Date(m.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-sm">{m.contentText}</p>
                        {/* Delete message button removed */}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'queue' && (
                <div className="space-y-2">
                  {queue.length === 0 ? <p className="text-center text-gray-500 py-4">Hàng đợi trống</p> : queue.map((q, idx) => {
                    let trackName = q.trackId;
                    let artistName = '';
                    try {
                      if (q.trackPayloadJson) {
                        const payload = JSON.parse(q.trackPayloadJson);
                        trackName = payload.title || payload.name || payload.trackTitle || q.trackId;
                        artistName = payload.artist || payload.singer || payload.channelTitle || '';
                      }
                    } catch(e) {}
                    return (
                      <div key={q.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-400 w-4 text-center">{idx + 1}</span>
                          <div>
                            <p className="font-bold text-sm">{trackName}</p>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              {artistName && <span>{artistName} • </span>}
                              <span>Thêm bởi: {q.addedByName}</span>
                            </div>
                          </div>
                        </div>
                        {/* Remove from queue button removed */}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 flex gap-3 justify-end bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              {detailRoom.info.status === 'LIVE' && (
                <button onClick={() => handleEndRoom(detailRoom.info.id)} className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-semibold text-sm transition-colors">
                  Đóng phòng (End Room)
                </button>
              )}
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
