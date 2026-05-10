import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TasteEditor from '../components/taste/TasteEditor';
import { fetchCurrentUser } from '../services/auth';
import { tasteApi } from '../services/taste';

const Onboarding = () => {
  const navigate = useNavigate();
  const [initialTaste, setInitialTaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadTaste = async () => {
      try {
        const taste = await tasteApi.getMyTaste();
        if (mounted) setInitialTaste(taste);
      } catch (err) {
        if (mounted) setError(err.message || 'Không thể tải Taste DNA hiện tại.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTaste();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await tasteApi.saveMyTaste(payload);
      await fetchCurrentUser().catch(() => null);
      navigate('/feed', { replace: true });
    } catch (err) {
      setError(err.message || 'Không thể lưu Taste DNA.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-color text-text-color px-4 py-8 sm:px-6 lg:px-8">
      {loading ? (
        <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-gray-200 bg-surface-color p-8 text-center shadow-sm dark:border-gray-800">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-500/20 border-t-primary-500" />
          <p className="font-semibold">Đang chuẩn bị onboarding...</p>
        </div>
      ) : (
        <>
          {error ? (
            <div className="mx-auto mb-5 max-w-5xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          ) : null}
          <TasteEditor
            initialTaste={initialTaste}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Hoàn tất onboarding"
          />
        </>
      )}
    </div>
  );
};

export default Onboarding;
