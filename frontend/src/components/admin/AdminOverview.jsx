import React from 'react';
import { Flame, ShieldAlert, ArrowRight, Heart, MessageCircle, Music, BookOpen, ExternalLink, ShieldCheck, XCircle } from 'lucide-react';

const getStats = (t) => [
  { label: t('admin.stats.users'), value: '24,592', change: '+12%', isPositive: true },
  { label: t('admin.stats.rooms'), value: '142', change: '+5%', isPositive: true },
  { label: t('admin.stats.posts'), value: '1,284', change: '+18%', isPositive: true },
  { label: t('admin.stats.reports'), value: '15', change: '-2%', isPositive: true },
];

const TRENDING_POSTS = [
  { id: 1, author: 'Đạt Nguyễn', avatar: 'bg-orange-500', content: 'Không thể ngừng nghe kiệt tác này!', type: 'music', likes: 1240, comments: 88 },
  { id: 2, author: 'Trần Quỳnh', avatar: 'bg-pink-500', content: "Vừa đọc xong 'CTDL&GT'. Tôi đã khóc.", type: 'book', likes: 980, comments: 65 },
  { id: 3, author: 'Minh Tuấn', avatar: 'bg-green-500', content: 'Những bản nhạc acoustic buổi tối.', type: 'music', likes: 812, comments: 42 },
  { id: 4, author: 'Mai Linh', avatar: 'bg-blue-500', content: 'Review sách "Sapiens" — 5 sao không đủ.', type: 'book', likes: 730, comments: 31 },
];

const PENDING_REPORTS = [
  { id: 1, reporter: 'Nguyễn Văn A', target: 'Bài viết #412', reason: 'Spam hoặc lừa đảo', date: '28/03/2026' },
  { id: 2, reporter: 'Lê Văn C', target: 'Bình luận #33', reason: 'Ngôn từ thù địch', date: '28/03/2026' },
  { id: 3, reporter: 'Phạm Thu D', target: 'Người dùng @Quangg', reason: 'Tài khoản giả mạo', date: '27/03/2026' },
  { id: 4, reporter: 'Hà Minh E', target: 'Bài viết #987', reason: 'Nội dung khiêu dâm', date: '27/03/2026' },
];

const AdminOverview = ({ t, onNavigate }) => {
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
            {TRENDING_POSTS.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                <span className={`text-base font-black w-5 shrink-0 text-center ${i === 0 ? 'text-orange-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300 dark:text-gray-600'}`}>
                  {i + 1}
                </span>
                <div className={`w-8 h-8 rounded-full shrink-0 ${post.avatar} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{post.author[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-text-muted">{post.author}</p>
                  <p className="text-sm font-medium truncate">{post.content}</p>
                </div>
                <div className={`shrink-0 p-1.5 rounded-lg ${post.type === 'music' ? 'bg-primary-100 dark:bg-primary-500/10' : 'bg-amber-100 dark:bg-amber-500/10'}`}>
                  {post.type === 'music'
                    ? <Music size={13} className="text-primary-500" />
                    : <BookOpen size={13} className="text-amber-600" />}
                </div>
                <div className="flex items-center gap-3 text-text-muted shrink-0">
                  <span className="flex items-center gap-1 text-xs"><Heart size={12} /> {post.likes}</span>
                  <span className="flex items-center gap-1 text-xs"><MessageCircle size={12} /> {post.comments}</span>
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
                <p className="text-xs text-text-muted">{PENDING_REPORTS.length} {t('admin.overview.awaiting_review')}</p>
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
            {PENDING_REPORTS.map((report) => (
              <div key={report.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold">{report.target}</span>
                    <ExternalLink size={12} className="text-text-muted" />
                  </div>
                  <p className="text-xs text-text-muted truncate">
                    <span className="font-medium text-rose-500">{report.reason}</span>
                    {' · '}{t('admin.table.reporter')}: {report.reporter}
                    {' · '}{report.date}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/10 text-text-muted hover:text-green-500 transition-colors" title="Resolve">
                    <ShieldCheck size={15} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors" title="Reject">
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
