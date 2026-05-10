import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Music2, Settings2 } from 'lucide-react';
import { tasteApi } from '../../services/taste';

const Chip = ({ children }) => <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">{children}</span>;

const TasteSummaryCard = () => {
  const [taste, setTaste] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    tasteApi.getMyTaste()
      .then(data => { if (mounted) setTaste(data); })
      .catch(err => { if (mounted) setError(err.message || 'Không thể tải Taste DNA.'); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-surface-color p-5 shadow-sm dark:border-gray-800">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Taste DNA</h3>
          <p className="mt-1 text-xs text-text-muted">Gu âm nhạc và sách/truyện dùng để tính Match Score.</p>
        </div>
        <Link to="/taste-settings" className="rounded-xl bg-primary-500/10 p-2 text-primary-500 hover:bg-primary-500/20" title="Chỉnh sửa sở thích">
          <Settings2 size={18} />
        </Link>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {!taste && !error ? <p className="text-sm text-text-muted">Đang tải...</p> : null}
      {taste ? (
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Music2 size={16} /> Music DNA</div>
            <div className="flex flex-wrap gap-2">
              {(taste.musicGenres || []).slice(0, 5).map(item => <Chip key={item}>{item}</Chip>)}
              {(taste.musicGenres || []).length === 0 ? <span className="text-xs text-text-muted">Chưa có dữ liệu</span> : null}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><BookOpen size={16} /> Book DNA</div>
            <div className="flex flex-wrap gap-2">
              {(taste.bookGenres || []).slice(0, 5).map(item => <Chip key={item}>{item}</Chip>)}
              {(taste.bookGenres || []).length === 0 ? <span className="text-xs text-text-muted">Chưa có dữ liệu</span> : null}
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-xs text-text-muted dark:bg-gray-800/60">
            Version: <strong>{taste.version || 0}</strong> · Music confidence: <strong>{Math.round(Number(taste.musicConfidence || 0) * 100)}%</strong> · Book confidence: <strong>{Math.round(Number(taste.bookConfidence || 0) * 100)}%</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TasteSummaryCard;
