import React, { useState } from 'react';
import { Search } from 'lucide-react';

const getMessages = (t) => [
  { id: 1, sender: 'System', recipient: 'All Users', content: 'Scheduled maintenance tonight.', date: 'Just now' },
  { id: 2, sender: 'User_X', recipient: 'Support', content: 'I cannot login, please help.', date: '1 hour ago' },
];

const AdminMessages = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.messages')}</h3>
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
              <th className="px-6 py-4 font-medium">{t('admin.table.sender')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.recipient')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.message')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {getMessages(t).filter(msg => 
              msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
              msg.content.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(msg => (
              <tr key={msg.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{msg.sender}</td>
                <td className="px-6 py-4 text-sm">{msg.recipient}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{msg.content}</td>
                <td className="px-6 py-4 text-sm">{msg.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMessages;
