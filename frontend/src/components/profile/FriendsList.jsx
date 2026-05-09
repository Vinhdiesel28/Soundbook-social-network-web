import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Users } from 'lucide-react';

const PREVIEW_COUNT = 6;

const FriendsList = ({ t, friends }) => {
  const { id } = useParams();
  const displayed = friends.slice(0, PREVIEW_COUNT);

  return (
    <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted">{t('profile.friends', { defaultValue: 'Friends' })}</h3>
        <span className="text-xs font-semibold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">{friends.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {displayed.map(friend => (
          <div key={friend.id} className="flex flex-col items-center gap-1 group cursor-pointer" title={friend.name}>
            <div className="relative">
              {friend.avatarUrl ? <img src={friend.avatarUrl} alt={friend.name} className="w-12 h-12 rounded-full border-2 border-surface-color shadow-sm transition-transform group-hover:scale-105 object-cover" /> : <div className={`w-12 h-12 rounded-full ${friend.avatar} border-2 border-surface-color shadow-sm transition-transform group-hover:scale-105`} />}
              {friend.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-surface-color rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium text-text-muted text-center truncate w-full group-hover:text-text-color transition-colors">{friend.name}</span>
          </div>
        ))}
      </div>

      {friends.length > 0 && (
        <Link
          to={`/profile/${id}/friends`}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-600 py-1.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        >
          <Users size={13} />
          {t('profile.view_all_friends', { defaultValue: `View all ${friends.length} friends` })}
        </Link>
      )}
    </div>
  );
};

export default FriendsList;


