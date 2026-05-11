import { request, getToken, API_BASE_URL } from './auth';

// ---------------------------------------------------------
// Dashboard
// ---------------------------------------------------------
export const getDashboardStats = () => 
    request('/admin/dashboard/stats', { method: 'GET', auth: true });

export const getTrendingPosts = () => 
    request('/admin/dashboard/trending-posts', { method: 'GET', auth: true });

// ---------------------------------------------------------
// Users
// ---------------------------------------------------------
export const getUsers = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`, { method: 'GET', auth: true });
};

export const getUserById = (id) => 
    request(`/admin/users/${id}`, { method: 'GET', auth: true });

export const createUser = (data) => 
    request('/admin/users', { method: 'POST', auth: true, body: JSON.stringify(data) });

export const updateUser = (id, data) => 
    request(`/admin/users/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(data) });

export const deleteUser = (id) => 
    request(`/admin/users/${id}`, { method: 'DELETE', auth: true });

// ---------------------------------------------------------
// Posts
// ---------------------------------------------------------
export const getPosts = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/posts${query ? `?${query}` : ''}`, { method: 'GET', auth: true });
};

export const getPostById = (id) => 
    request(`/admin/posts/${id}`, { method: 'GET', auth: true });

export const deletePost = (id) => 
    request(`/admin/posts/${id}`, { method: 'DELETE', auth: true });

export const hidePost = (id) => 
    request(`/admin/posts/${id}/hide`, { method: 'PUT', auth: true });

export const unhidePost = (id) => 
    request(`/admin/posts/${id}/unhide`, { method: 'PUT', auth: true });

export const getPostComments = (id) => 
    request(`/admin/posts/${id}/comments`, { method: 'GET', auth: true });

export const getPostReactions = (id) => 
    request(`/admin/posts/${id}/reactions`, { method: 'GET', auth: true });

export const getCommentReactions = (postId, commentId) => 
    request(`/admin/posts/${postId}/comments/${commentId}/reactions`, { method: 'GET', auth: true });

// ---------------------------------------------------------
// Rooms
// ---------------------------------------------------------
export const getRooms = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/rooms${query ? `?${query}` : ''}`, { method: 'GET', auth: true });
};

export const getRoomById = (id) => 
    request(`/admin/rooms/${id}`, { method: 'GET', auth: true });

export const endRoom = (id) => 
    request(`/admin/rooms/${id}/end`, { method: 'PUT', auth: true });

export const getRoomMembers = (id) => 
    request(`/admin/rooms/${id}/members`, { method: 'GET', auth: true });

export const removeRoomMember = (roomId, userId) => 
    request(`/admin/rooms/${roomId}/members/${userId}`, { method: 'DELETE', auth: true });

export const getRoomMessages = (id) => 
    request(`/admin/rooms/${id}/messages`, { method: 'GET', auth: true });

export const deleteRoomMessage = (messageId) => 
    request(`/admin/rooms/messages/${messageId}`, { method: 'DELETE', auth: true });

export const getRoomQueue = (id) => 
    request(`/admin/rooms/${id}/queue`, { method: 'GET', auth: true });

export const removeRoomQueueItem = (queueId) => 
    request(`/admin/rooms/queue/${queueId}`, { method: 'DELETE', auth: true });

// ---------------------------------------------------------
// Direct Messages (DM)
// ---------------------------------------------------------
export const getDmThreads = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/dm/threads${query ? `?${query}` : ''}`, { method: 'GET', auth: true });
};

export const getDmThreadMessages = (id) => 
    request(`/admin/dm/threads/${id}/messages`, { method: 'GET', auth: true });

export const deleteDmMessage = (id) => 
    request(`/admin/dm/messages/${id}`, { method: 'DELETE', auth: true });

export const deleteDmMessageForEveryone = (id) => 
    request(`/admin/dm/messages/${id}/delete-for-everyone`, { method: 'PUT', auth: true });

// ---------------------------------------------------------
// Reports
// ---------------------------------------------------------
export const getReports = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/reports${query ? `?${query}` : ''}`, { method: 'GET', auth: true });
};

export const getReportById = (id) => 
    request(`/admin/reports/${id}`, { method: 'GET', auth: true });

export const reviewReport = (id) => 
    request(`/admin/reports/${id}/review`, { method: 'PUT', auth: true });

export const rejectReport = (id) => 
    request(`/admin/reports/${id}/reject`, { method: 'PUT', auth: true });

export const resolveReport = (id, data) => 
    request(`/admin/reports/${id}/resolve`, { method: 'PUT', auth: true, body: JSON.stringify(data) });

// ---------------------------------------------------------
// Profile
// ---------------------------------------------------------
export const getAdminProfile = () => 
    request(`/admin/profile`, { method: 'GET', auth: true });

export const updateAdminProfile = (data) => 
    request(`/admin/profile`, { method: 'PUT', auth: true, body: JSON.stringify(data) });

export const updateAdminAvatar = async (formData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/profile/avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload?.message || payload?.error || 'Request failed');
    }
    return payload;
};

export const changeAdminPassword = (data) => 
    request(`/admin/profile/change-password`, { method: 'POST', auth: true, body: JSON.stringify(data) });
