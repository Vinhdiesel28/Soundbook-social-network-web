import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, ArrowRight, Heart, MessageCircle, Music, BookOpen, ExternalLink, ShieldCheck, XCircle } from 'lucide-react';
import { getDashboardStats, getTrendingPosts, getReports, resolveReport, rejectReport } from '../../services/adminApi';

const AdminOverview = ({ t, onNavigate }) => {
  const [stats, setStats] = useState({ users: 0, rooms: 0, posts: 0, reports: 0 });
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, trendingRes, reportsRes] = await Promise.all([
        getDashboardStats().catch(() => ({ data: { users: 0, rooms: 0, posts: 0, reports: 0 }})),
        getTrendingPosts().catch(() => ({ data: [] })),
        getReports({ status: 'PENDING', size: 4 }).catch(() => ({ data: { content: [] } }))
      ]);
      
      if (statsRes.data) setStats(statsRes.data);
      if (trendingRes.data) setTrendingPosts(trendingRes.data.slice(0, 4));
      if (reportsRes.data && reportsRes.data.content) setPendingReports(reportsRes.data.content.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (id) => {
    try {
      await resolveReport(id, { action: 'RESOLVED', notes: 'Resolved from overview' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectReport = async (id) => {
    try {
      await rejectReport(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatsArray = (t, s) => [
    { 
      label: t('admin.stats.users'), 
      value: (s.totalUsers || 0).toLocaleString(), 
      change: s.userGrowth ? `${s.userGrowth > 0 ? '+' : ''}${s.userGrowth}%` : '', 
      isPositive: s.userGrowth >= 0 
    },
    { 
      label: t('admin.stats.rooms'), 
      value: (s.activeLiveRooms || 0).toLocaleString(), 
      change: '', 
      isPositive: true 
    },
    { 
      label: t('admin.stats.posts'), 
      value: (s.totalPosts || 0).toLocaleString(), 
      change: s.postGrowth ? `${s.postGrowth > 0 ? '+' : ''}${s.postGrowth}%` : '', 
      isPositive: s.postGrowth >= 0 
    },
    { 
      label: t('admin.stats.reports'), 
      value: (s.pendingReports || 0).toLocaleString(), 
      change: s.reportGrowth ? `${s.reportGrowth > 0 ? '+' : ''}${s.reportGrowth}%` : '', 
      isPositive: s.reportGrowth >= 0 
    },
  ];
  return (
    <div className="space-y-8">

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsArray(t, stats).map((stat, i) => (
          <div key={i} className="bg-surface-color p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-text-muted font-medium mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black tracking-tight">{loading ? '...' : stat.value}</h3>
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Trending Posts */}
        <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg">
                <Flame size={18} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-base">{t('admin.overview.trending_posts')}</h3>
            </div>
            <button
              onClick={() => onNavigate?.('posts')}
              className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              {t('admin.overview.view_all')} <ArrowRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? <div className="p-5 text-center text-sm text-gray-500">Loading...</div> : trendingPosts.length === 0 ? <div className="p-5 text-center text-sm text-gray-500">No trending posts</div> : trendingPosts.map((post, i) => (
              <div key={post.id || i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                <span className={`text-base font-black w-5 shrink-0 text-center ${i === 0 ? 'text-orange-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300 dark:text-gray-600'}`}>
                  {i + 1}
                </span>
                <div className={`w-8 h-8 rounded-full shrink-0 bg-primary-500 flex items-center justify-center overflow-hidden`}>
                  {post.authorAvatar ? <img src={post.authorAvatar} alt="" className="w-full h-full object-cover" /> : <span className="text-white text-xs font-bold">{post.authorName?.[0] || 'U'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-text-muted">{post.authorName || 'Unknown'}</p>
                  <p className="text-sm font-medium truncate">{post.caption || 'No content'}</p>
                </div>
                <div className={`shrink-0 p-1.5 rounded-lg ${post.postType === 'MUSIC' ? 'bg-primary-100 dark:bg-primary-500/10' : 'bg-amber-100 dark:bg-amber-500/10'}`}>
                  {post.postType === 'MUSIC'
                    ? <Music size={13} className="text-primary-500" />
                    : <BookOpen size={13} className="text-amber-600" />}
                </div>
                <div className="flex items-center gap-3 text-text-muted shrink-0">
                  <span className="flex items-center gap-1 text-xs"><Heart size={12} /> {post.likeCount || 0}</span>
                  <span className="flex items-center gap-1 text-xs"><MessageCircle size={12} /> {post.commentCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-500/10 rounded-lg">
                <ShieldAlert size={18} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('admin.overview.pending_reports')}</h3>
                <p className="text-xs text-text-muted">{pendingReports.length} {t('admin.overview.awaiting_review')}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('reports')}
              className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              {t('admin.overview.view_all')} <ArrowRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? <div className="p-5 text-center text-sm text-gray-500">Loading...</div> : pendingReports.length === 0 ? <div className="p-5 text-center text-sm text-gray-500">No pending reports</div> : pendingReports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold">{report.targetType} #{report.targetId}</span>
                    <ExternalLink size={12} className="text-text-muted" />
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    <span className="font-medium text-rose-500">{report.reason}</span>
                    {' · '}{t('admin.table.reporter')}: {report.reporter?.displayName || 'Unknown'}
                    {' · '}{new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleResolveReport(report.id)} className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/10 text-text-muted hover:text-green-500 transition-colors" title="Resolve">
                    <ShieldCheck size={15} />
                  </button>
                  <button onClick={() => handleRejectReport(report.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors" title="Reject">
                    <XCircle size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;
