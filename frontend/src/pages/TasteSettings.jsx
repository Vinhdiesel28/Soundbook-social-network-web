import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import TasteEditor from '../components/taste/TasteEditor';
import { fetchCurrentUser } from '../services/auth';
import { tasteApi } from '../services/taste';

const TasteSettings = () => {
  const [taste, setTaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadTaste = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tasteApi.getMyTaste();
      setTaste(data);
    } catch (err) {
      setError(err.message || 'Không thể tải Taste DNA.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaste();
  }, []);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setNotice('');
    setError('');
    try {
      const updated = await tasteApi.saveMyTaste(payload);
      setTaste(updated);
      await fetchCurrentUser().catch(() => null);
      setNotice('Đã cập nhật Taste DNA. Match Score và Discover sẽ dùng sở thích mới.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Không thể lưu Taste DNA.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-color text-text-color px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <Link to="/feed" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          <ArrowLeft size={16} /> Quay lại
        </Link>
        <button onClick={loadTaste} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-800">
          <RefreshCw size={16} /> Tải lại
        </button>
      </div>

      {notice ? <div className="mx-auto mb-5 max-w-5xl rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">{notice}</div> : null}
      {error ? <div className="mx-auto mb-5 max-w-5xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}

      {loading ? (
        <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-gray-200 bg-surface-color p-8 text-center shadow-sm dark:border-gray-800">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-500/20 border-t-primary-500" />
          <p className="font-semibold">Đang tải Taste DNA...</p>
        </div>
      ) : (
        <TasteEditor initialTaste={taste} onSubmit={handleSubmit} loading={saving} submitLabel="Lưu thay đổi Taste DNA" />
      )}
    </div>
  );
};

export default TasteSettings;
