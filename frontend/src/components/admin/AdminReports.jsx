import React, { useState } from 'react';
import { Search, ShieldCheck, Trash2, ExternalLink, XCircle } from 'lucide-react';

const getReports = (t) => [
  { id: 1, reporter: 'Nguyễn Văn A', target: 'Bài viết #412', reason: 'Spam hoặc lừa đảo', status: 'Đang chờ', date: '01/11/2026' },
  { id: 2, reporter: 'Trần Thị B', target: 'Người dùng @Do_mixi', reason: 'Quấy rối', status: 'Đã giải quyết', date: '02/11/2026' },
  { id: 3, reporter: 'Lê Văn C', target: 'Bình luận #33', reason: 'Ngôn từ thù địch', status: 'Đang chờ', date: '03/11/2026' },
];

const AdminReports = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.reports')}</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={t('admin.search')}
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
              <th className="px-6 py-4 font-medium">{t('admin.table.reporter')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.target')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.reason')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.status')}</th>
              <th className="px-6 py-4 font-medium">{t('admin.table.date')}</th>
              <th className="px-6 py-4 font-medium text-right">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {getReports(t).filter(report =>
              report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
              report.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
              report.reason.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(report => (
              <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">{report.reporter}</td>
                <td className="px-6 py-4 text-sm text-primary-500 hover:underline cursor-pointer flex items-center gap-1">
                  {report.target} <ExternalLink size={14} />
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{report.reason}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${report.status === 'Đã giải quyết' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{report.date}</td>
                <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                  <button className="p-1 text-text-muted hover:text-green-500" title="Resolve"><ShieldCheck size={18} /></button>
                  <button className="p-1 text-text-muted hover:text-yellow-500" title="Reject"><XCircle size={18} /></button>
                  <button className="p-1 text-text-muted hover:text-red-500" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
