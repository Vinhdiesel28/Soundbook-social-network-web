import React, { useState } from 'react';
import { Search, Ban, Eye } from 'lucide-react';

const getLiveRooms = (t) => [
  { id: 1, host: 'DJ Kha', title: 'Nhạc trẻ cuối tuần', listeners: 1250, status: 'Đang Live' },
  { id: 2, host: 'BookClub', title: 'Thảo luận sách Thói quen nguyên tử', listeners: 45, status: 'Đã kết thúc' },
];

const AdminRooms = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.rooms')}</h3>
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
              <th className="px-6 py-4 font-medium">{t('admin.table.room_host')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.room_title')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.listeners')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.status')}</th>
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {getLiveRooms(t).filter(room => 
              room.host.toLowerCase().includes(searchQuery.toLowerCase()) || 
              room.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(room => (
              <tr key={room.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{room.host}</td>
                <td className="px-6 py-4 text-sm">{room.title}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{room.listeners}</td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    room.status === 'Đang Live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-text-muted">
                    <button className="p-1 hover:text-blue-500"><Eye size={16} /></button>
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

export default AdminRooms;
