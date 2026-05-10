import { API_BASE_URL, getToken, request } from './auth';

export const spotifyIntegrationApi = {
    async getStatus() {
        try {
            const payload = await request('/integrations/spotify/status', {
                method: 'GET',
                auth: true,
            });
            return payload?.data || { connected: false, status: 'DISCONNECTED' };
        } catch {
            return { connected: false, status: 'DISCONNECTED' };
        }
    },

    async disconnect() {
        const payload = await request('/integrations/spotify/disconnect', {
            method: 'POST',
            auth: true,
        });
        return payload?.data || { connected: false, status: 'DISCONNECTED' };
    },

    async sync() {
        const payload = await request('/integrations/spotify/sync', {
            method: 'POST',
            auth: true,
        });
        return payload?.data || {
            savedRecentTracksCount: 0,
            topArtists: [],
            topGenres: [],
            recentlyPlayed: [],
        };
    },
};

export const startSpotifyConnect = async (returnPath = '/onboarding') => {
    const token = getToken();
    if (!token) {
        throw new Error('Bạn cần đăng nhập trước khi kết nối Spotify.');
    }

    const backendBaseUrl = API_BASE_URL.replace(/\/api\/v1$/, '');
    const returnTo = encodeURIComponent(returnPath);
    window.location.href = `${backendBaseUrl}/api/v1/integrations/spotify/connect?returnTo=${returnTo}`;
};