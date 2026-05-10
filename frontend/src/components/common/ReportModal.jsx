import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { reportsApi } from '../../services/reports';

const ReportModal = ({ isOpen, onClose, onSubmit, type, targetId }) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState('SPAM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  // Reset notice when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setNotice(null);
      console.log(`[ReportModal] Opened: type=${type}, targetId=${targetId}`);
    }
  }, [isOpen, type, targetId]);

  const reasons = [
    { id: 'SPAM', label: t('report.reason.spam') },
    { id: 'HARASSMENT', label: t('report.reason.harassment') },
    { id: 'HATE_SPEECH', label: t('report.reason.hate_speech') },
    { id: 'NUDITY', label: t('report.reason.nudity') },
    { id: 'VIOLENCE', label: t('report.reason.violence') },
    { id: 'MISINFORMATION', label: t('report.reason.misinformation') },
    { id: 'OTHER', label: t('report.reason.other') }
  ];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!reason || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const targetType = (type || 'POST').toUpperCase();
      
      if (!targetId) {
        console.error('ReportModal: targetId is missing', { type, targetId, reason });
        setNotice({ type: 'error', message: 'Lỗi: Không tìm thấy ID đối tượng để báo cáo.' });
        setIsSubmitting(false);
        return;
      }

      // Ensure targetId is a number if it's a string from URL params or numeric ID
      const finalTargetId = typeof targetId === 'string' && !isNaN(targetId) ? parseInt(targetId, 10) : targetId;
      
      const data = { 
        reason, 
        description, 
        targetType, 
        targetId: finalTargetId
      };

      if (onSubmit) {
        await onSubmit(data);
      } else {
        await reportsApi.createReport(data);
      }
      
      setNotice({ type: 'success', message: t('report.success_message') || 'Cảm ơn bạn đã báo cáo. Đội ngũ quản trị sẽ xem xét trong thời gian sớm nhất.' });
      setTimeout(() => {
        onClose();
        setNotice(null);
      }, 2000);
    } catch (err) {
      console.error('Report failed', err);
      setNotice({ type: 'error', message: err?.message || 'Có lỗi xảy ra khi gửi báo cáo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !notice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col max-h-[90vh]">
        {notice ? (
          <div className="p-8 text-center relative">
            <button 
              type="button" 
              onClick={() => { setNotice(null); if (notice.type === 'success') onClose(); }} 
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              notice.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'
            }`}>
              {notice.type === 'success' ? <Check size={32} /> : <AlertTriangle size={32} />}
            </div>
            <h3 className="text-xl font-bold mb-2">{notice.type === 'success' ? 'Thành công' : 'Lỗi'}</h3>
            <p className="text-sm text-text-muted">{notice.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  {type === 'DM_THREAD' || type === 'DM_MESSAGE' ? 'Báo cáo tin nhắn' : 
                   type === 'OTHER' ? 'Báo cáo nội dung khác' : t('report.title')}
                </h2>
                <p className="text-[10px] text-text-muted mt-0.5">Giúp cộng đồng Soundbook lành mạnh hơn</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar">
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-3">
                  {t('report.reason')}
                </label>
                <div className="space-y-1.5">
                  {reasons.map((r) => (
                    <label 
                      key={r.id} 
                      onClick={() => setReason(r.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        reason === r.id 
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' 
                          : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        reason === r.id ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {reason === r.id && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </div>
                      <span className="text-sm font-medium">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="description" className="block text-sm font-semibold mb-2">
                  {t('report.details')}
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('report.details_placeholder')}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-text-muted transition-shadow"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                {t('report.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason}
                className="px-5 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-rose-500/20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {t('report.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
