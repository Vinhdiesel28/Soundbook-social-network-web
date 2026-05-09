const AVATAR_CLASSES = [
  'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500',
  'bg-yellow-500', 'bg-teal-500', 'bg-rose-500', 'bg-indigo-500', 'bg-orange-500',
];

export const fallbackAvatar = (id) => AVATAR_CLASSES[Number(id || 0) % AVATAR_CLASSES.length];

export const formatTime = (value) => {
  if (!value) return '';
  const created = new Date(value);
  if (Number.isNaN(created.getTime())) return '';
  const diffMs = Date.now() - created.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return created.toLocaleDateString('vi-VN');
};

const safeLower = (value) => (value ? String(value).toLowerCase() : null);

export const normalizeComment = (comment = {}) => ({
  id: comment.id,
  user: {
    id: comment.user?.userId,
    name: comment.user?.displayName || 'Soundbook user',
    username: comment.user?.username,
    avatarUrl: comment.user?.avatarUrl,
    avatar: fallbackAvatar(comment.user?.userId),
  },
  text: comment.text || comment.content || '',
  time: formatTime(comment.createdAt),
  reacts: comment.reacts || 0,
  original: comment,
});

export const normalizePost = (post = {}) => ({
  id: post.id,
  type: post.type || 'book_review',
  content: post.caption || post.contentRich || post.reason || 'Bài viết từ cộng đồng Soundbook.',
  reason: post.reason,
  tasteScore: post.tasteScore || 0,
  authorMatch: post.authorMatch || 0,
  finalScore: post.finalScore || 0,
  commentsEnabled: post.commentsEnabled !== false,
  currentUserReaction: safeLower(post.currentUserReaction),
  canEdit: Boolean(post.canEdit),
  original: post,
  user: {
    id: post.user?.userId,
    name: post.user?.displayName || 'Soundbook user',
    username: post.user?.username,
    avatarUrl: post.user?.avatarUrl,
    avatar: fallbackAvatar(post.user?.userId),
    time: formatTime(post.createdAt),
  },
  media: {
    title: post.media?.title || (post.type === 'audio' ? 'Bài chia sẻ âm nhạc' : 'Bài chia sẻ sách/truyện'),
    artist: post.media?.subtitle || post.user?.displayName || 'Soundbook',
    author: post.media?.subtitle || post.user?.displayName || 'Soundbook',
    coverUrl: post.media?.coverUrl || post.media?.url,
    cover: post.type === 'audio'
      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
      : 'bg-gradient-to-br from-orange-400 to-red-600',
    rating: post.media?.rating,
  },
  reactions: {
    like: post.reactions?.like || 0,
    heart: post.reactions?.heart || 0,
    fire: post.reactions?.fire || 0,
    flame: post.reactions?.fire || 0,
    laugh: post.reactions?.laugh || 0,
    wow: post.reactions?.wow || 0,
    sad: post.reactions?.sad || 0,
    comments: post.reactions?.comments || 0,
    shares: post.reactions?.shares || 0,
  },
  comments: (post.comments || []).map(normalizeComment),
});

export const normalizeSuggestion = (user = {}) => ({
  id: user.userId,
  name: user.displayName || 'Soundbook user',
  username: user.username,
  match: Math.round(user.finalMatch || 0),
  avatarUrl: user.avatarUrl,
  avatar: fallbackAvatar(user.userId),
  sharedFeatures: user.sharedFeatures || [],
  friendshipStatus: user.friendshipStatus || 'NONE',
  requestId: user.requestId || null,
  canMessage: Boolean(user.canMessage),
});

export const normalizeTrending = (item = {}) => ({
  id: item.postId,
  title: item.title || 'Bài viết Soundbook',
  subtitle: item.subtitle || 'Soundbook',
  type: item.type === 'audio' ? 'music' : 'book',
  count: `${item.engagementCount || 0} tương tác`,
});

export const normalizeShelfItem = (item = {}) => ({
  id: item.id,
  type: item.type,
  title: item.title || 'Chưa có tiêu đề',
  author: item.author || 'Soundbook',
  image: item.image,
  itemId: item.itemId,
  previewUrl: item.previewUrl,
  visibility: item.visibility || 'PUBLIC',
  style: item.type === 'music'
    ? 'rounded-md shrink-0 aspect-square w-24 sm:w-32'
    : 'rounded-sm shrink-0 w-16 sm:w-20 h-28 sm:h-36',
  rating: item.rating,
  progress: item.progress,
  original: item,
});
