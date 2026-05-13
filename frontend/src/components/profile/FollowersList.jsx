import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

const PREVIEW_COUNT = 6;

const FollowersList = ({ t, followers, onViewAll }) => {
  const { id } = useParams();
  const displayed = followers.slice(0, PREVIEW_COUNT);

  return (
    <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted">{t('profile.followers', { defaultValue: 'Followers' })}</h3>
        <span className="text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">{followers.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {displayed.map(follower => (
          <Link to={`/profile/${follower.userId}`} key={follower.userId} className="flex flex-col items-center gap-1 group cursor-pointer" title={follower.name}>
            <div className="relative">
              {follower.avatarUrl ? (
                <img src={follower.avatarUrl} alt={follower.name} className="w-12 h-12 rounded-full border-2 border-surface-color shadow-sm transition-transform group-hover:scale-105 object-cover" />
              ) : (
                <div className={`w-12 h-12 rounded-full ${follower.avatar || 'bg-primary-500'} border-2 border-surface-color shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center text-white text-[10px] font-bold`}>
                  {follower.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium text-text-muted text-center truncate w-full group-hover:text-text-color transition-colors">{follower.name}</span>
          </Link>
        ))}
        {followers.length === 0 && (
          <div className="col-span-3 text-center py-4 text-xs text-text-muted italic">Chưa có người theo dõi nào.</div>
        )}
      </div>

      {followers.length > 0 && (
        <button
          onClick={onViewAll}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
        >
          <UserCheck size={13} />
          {followers.length > PREVIEW_COUNT 
            ? `Xem tất cả ${followers.length} người theo dõi`
            : "Xem chi tiết người theo dõi"}
        </button>
      )}
    </div>
  );
};

export default FollowersList;
