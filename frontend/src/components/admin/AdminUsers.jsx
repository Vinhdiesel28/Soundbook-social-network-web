import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit, Eye, Trash2, X } from 'lucide-react';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../services/adminApi';

const AdminUsers = ({ t, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '', role: 'USER', status: 'ACTIVE', removeAvatar: false, removeCover: false, removeBio: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery || '');
    }
  }, [initialSearchQuery]);

  const fetchUsers = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getUsers({ page, size: 10, keyword: searchQuery });
      const payloadData = res.data || res;
      if (payloadData && payloadData.content) {
        setUsers(payloadData.content);
        setTotalPages(payloadData.totalPages || 1);
        setTotalElements(payloadData.totalElements || 0);
        setCurrentPage(page);
      } else if (Array.isArray(payloadData)) {
        setUsers(payloadData);
        setTotalPages(1);
        setTotalElements(payloadData.length);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getUserById(id);
      setDetailUser(res.data || res);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
      alert('Lỗi lấy thông tin chi tiết');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      removeAvatar: false,
      removeCover: false,
      removeBio: false
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setFormData({ email: '', password: '', displayName: '', role: 'USER', status: 'ACTIVE' });
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser(formData);
      setShowCreateModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Lỗi tạo người dùng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(selectedUser.id, {
        displayName: formData.displayName,
        role: formData.role,
        status: formData.status,
        removeAvatar: formData.removeAvatar,
        removeCover: formData.removeCover,
        removeBio: formData.removeBio
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Lỗi cập nhật');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.users')}</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder={t('admin.search_users')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <button onClick={openCreateModal} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold shrink-0">
            {t('admin.action.add_user')}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-text-muted border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4 font-medium">{t('admin.table.user_name')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.email')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.role')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.status')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.joined')}</th>
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? <tr><td colSpan="6" className="text-center py-4 text-gray-500">Loading...</td></tr> : users.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-gray-500">No users found</td></tr> : users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500 overflow-hidden flex items-center justify-center shrink-0">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-white text-xs font-bold">{user.displayName?.[0] || 'U'}</span>}
                  </div>
                  {user.displayName}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                <td className="px-6 py-4 text-sm">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    user.status === 'BANNED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {user.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button onClick={() => handleViewDetail(user.id)} className="p-1 hover:text-blue-500"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(user)} className="p-1 hover:text-green-500"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(user.id)} className="p-1 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-text-muted">Tổng cộng {totalElements} người dùng</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => fetchUsers(currentPage - 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 rounded text-sm font-medium transition-colors"
            >
              Trang trước
            </button>
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span>Trang</span>
              <input 
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                key={currentPage}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(e.currentTarget.value);
                    if (val >= 1 && val <= totalPages) fetchUsers(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.currentTarget.value);
                  if (val >= 1 && val <= totalPages && val !== currentPage) fetchUsers(val);
                  else e.currentTarget.value = currentPage;
                }}
                className="w-12 py-0.5 text-center border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span>/ {totalPages}</span>
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => fetchUsers(currentPage + 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 rounded text-sm font-medium transition-colors"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface-color w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Thêm người dùng mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-text-color"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Mật khẩu</label>
                <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Tên hiển thị</label>
                <input type="text" required value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Vai trò</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500">
                    <option value="USER">USER</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BANNED">BANNED</option>
                  </select>
                </div>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-sm mt-2 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface-color w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Cập nhật người dùng</h3>
              <button onClick={() => setShowEditModal(false)} className="text-text-muted hover:text-text-color"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Email (Không thể sửa)</label>
                <input type="email" disabled value={formData.email} className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Tên hiển thị</label>
                <input type="text" required value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Vai trò</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500">
                    <option value="USER">USER</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BANNED">BANNED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-text-muted">Xóa dữ liệu vi phạm</p>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-red-500 transition-colors">
                  <input type="checkbox" checked={formData.removeAvatar} onChange={e => setFormData({...formData, removeAvatar: e.target.checked})} className="rounded text-red-500 focus:ring-red-500" />
                  Xóa ảnh đại diện
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-red-500 transition-colors">
                  <input type="checkbox" checked={formData.removeCover} onChange={e => setFormData({...formData, removeCover: e.target.checked})} className="rounded text-red-500 focus:ring-red-500" />
                  Xóa ảnh bìa
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-red-500 transition-colors">
                  <input type="checkbox" checked={formData.removeBio} onChange={e => setFormData({...formData, removeBio: e.target.checked})} className="rounded text-red-500 focus:ring-red-500" />
                  Xóa tiểu sử (Bio)
                </label>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm mt-2 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface-color w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Chi tiết người dùng</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-text-muted hover:text-text-color"><X size={20} /></button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-500 overflow-hidden shrink-0 shadow-sm border-2 border-white dark:border-gray-800">
                {detailUser.avatarUrl ? <img src={detailUser.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-white text-xl font-bold">{detailUser.displayName?.[0] || 'U'}</span>}
              </div>
              <div>
                <h4 className="font-bold text-lg">{detailUser.displayName}</h4>
                <p className="text-sm text-text-muted">@{detailUser.username || 'unknown'}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-semibold">{detailUser.role}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${detailUser.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{detailUser.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-text-muted font-medium">ID:</span>
                <span className="col-span-2 font-semibold">{detailUser.id}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-text-muted font-medium">Email:</span>
                <span className="col-span-2">{detailUser.email}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-text-muted font-medium">Bio:</span>
                <span className="col-span-2 italic text-gray-500">{detailUser.bio || 'Chưa cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-text-muted font-medium">Spotify:</span>
                <span className="col-span-2">{detailUser.musicConnected ? <span className="text-green-500 font-medium">Đã kết nối</span> : 'Chưa kết nối'}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-text-muted font-medium">Ngày tham gia:</span>
                <span className="col-span-2">{new Date(detailUser.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => setShowDetailModal(false)} className="w-full mt-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
