import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { spotifyIntegrationApi, startSpotifyConnect } from '../../services/spotifyIntegration';

const ConnectedAccounts = ({ t }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState({ connected: false, status: 'DISCONNECTED' });
  const [syncData, setSyncData] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [action, setAction] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const copy = useMemo(() => {
    if (language === 'vi') {
      return {
        connect: 'Kết nối Spotify',
        disconnect: 'Ngắt kết nối',
        sync: 'Đồng bộ ngay',
        connected: 'Đã kết nối',
        disconnected: 'Chưa kết nối',
        checking: 'Đang kiểm tra kết nối Spotify...',
        connectedAs: 'Kết nối với',
        notConnectedHint: 'Kết nối Spotify để lấy top artists, top genres và recently played.',
        tokenExpired: 'Access token đã hết hạn. Hệ thống sẽ tự refresh khi bạn bấm Đồng bộ.',
        topArtists: 'Top Artists',
        topGenres: 'Top Genres',
        recentlyPlayed: 'Recently Played',
        savedRecentTracks: 'Số track mới đã lưu',
        loadingAction: 'Đang xử lý...',
        connectSuccess: 'Kết nối Spotify thành công.',
        disconnectSuccess: 'Đã ngắt kết nối Spotify.',
        syncSuccess: 'Đồng bộ Spotify thành công.',
      };
    }

    return {
      connect: 'Connect Spotify',
      disconnect: 'Disconnect',
      sync: 'Sync now',
      connected: 'Connected',
      disconnected: 'Disconnected',
      checking: 'Checking Spotify connection...',
      connectedAs: 'Connected as',
      notConnectedHint: 'Connect Spotify to fetch top artists, top genres, and recently played tracks.',
      tokenExpired: 'The access token is expired. The backend will refresh it automatically when you sync.',
      topArtists: 'Top Artists',
      topGenres: 'Top Genres',
      recentlyPlayed: 'Recently Played',
      savedRecentTracks: 'New tracks saved',
      loadingAction: 'Processing...',
      connectSuccess: 'Spotify connected successfully.',
      disconnectSuccess: 'Spotify disconnected successfully.',
      syncSuccess: 'Spotify synced successfully.',
    };
  }, [language]);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    setError('');

    try {
      const data = await spotifyIntegrationApi.getStatus();
      setStatus(data);
    } catch (err) {
      if (err.status === 401) {
        setError(language === 'vi' ? 'Bạn cần đăng nhập lại để dùng Spotify integration.' : 'Please sign in again to use Spotify integration.');
      } else {
        setError(err.message || 'Cannot load Spotify status');
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spotifyState = params.get('spotify');
    const message = params.get('message');

    if (!spotifyState) {
      return;
    }

    if (spotifyState === 'connected') {
      setNotice(message || copy.connectSuccess);
      fetchStatus();
    } else if (spotifyState === 'error') {
      setError(message || 'Spotify integration failed');
    }

    if (location.pathname.startsWith('/profile/')) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate, copy.connectSuccess]);

  const handleConnect = async () => {
    setAction('connect');
    setError('');
    setNotice('');

    try {
      await startSpotifyConnect(location.pathname);
    } catch (err) {
      setError(err.message || 'Cannot start Spotify OAuth');
      setAction('');
    }
  };

  const handleDisconnect = async () => {
    setAction('disconnect');
    setError('');
    setNotice('');

    try {
      await spotifyIntegrationApi.disconnect();
      setStatus({ connected: false, status: 'DISCONNECTED' });
      setSyncData(null);
      setNotice(copy.disconnectSuccess);
    } catch (err) {
      setError(err.message || 'Cannot disconnect Spotify');
    } finally {
      setAction('');
    }
  };

  const handleSync = async () => {
    setAction('sync');
    setError('');
    setNotice('');

    try {
      const data = await spotifyIntegrationApi.sync();
      setSyncData(data);
      setNotice(copy.syncSuccess);
      await fetchStatus();
    } catch (err) {
      setError(err.message || 'Cannot sync Spotify data');
    } finally {
      setAction('');
    }
  };

  const isBusy = action !== '';

  return (
    <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted mb-1">
            {t('profile.connected_accounts')}
          </h3>
          <p className="text-xs text-text-muted">Spotify OAuth</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${status.connected ? 'text-[#1DB954] bg-[#1DB954]/10' : 'text-gray-500 bg-gray-100 dark:bg-gray-800'}`}>
          {status.connected ? copy.connected : copy.disconnected}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Spotify</p>
              {loadingStatus ? (
                <p className="text-xs text-text-muted">{copy.checking}</p>
              ) : status.connected ? (
                <div className="space-y-1">
                  <p className="text-xs text-text-muted truncate">
                    {copy.connectedAs} {status.spotifyDisplayName || status.spotifyUserId || 'Spotify user'}
                  </p>
                  {status.tokenExpired && (
                    <p className="text-[11px] text-amber-500">{copy.tokenExpired}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-text-muted">{copy.notConnectedHint}</p>
              )}
            </div>
          </div>
        </div>

        {notice && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-300">
            {notice}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!status.connected ? (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isBusy}
              className="px-4 py-2 rounded-xl bg-[#1DB954] text-white text-sm font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-60"
            >
              {action === 'connect' ? copy.loadingAction : copy.connect}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSync}
                disabled={isBusy}
                className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                {action === 'sync' ? copy.loadingAction : copy.sync}
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={isBusy}
                className="px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60"
              >
                {action === 'disconnect' ? copy.loadingAction : copy.disconnect}
              </button>
            </>
          )}
        </div>

        {syncData && (
          <div className="space-y-4 pt-2">
            <div className="text-xs text-text-muted">
              {copy.savedRecentTracks}: <span className="font-semibold text-text-color">{syncData.savedRecentTracksCount}</span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{copy.topArtists}</p>
              <div className="space-y-2">
                {syncData.topArtists?.slice(0, 5).map((artist) => (
                  <div key={artist.id || artist.name} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                      {artist.imageUrl ? (
                        <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{artist.name}</p>
                      <p className="text-xs text-text-muted truncate">{artist.genres?.join(', ') || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{copy.topGenres}</p>
              <div className="flex flex-wrap gap-2">
                {syncData.topGenres?.map((genre) => (
                  <span key={genre} className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 text-xs font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{copy.recentlyPlayed}</p>
              <div className="space-y-2">
                {syncData.recentlyPlayed?.slice(0, 5).map((track) => (
                  <div key={track.trackId || `${track.title}-${track.playedAt}`} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                      {track.coverUrl ? (
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-text-muted truncate">{track.artists}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectedAccounts;
