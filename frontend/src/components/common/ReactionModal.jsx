import React, { useState, useEffect } from 'react';
import ModalShell from './ModalShell';
import { postsApi } from '../../services/posts';
import { fallbackAvatar } from '../../utils/feedNormalizers';
import { Link } from 'react-router-dom';
import { Heart, ThumbsUp, Flame, Laugh, Frown, Ghost, Angry } from 'lucide-react';
import { getCurrentUser } from '../../services/auth';

const REACTION_CONFIG = {
  LIKE: { icon: ThumbsUp, color: 'text-blue-500', fill: false },
  HEART: { icon: Heart, color: 'text-rose-500', fill: true },
  FIRE: { icon: Flame, color: 'text-orange-500', fill: false },
  HAHA: { icon: Laugh, color: 'text-yellow-500', fill: false },
  WOW: { icon: Ghost, color: 'text-purple-500', fill: false },
  SAD: { icon: Frown, color: 'text-sky-500', fill: false },
  ANGRY: { icon: Angry, color: 'text-red-500', fill: false },
};

const ReactionModal = ({ isOpen, onClose, targetId, targetType = 'POST', title = 'Người đã bày tỏ cảm xúc' }) => {
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isOpen && targetId) {
      loadReactions();
    }
  }, [isOpen, targetId, targetType]);

  const loadReactions = async () => {
    setLoading(true);
    try {
      const data = await postsApi.getReactions(targetId, targetType, 0, 100); // Fetch up to 100
      setReactions(data.content || []);
    } catch (err) {
      console.error('Failed to load reactions', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReactions = activeTab === 'ALL' 
    ? reactions 
    : reactions.filter(r => r.reactionType === activeTab);

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reactionType] = (acc[r.reactionType] || 0) + 1;
    return acc;
  }, {});

  const uniqueTypes = [...new Set(reactions.map(r => r.reactionType))];

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col h-[450px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'ALL' 
                ? 'border-primary-500 text-primary-500' 
                : 'border-transparent text-text-muted hover:text-text-color'
            }`}
          >
            Tất cả ({reactions.length})
          </button>
          {uniqueTypes.map(type => {
            const config = REACTION_CONFIG[type] || { icon: ThumbsUp, color: 'text-gray-400' };
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === type 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent text-text-muted hover:text-text-color'
                }`}
              >
                <Icon size={16} className={config.color} fill={config.fill ? 'currentColor' : 'none'} />
                {reactionCounts[type]}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredReactions.length > 0 ? (
            <div className="space-y-1">
              {filteredReactions.map((r) => {
                const config = REACTION_CONFIG[r.reactionType] || { icon: ThumbsUp, color: 'text-gray-400' };
                const Icon = config.icon;
                return (
                  <Link
                    key={r.reactionId}
                    to={`/profile/${r.userId}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {r.avatarUrl ? (
                          <img src={r.avatarUrl} alt={r.fullName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${fallbackAvatar(r.userId)} flex items-center justify-center text-white font-bold`}>
                            {r.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -right-1 -bottom-1 bg-white dark:bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                          <Icon size={12} className={config.color} fill={config.fill ? 'currentColor' : 'none'} />
                        </div>
                      </div>
                      <span className="font-semibold text-sm">
                        {Number(r.userId) === Number(currentUser?.id) ? 'Bạn' : r.fullName}
                      </span>
                    </div>
                    <button className="text-xs font-bold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-3 py-1.5 rounded-full transition-colors border border-primary-500/30">
                      Xem hồ sơ
                    </button>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-2">
              <p className="text-sm">Chưa có cảm xúc nào ở đây.</p>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
};

export default ReactionModal;
