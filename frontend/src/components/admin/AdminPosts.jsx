import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, EyeOff, X, MessageCircle, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { getPosts, getPostById, deletePost, hidePost, unhidePost, getPostComments, getPostReactions, getCommentReactions } from '../../services/adminApi';
import PostMediaCard from '../newsfeed/PostMediaCard';
import { normalizePost } from '../../utils/feedNormalizers';

const AdminPosts = ({ t, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPost, setDetailPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'comments', 'reactions'

  // Comment reactions state
  const [expandedCommentId, setExpandedCommentId] = useState(null);
  const [currentCommentReactions, setCurrentCommentReactions] = useState([]);
  const [loadingCommentReactions, setLoadingCommentReactions] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery || '');
    }
  }, [initialSearchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getPosts();
      if (res.data && res.data.content) {
        setPosts(res.data.content);
      } else if (res.data && Array.isArray(res.data)) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        fetchPosts();
        if (detailPost && detailPost.id === id) setShowDetailModal(false);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleToggleHide = async (post) => {
    try {
      if (post.status === 'HIDDEN') {
        await unhidePost(post.id);
        if (detailPost && detailPost.id === post.id) {
          setDetailPost(prev => ({ ...prev, status: 'ACTIVE' }));
        }
      } else {
        await hidePost(post.id);
        if (detailPost && detailPost.id === post.id) {
          setDetailPost(prev => ({ ...prev, status: 'HIDDEN' }));
        }
      }
      fetchPosts();
    } catch (error) {
      console.error("Failed to toggle hide post:", error);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      setActiveTab('info');
      setExpandedCommentId(null);
      const [postRes, commentsRes, reactionsRes] = await Promise.all([
        getPostById(id),
        getPostComments(id).catch(() => ({ data: { content: [] } })),
        getPostReactions(id).catch(() => ({ data: { content: [] } }))
      ]);
      setDetailPost(normalizePost(postRes.data));
      setComments(commentsRes.data?.content || []);
      setReactions(reactionsRes.data?.content || []);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
      alert('Lỗi lấy thông tin chi tiết bài viết');
    }
  };

  const handleViewCommentReactions = async (commentId) => {
    if (expandedCommentId === commentId) {
      setExpandedCommentId(null);
      return;
    }
    try {
      setExpandedCommentId(commentId);
      setLoadingCommentReactions(true);
      const res = await getCommentReactions(detailPost.id, commentId);
      setCurrentCommentReactions(res.data?.content || []);
    } catch (err) {
      console.error("Failed to load comment reactions", err);
    } finally {
      setLoadingCommentReactions(false);
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300 relative">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.posts')}</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm theo ID, tác giả hoặc nội dung..." 
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
              <th className="px-6 py-4 font-medium">{t('admin.table.author')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.content')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.type')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.status')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.created_date')}</th>
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? <tr><td colSpan="6" className="text-center py-4 text-gray-500">Loading...</td></tr> : posts.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-gray-500">No posts found</td></tr> : posts.filter(post => 
              post.id?.toString() === searchQuery ||
              (post.authorName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
              (post.caption?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            ).map(post => (
              <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{post.authorName || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm text-text-muted truncate max-w-xs">{post.caption || 'Không có nội dung'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-semibold">{post.type || 'Standard'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    post.visibility === 'PUBLIC' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    post.visibility === 'FRIENDS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                    post.visibility === 'FOLLOWERS' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {post.visibility || 'PUBLIC'}
                  </span>
                  {post.status === 'HIDDEN' && (
                     <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">HIDDEN</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button onClick={() => handleViewDetail(post.id)} className="p-1 hover:text-blue-500" title="View"><Eye size={16} /></button>
                    <button onClick={() => handleToggleHide(post)} className="p-1 hover:text-yellow-500" title={post.status === 'HIDDEN' ? 'Hiển thị bài viết' : 'Ẩn bài viết'}><EyeOff size={16} /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-1 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && detailPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface-color w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold">Chi tiết bài viết #{detailPost.id}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-text-muted hover:text-text-color"><X size={20} /></button>
            </div>
            
            <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0">
              <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Thông tin</button>
              <button onClick={() => setActiveTab('comments')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'comments' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}><MessageCircle size={16} /> Bình luận ({comments.length})</button>
              <button onClick={() => setActiveTab('reactions')} className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'reactions' ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-muted hover:text-text-color hover:bg-gray-50 dark:hover:bg-gray-800'}`}><Heart size={16} /> Tương tác ({reactions.length})</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-sm font-semibold mb-1">Tác giả</p>
                    <p className="font-bold text-lg text-primary-500">{detailPost.authorName}</p>
                    <p className="text-sm text-text-muted">{detailPost.authorEmail}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2">Nội dung & Media</p>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                      {detailPost.content && (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed mb-4">{detailPost.content}</p>
                      )}
                      <PostMediaCard post={detailPost} />
                      {!detailPost.content && !detailPost.media?.id && !detailPost.media?.coverUrl && (
                        <p className="italic text-gray-500 text-sm">Không có nội dung văn bản hoặc media</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Loại bài viết</p>
                      <p className="font-bold uppercase">{detailPost.type}</p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Quyền riêng tư</p>
                      <p className="font-bold">{detailPost.visibility || 'PUBLIC'}</p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Trạng thái</p>
                      <p className="font-bold">{detailPost.status || 'ACTIVE'}</p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-xs font-semibold text-text-muted mb-1">Ngày tạo</p>
                      <p className="font-bold">{detailPost.createdAt ? new Date(detailPost.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có bình luận nào</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-500 overflow-hidden flex items-center justify-center shrink-0">
                              {comment.authorAvatar ? <img src={comment.authorAvatar} alt="" className="w-full h-full object-cover" /> : <span className="text-white text-[10px] font-bold">{comment.authorName?.[0] || 'U'}</span>}
                            </div>
                            <p className="text-sm font-bold">{comment.authorName}</p>
                          </div>
                          <span className="text-xs text-text-muted">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm pl-8 mb-2">{comment.content}</p>
                        
                        <div className="pl-8">
                          <button 
                            onClick={() => handleViewCommentReactions(comment.id)} 
                            className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                          >
                            {expandedCommentId === comment.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {expandedCommentId === comment.id ? 'Ẩn tương tác' : 'Xem tương tác'}
                          </button>
                          
                          {expandedCommentId === comment.id && (
                            <div className="mt-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                              {loadingCommentReactions ? (
                                <p className="text-xs text-gray-500 italic">Đang tải...</p>
                              ) : currentCommentReactions.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">Chưa có tương tác nào</p>
                              ) : (
                                currentCommentReactions.map(rxn => (
                                  <div key={rxn.id} className="flex items-center justify-between text-xs py-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md px-2 -ml-2 transition-colors">
                                    <div className="flex items-center gap-2">
                                      <Heart size={12} className="text-red-500 fill-current"/>
                                      <span className="font-medium text-text-color">{rxn.userName || 'Người dùng'}</span>
                                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-text-muted">{rxn.type}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{new Date(rxn.createdAt).toLocaleDateString()}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reactions' && (
                <div className="space-y-2">
                  {reactions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có lượt tương tác nào</p>
                  ) : (
                    reactions.map(reaction => (
                      <div key={reaction.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <p className="text-sm font-medium">{reaction.userName || 'Người dùng'}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">{reaction.type}</span>
                          <span className="text-xs text-text-muted">{new Date(reaction.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 shrink-0 flex gap-3">
              <button onClick={() => handleToggleHide(detailPost)} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${detailPost.status === 'HIDDEN' ? 'bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-500/10 dark:hover:bg-green-500/20' : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20'}`}>
                {detailPost.status === 'HIDDEN' ? 'Bỏ ẩn bài viết' : 'Ẩn bài viết'}
              </button>
              <button onClick={() => handleDelete(detailPost.id)} className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg font-semibold text-sm transition-colors">
                Xóa bài viết
              </button>
              <button onClick={() => setShowDetailModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
