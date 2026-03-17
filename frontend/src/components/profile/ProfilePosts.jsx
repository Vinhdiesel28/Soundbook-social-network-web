import React from 'react';
import { Play, MoreHorizontal, Flame, MessageCircle, Share2 } from 'lucide-react';

const ProfilePosts = ({ t, posts }) => {
  return (
    <div className="pt-8 mt-4 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold tracking-tight mb-8">{t('profile.posts_title', { defaultValue: 'Posts & Reposts' })}</h2>
      <div className="space-y-6 pb-10">
        {posts.map((post) => (
          <div key={post.id} className="bg-surface-color rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-800">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${post.user.avatar}`}></div>
                <div>
                  <h4 className="font-semibold text-sm">{post.user.name}</h4>
                  <span className="text-xs text-text-muted">{post.user.time}</span>
                </div>
              </div>
              <button className="text-text-muted hover:text-text-color p-1">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-sm mb-4 leading-relaxed">{post.content}</p>

            {/* Media Card */}
            {post.type === 'audio' ? (
              // Quick Note (Mini-player)
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
                <div className={`w-16 h-16 rounded-lg flex-shrink-0 ${post.media.cover} shadow-md`}></div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-sm truncate">{post.media.title}</h5>
                  <p className="text-xs text-text-muted truncate">{post.media.artist}</p>
                  {/* Fake Progress Bar */}
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary-500 w-1/3"></div>
                  </div>
                </div>
                <button
                  className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                >
                  <Play size={18} className="ml-1" fill="currentColor" />
                </button>
              </div>
            ) : (
              // Review Card
              <div className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
                <div className={`w-24 h-36 rounded-md flex-shrink-0 ${post.media.cover} shadow-md`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-bold text-lg leading-tight">{post.media.title}</h5>
                    <div className="flex items-center text-yellow-500 text-xs">
                      {'★'.repeat(post.media.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-text-muted mb-2">{post.media.author}</p>
                  <button className="text-xs font-semibold text-primary-500 mt-2 hover:underline">{t('post.read_full_review', { defaultValue: 'Read full review' })}</button>
                </div>
              </div>
            )}

            {/* Reactions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-text-muted hover:text-rose-500 transition-colors group">
                  <Flame size={18} className="group-hover:fill-rose-500" />
                  <span className="text-xs font-medium">{post.reactions.flame}</span>
                </button>
                <button className="flex items-center gap-1.5 text-text-muted hover:text-blue-500 transition-colors group">
                  <span className="text-lg leading-none mb-1 group-hover:scale-110 transition-transform">💔</span>
                  <span className="text-xs font-medium">{post.reactions.sad}</span>
                </button>
                <button className="flex items-center gap-1.5 text-text-muted hover:text-primary-500 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-xs font-medium">{post.reactions.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-text-muted hover:text-green-500 transition-colors">
                  <Share2 size={18} />
                  <span className="text-xs font-medium hidden sm:inline">{post.reactions.shares}</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
