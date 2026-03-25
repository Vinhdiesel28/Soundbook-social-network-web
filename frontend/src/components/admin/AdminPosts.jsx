import React, { useState } from 'react';
import { Search, Trash2, Eye, Edit } from 'lucide-react';

const initialPosts = [
  { id: 1, author: 'Nguyễn Văn A', content: 'Vừa đọc xong cuốn Dune...', type: 'Review Sách', likes: 120, status: 'Công khai', created_date: '24/03/2026' },
  { id: 2, author: 'Trần Thị B', content: 'Nghe thử bản mixtape mới của mình nhé!', type: 'Ghi chú Âm nhạc', likes: 45, status: 'Bạn bè', created_date: '25/03/2026' },
  { id: 3, author: 'Dat Nguyen', content: 'Đang đọc chương 5', type: 'Cập nhật Đọc sách', likes: 12, status: 'Riêng tư', created_date: '25/03/2026' }
];

const AdminPosts = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.posts')}</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder={t('admin.search_users')} 
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
            {posts.filter(post => 
              post.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(post => (
              <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{post.author}</td>
                <td className="px-6 py-4 text-sm text-text-muted truncate max-w-xs">{post.content}</td>
                <td className="px-6 py-4 text-sm">{post.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    post.status === 'Công khai' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    post.status === 'Bạn bè' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                    post.status === 'Người theo dõi' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{post.created_date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button className="p-1 hover:text-blue-500" title="View"><Eye size={16} /></button>
                    <button className="p-1 hover:text-green-500" title="Edit"><Edit size={16} /></button>
                    <button className="p-1 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPosts;
