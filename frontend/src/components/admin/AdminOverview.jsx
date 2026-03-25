import React from 'react';
import { Activity } from 'lucide-react';

const getStats = (t) => [
  { label: t('admin.stats.users'), value: '24,592', change: '+12%', isPositive: true },
  { label: t('admin.stats.rooms'), value: '142', change: '+5%', isPositive: true },
  { label: t('admin.stats.posts'), value: '1,284', change: '+18%', isPositive: true },
  { label: t('admin.stats.reports'), value: '15', change: '-2%', isPositive: true },
];

const AdminOverview = ({ t }) => {
  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats(t).map((stat, i) => (
          <div key={i} className="bg-surface-color p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-text-muted font-medium mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminOverview;
