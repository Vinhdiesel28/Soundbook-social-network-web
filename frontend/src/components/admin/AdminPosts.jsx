import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';

const getPosts = (t) => [
  { id: 1, author: 'Sarah Connor', content: 'Just finished Dune...', type: 'Book Review', likes: 120, status: 'Published' },
  { id: 2, author: 'Mike Smith', content: 'Checkout my new mixtape!', type: 'Audio', likes: 45, status: 'Flagged' },
];

const AdminPosts = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState('');

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
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {getPosts(t).filter(post => 
              post.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
              post.content.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(post => (
              <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{post.author}</td>
                <td className="px-6 py-4 text-sm text-text-muted truncate max-w-xs">{post.content}</td>
                <td className="px-6 py-4 text-sm">{post.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-text-muted hover:text-red-500"><Trash2 size={16} /></button>
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
