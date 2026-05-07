import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, MessageSquare, Undo2, Ban } from 'lucide-react';
import { getDmThreads, getDmThreadMessages, deleteDmMessage, deleteDmMessageForEveryone } from '../../services/adminApi';

const AdminMessages = ({ t, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery || '');
    }
  }, [initialSearchQuery]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await getDmThreads();
      if (res.data && res.data.content) {
        setThreads(res.data.content);
      } else if (res.data && Array.isArray(res.data)) {
        setThreads(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (thread) => {
    setSelectedThread(thread);
    setShowDetailModal(true);
    fetchMessages(thread.id);
  };

  const fetchMessages = async (threadId) => {
    try {
      setLoadingMessages(true);
      const res = await getDmThreadMessages(threadId);
      // Reverse array so oldest is top, newest is bottom if needed, or keep as is.
      // Usually chat history is newest at bottom, so if backend returns newest first, we reverse.
      // Assuming backend returns newest first.
      const msgs = res.data?.content || [];
      setMessages([...msgs].reverse());
    } catch (error) {
      console.error(error);
      alert('Lỗi tải tin nhắn');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (window.confirm("Bạn có chắc chắn muốn XÓA VĨNH VIỄN tin nhắn này khỏi cơ sở dữ liệu?")) {
      try {
        await deleteDmMessage(msgId);
        fetchMessages(selectedThread.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRecallMessage = async (msgId) => {
    if (window.confirm("Bạn muốn THU HỒI tin nhắn này đối với tất cả người dùng trong hội thoại?")) {
      try {
        await deleteDmMessageForEveryone(msgId);
        fetchMessages(selectedThread.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300 relative">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.messages') || 'Quản lý Tin nhắn'}</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm theo tên người dùng..." 
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
              <th className="px-6 py-4 font-medium">Người dùng 1</th>
              <th className="px-6 py-4 font-medium">Người dùng 2</th>
              <th className="px-6 py-4 font-medium">Thông tin</th>
              <th className="px-6 py-4 font-medium">Cập nhật lúc</th>
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions') || 'Thao tác'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? <tr><td colSpan="5" className="text-center py-4 text-gray-500">Loading...</td></tr> : threads.length === 0 ? <tr><td colSpan="5" className="text-center py-4 text-gray-500">Không tìm thấy hội thoại</td></tr> : threads.filter(thread => 
              thread.id?.toString() === searchQuery ||
              (thread.user1Name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
              (thread.user2Name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            ).map(thread => (
              <tr key={thread.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-bold text-sm text-primary-500">{thread.user1Name || 'Unknown'}</td>
                <td className="px-6 py-4 font-bold text-sm text-green-500">{thread.user2Name || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm text-text-muted flex items-center gap-2"><MessageSquare size={14} /> Hội thoại #{thread.id}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{new Date(thread.updatedAt || thread.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button onClick={() => handleViewDetail(thread)} className="p-1.5 bg-gray-100 hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-primary-900/20 hover:text-primary-500 rounded-lg transition-colors" title="Xem tin nhắn"><Eye size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL (MESSAGES VIEWER) */}
      {showDetailModal && selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className="bg-surface-color w-full max-w-4xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col h-full max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-black tracking-tight">Chi tiết hội thoại #{selectedThread.id}</h3>
                <p className="text-sm font-semibold text-text-muted mt-0.5">Giữa <span className="text-primary-500">{selectedThread.user1Name}</span> và <span className="text-green-500">{selectedThread.user2Name}</span></p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-text-muted hover:text-text-color hover:bg-gray-50 transition-colors"><X size={20} /></button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50 space-y-4 custom-scrollbar">
              {loadingMessages ? (
                <p className="text-center text-text-muted py-10 font-medium">Đang tải tin nhắn...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-text-muted py-10 font-medium">Chưa có tin nhắn nào</p>
              ) : (
                messages.map(msg => {
                  const isUser1 = msg.senderId === selectedThread.user1Id;
                  const isDeleted = msg.deletedForEveryone;

                  return (
                    <div key={msg.id} className={`flex w-full ${isUser1 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] flex flex-col gap-1 ${isUser1 ? 'items-start' : 'items-end'}`}>
                        {/* Sender Name */}
                        <span className="text-[11px] font-bold text-gray-400 mx-1">{msg.senderName}</span>
                        
                        {/* Bubble */}
                        <div className={`group relative flex items-center gap-2 ${isUser1 ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl relative ${isDeleted ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 italic' : (isUser1 ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-color' : 'bg-primary-500 text-white shadow-md shadow-primary-500/20')} ${isUser1 ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}>
                            {isDeleted ? (
                              <span className="flex items-center gap-2 text-sm"><Ban size={14} /> Tin nhắn đã bị thu hồi</span>
                            ) : (
                              <p className="text-sm break-words whitespace-pre-wrap">{msg.contentText || <span className="italic opacity-80">[Loại tin nhắn: {msg.messageType}]</span>}</p>
                            )}
                          </div>
                          
                          {/* Admin Actions (Visible on hover) */}
                          <div className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity ${isUser1 ? 'flex-row' : 'flex-row-reverse'}`}>
                            {!isDeleted && (
                              <button onClick={() => handleRecallMessage(msg.id)} className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/20 transition-colors" title="Thu hồi tin nhắn">
                                <Undo2 size={13} />
                              </button>
                            )}
                            <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors" title="Xóa vĩnh viễn">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Time */}
                        <span className="text-[10px] font-semibold text-gray-400 mx-1">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900 rounded-b-2xl flex items-center justify-between">
              <p className="text-xs text-text-muted">Admin chỉ có quyền thu hồi hoặc xóa tin nhắn do vi phạm. <strong className="text-red-500">Xóa vĩnh viễn</strong> sẽ xóa hoàn toàn khỏi DB.</p>
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
