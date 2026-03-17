import React, { useState } from 'react';
import { Search, Edit, Ban } from 'lucide-react';

const getUsers = (t) => [
  { id: 1, name: 'Dat Nguyen', email: 'dat@soundbook.com', role: 'Admin', status: 'Active', joined: 'Jan 15, 2026' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', role: 'User', status: 'Active', joined: 'Feb 02, 2026' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Warning', joined: 'Feb 20, 2026' },
];

const AdminUsers = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
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
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold shrink-0">{t('admin.action.add_user')}</button>
        </div>
      </div>
      <div className="overflow-x-auto">
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
            {getUsers(t).filter(user => 
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              user.email.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{user.name}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                <td className="px-6 py-4 text-sm">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button className="p-1 hover:text-blue-500"><Edit size={16} /></button>
                    <button className="p-1 hover:text-red-500"><Ban size={16} /></button>
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

export default AdminUsers;
