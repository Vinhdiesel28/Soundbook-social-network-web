import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Share2, MoreHorizontal, Send, Sparkles, ThumbsUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostHeaderBar from './PostHeaderBar';
import PostMediaCard from './PostMediaCard';
import PostComments from './PostComments';
import PostReactionsBar from './PostReactionsBar';
import ReactionModal from '../common/ReactionModal';
import { postsApi } from '../../services/posts';
import { resolveUrl } from '../../services/auth';
import { normalizeComment, normalizePost } from '../../utils/feedNormalizers';
import { useLanguage } from '../../context/LanguageContext';

const PostDetailModal = ({ isOpen, onClose, post, isPlaying, onTogglePlay, onChanged }) => {
  const { t } = useLanguage();
  const [livePost, setLivePost] = useState(post);
  const [busy, setBusy] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentFocusTick, setCommentFocusTick] = useState(0);
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setLivePost(post);
      fetchFullComments();
    }
  }, [isOpen, post?.id]);

  const fetchFullComments = async () => {
    try {
      setLoadingComments(true);
      const res = await postsApi.getComments(post.id, 0, 100);
      if (res?.data?.content) {
        const normalized = res.data.content.map(normalizeComment);
        setLivePost(prev => ({
          ...prev,
          comments: normalized
        }));
      }
    } catch (err) {
      console.error('Failed to fetch full comments in modal', err);
    } finally {
      setLoadingComments(false);
    }
  };

  if (!isOpen || !post) return null;

  const handleReact = async (reactionType) => {
    try {
      setBusy(true);
      const result = await postsApi.react(livePost.id, reactionType);
      if (result) {
        const normalized = normalizePost(result);
        setLivePost(normalized);
        onChanged?.(normalized, { action: 'update' });
      }
    } finally {
      setBusy(false);
    }
  };

  const handleComment = async (content) => {
    try {
      setBusy(true);
      const result = await postsApi.comment(livePost.id, content);
      if (result) {
        const newComment = normalizeComment(result);
        const updatedPost = {
          ...livePost,
          comments: [...(livePost.comments || []), newComment],
          reactions: {
            ...(livePost.reactions || {}),
            comments: (livePost.reactions?.comments || 0) + 1,
          },
        };
        setLivePost(updatedPost);
        onChanged?.(updatedPost, { action: 'comment', postId: livePost.id });
      }
    } finally {
      setBusy(false);
    }
  };

  const reactions = livePost.reactions || {};
  const totalReacts = (reactions.like || 0) + (reactions.heart || 0) + (reactions.fire || 0) + (reactions.haha || 0) + (reactions.wow || 0) + (reactions.sad || 0) + (reactions.angry || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-full md:h-[90vh] bg-surface-color md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-3">
             <Link to={`/profile/${livePost.user?.id}`} className="transition-transform active:scale-95 shrink-0">
               {livePost.user?.avatarUrl ? (
                 <img src={resolveUrl(livePost.user.avatarUrl)} alt={livePost.user.name} className="h-10 w-10 rounded-full object-cover" />
               ) : (
                 <div className={`w-10 h-10 rounded-full ${livePost.user?.avatar} flex items-center justify-center text-xs font-bold text-white`}>{(livePost.user?.name || 'U').charAt(0).toUpperCase()}</div>
               )}
             </Link>
             <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base leading-none">Bài viết của <Link to={`/profile/${livePost.user?.id}`} className="hover:text-primary-500 transition-colors">{livePost.user?.name}</Link></h3>
                  {livePost.reason && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-2 py-0.5 text-[9px] font-bold text-primary-500">
                      <Sparkles size={9} />
                      <span>AI Pick</span>
                    </div>
                  )}
               </div>
               <p className="text-[11px] text-text-muted font-medium mt-1">{livePost.user?.time || 'Vừa xong'}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col">
            
            {/* Caption Section (Now on top) */}
            {livePost.content && (
              <div className="px-6 py-4">
                <p className="text-base leading-relaxed whitespace-pre-line">{livePost.content}</p>
              </div>
            )}

            {/* Media Section */}
            {livePost.media && (
              <div className="w-full bg-black flex items-center justify-center min-h-[300px] max-h-[600px]">
                 <PostMediaCard post={livePost} isPlaying={isPlaying} onTogglePlay={onTogglePlay} />
              </div>
            )}

            {/* Action Buttons (Full Reactions Bar) */}
            <div className="px-6 py-1 border-b border-gray-100 dark:border-gray-800/50">
               <PostReactionsBar 
                 post={livePost} 
                 onReact={handleReact} 
                 onFocusComment={() => setCommentFocusTick(t => t + 1)} 
                 onShare={() => { /* Handle share or show toast */ }}
                 onViewReactions={() => setIsReactionModalOpen(true)}
               />
            </div>

            {/* Comments Section */}
            <div className="px-6 pb-6 pt-2">
              {loadingComments ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
              ) : (
                <PostComments 
                  postId={livePost.id}
                  postOwnerId={livePost.user?.userId || livePost.user?.id}
                  comments={livePost.comments || []} 
                  enabled={livePost.commentsEnabled !== false} 
                  onSubmitComment={handleComment} 
                  focusSignal={commentFocusTick} 
                  totalComments={livePost.reactions?.comments || 0}
                  showAll={true}
                />
              )}
            </div>
          </div>
        </div>

      </div>

      <ReactionModal 
        isOpen={isReactionModalOpen}
        onClose={() => setIsReactionModalOpen(false)}
        targetId={livePost.id}
      />
    </div>
  );
};

export default PostDetailModal;
