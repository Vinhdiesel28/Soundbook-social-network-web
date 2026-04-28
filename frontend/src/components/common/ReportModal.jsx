import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ReportModal = ({ isOpen, onClose, onSubmit, type, targetId }) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState('SPAM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    { id: 'SPAM', label: t('report.reason.spam') },
    { id: 'HARASSMENT', label: t('report.reason.harassment') },
    { id: 'HATE_SPEECH', label: t('report.reason.hate_speech') },
    { id: 'NUDITY', label: t('report.reason.nudity') },
    { id: 'FAKE_ACCOUNT', label: t('report.reason.fake_account') },
    { id: 'OTHER', label: t('report.reason.other') }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;
    
    setIsSubmitting(true);
    
    // Call the parent's onSubmit which should handle the API call
    // The parent will receive { reason, description, targetType: type, targetId }
    try {
      await onSubmit({ reason, description, targetType: type.toUpperCase(), targetId });
    } catch (error) {
      console.error('Failed to submit report', error);
    } finally {
      setIsSubmitting(false);
      onClose(); // Close the modal regardless of success for UI purposes for now
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle size={20} />
            <h2 className="font-bold text-lg text-text-color">{t('report.title')}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-text-muted hover:text-text-color rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-3">
              {t('report.reason')}
            </label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label 
                  key={r.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reason === r.id 
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    reason === r.id ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {reason === r.id && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                  </div>
                  <span className="text-sm font-medium">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold mb-2">
              {t('report.details')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('report.details_placeholder')}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-text-muted transition-shadow"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              {t('report.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {t('report.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
