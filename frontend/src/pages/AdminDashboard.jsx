import React, { useState } from 'react';
import { Users, AlertTriangle, Activity, Search, Filter, MoreVertical, Ban, CheckCircle, Disc3, BookOpen, BarChart3, Settings } from 'lucide-react';

const STATS = [
  { label: 'Total Users', value: '24,592', change: '+12%', isPositive: true },
  { label: 'Active Live Rooms', value: '142', change: '+5%', isPositive: true },
  { label: 'Reports Pending', value: '28', change: '-2%', isPositive: false },
  { label: 'Server Load', value: '42%', change: '+1%', isPositive: false },
];

const REPORTS = [
  { id: 1, user: 'toxic_user99', target: 'Dat Nguyen', type: 'Spam', status: 'Pending', date: '2 mins ago', severity: 'High' },
  { id: 2, user: 'fake_bot123', target: 'Post ID #8234', type: 'Inappropriate Content', status: 'Pending', date: '15 mins ago', severity: 'Medium' },
  { id: 3, user: 'hater_boy', target: 'Sarah', type: 'Harassment', status: 'Resolved', date: '1 hour ago', severity: 'High' },
  { id: 4, user: 'spammer_x', target: 'Group: Indie Heads', type: 'Spam', status: 'Resolved', date: '2 hours ago', severity: 'Low' },
  { id: 5, user: 'troll_master', target: 'Live Room: Midnight Vibes', type: 'Hate Speech', status: 'Pending', date: '3 hours ago', severity: 'High' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports'); // 'overview' | 'reports' | 'users'

  return (
    <div className="min-h-screen bg-bg-color text-text-color flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-surface-color border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center">
            <Disc3 size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">Admin<span className="text-primary-500">Panel</span></span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'overview' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Activity size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'users' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Users size={18} /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'reports' ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} /> Reports
            </div>
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">28</span>
          </button>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BarChart3 size={18} /> Analytics
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800">
            <Settings size={18} /> Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-surface-color border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 lg:px-8">
          <h1 className="text-lg font-bold capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-2 border-surface-color cursor-pointer" />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-gray-50/50 dark:bg-black/10">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
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

          {/* Data Table */}
          <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-lg">Recent Reports</h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Filter size={16} /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors">
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-text-muted border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 font-medium">Reported User/Entity</th>
                    <th className="px-6 py-4 font-medium">Target</th>
                    <th className="px-6 py-4 font-medium">Violation Type</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {REPORTS.map(report => (
                    <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <span className="font-medium text-sm">{report.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{report.target}</td>
                      <td className="px-6 py-4 text-sm font-medium">{report.type}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          report.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          report.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{report.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-text-muted hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors" title="Resolve">
                            <CheckCircle size={18} />
                          </button>
                          <button className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Ban User">
                            <Ban size={18} />
                          </button>
                          <button className="p-1.5 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
              <span className="text-sm text-text-muted">Showing <span className="font-semibold text-text-color">1</span> to <span className="font-semibold text-text-color">5</span> of <span className="font-semibold text-text-color">28</span> total reports</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium hover:bg-white dark:hover:bg-gray-800">Next</button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
