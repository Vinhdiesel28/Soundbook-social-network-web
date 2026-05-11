import React, { useState, useEffect, useRef } from 'react';
import { Search, ShieldCheck, ExternalLink, XCircle, Eye, X, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getReports, getReportById, reviewReport, resolveReport, rejectReport } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminReports = ({ t, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailReport, setDetailReport] = useState(null);
  const { showToast, confirm } = useToast();
  const isFirstMount = useRef(true);

  useEffect(() => {
    fetchReports(1);
  }, []);

  const fetchReports = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getReports({ page, size: 10, keyword: searchQuery });
      if (res.data && res.data.content) {
        setReports(res.data.content);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
        setCurrentPage(page);
      } else if (res.data && Array.isArray(res.data)) {
        setReports(res.data);
        setTotalPages(1);
        setTotalElements(res.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchReports(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleTargetClick = (report) => {
    if (!onNavigate) return;
    const { targetType, targetId, targetParentId } = report;
    const searchId = targetParentId || targetId;

    switch (targetType) {
      case 'USER': onNavigate('users', { searchQuery: searchId.toString() }); break;
      case 'POST': 
      case 'COMMENT': onNavigate('posts', { searchQuery: searchId.toString() }); break;
      case 'ROOM': onNavigate('rooms', { searchQuery: searchId.toString() }); break;
      case 'MESSAGE': 
      case 'DM_MESSAGE': onNavigate('messages', { searchQuery: searchId.toString() }); break;
      default: break;
    }
  };

  const handleViewDetail = async (id) => {
    try {
      let res = await getReportById(id);
      let reportData = res.data;
      
      // Auto transition to UNDER_REVIEW if it's PENDING
      if (reportData.info.status === 'PENDING') {
        await reviewReport(id);
        res = await getReportById(id);
        reportData = res.data;
        fetchReports(); // Refresh the list in background
      }
      
      setDetailReport(reportData);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
      showToast('Lỗi lấy chi tiết báo cáo', 'error');
    }
  };

  const handleReview = async (id) => {
    try {
      await reviewReport(id);
      fetchReports();
    } catch (error) {
      console.error("Failed to review report:", error);
    }
  };

  const handleResolve = async (id) => {
    const ok = await confirm({
      title: 'Xác nhận giải quyết',
      message: 'Xác nhận ĐÃ GIẢI QUYẾT báo cáo này? (Đã xử lý đối tượng vi phạm)',
      confirmText: 'Xác nhận',
      cancelText: 'Hủy'
    });
    
    if (ok) {
      try {
        await resolveReport(id, { action: 'RESOLVED', notes: 'Admin action' });
        showToast('Đã giải quyết báo cáo', 'success');
        fetchReports();
        if (detailReport && detailReport.info.id === id) setShowDetailModal(false);
      } catch (error) {
        console.error("Failed to resolve report:", error);
        showToast('Lỗi khi giải quyết báo cáo', 'error');
      }
    }
  };

  const handleReject = async (id) => {
    const ok = await confirm({
      title: 'Xác nhận bác bỏ',
      message: 'Xác nhận BÁC BỎ báo cáo này? (Báo cáo không hợp lệ)',
      confirmText: 'Bác bỏ',
      cancelText: 'Hủy'
    });

    if (ok) {
      try {
        await rejectReport(id);
        showToast('Đã bác bỏ báo cáo', 'info');
        fetchReports();
        if (detailReport && detailReport.info.id === id) setShowDetailModal(false);
      } catch (error) {
        console.error("Failed to reject report:", error);
        showToast('Lỗi khi bác bỏ báo cáo', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle size={12}/> Đã xử lý</span>;
      case 'REJECTED': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700"><XCircle size={12}/> Bác bỏ</span>;
      case 'REVIEWED': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><Search size={12}/> Đang xem xét</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"><Clock size={12}/> Chờ xử lý</span>;
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg">{t('admin.title.reports') || 'Quản lý Báo cáo'}</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="REVIEWED">Đang xem xét</option>
            <option value="RESOLVED">Đã xử lý</option>
            <option value="REJECTED">Bác bỏ</option>
          </select>
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm theo người báo cáo, lý do..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-text-muted border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4 font-medium">Người báo cáo</th>
              <th className="px-6 py-4 font-medium">Đối tượng</th>
              <th className="px-6 py-4 font-medium">Lý do</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium">Ngày báo cáo</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? <tr><td colSpan="6" className="text-center py-4 text-gray-500">Loading...</td></tr> : reports.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-gray-500">Không có báo cáo nào</td></tr> : reports.filter(report =>
              (statusFilter === 'ALL' || report.status === statusFilter)
            ).map(report => (
              <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-sm text-primary-500">{report.reporterName || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col items-start">
                    <button onClick={() => handleTargetClick(report)} className="font-bold flex items-center gap-1 hover:text-primary-500 hover:underline transition-all text-left">
                      {report.targetType} #{report.targetId} <ExternalLink size={12} className="text-text-muted" />
                    </button>
                    <span className="text-xs text-text-muted truncate max-w-[150px]">{report.targetSummary || 'Không có mô tả'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-red-500">{report.reason}</td>
                <td className="px-6 py-4">
                  {getStatusBadge(report.status)}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{new Date(report.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleViewDetail(report.id)} className="p-1.5 bg-gray-100 hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-primary-900/20 text-text-muted hover:text-primary-500 rounded-lg transition-colors" title="Xem chi tiết & Xử lý"><Eye size={16} /></button>
                    {report.status === 'PENDING' && (
                      <button onClick={() => handleReview(report.id)} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Đang xem xét (Review)"><Search size={16} /></button>
                    )}
                    {(report.status === 'PENDING' || report.status === 'REVIEWED') && (
                      <>
                        <button onClick={() => handleResolve(report.id)} className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors" title="Đã xử lý (Resolve)"><ShieldCheck size={16} /></button>
                        <button onClick={() => handleReject(report.id)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors" title="Bác bỏ (Reject)"><XCircle size={16} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-text-muted">Tổng cộng {totalElements} báo cáo</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => fetchReports(currentPage - 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 rounded text-sm font-medium transition-colors"
            >
              Trang trước
            </button>
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span>Trang</span>
              <input 
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                key={currentPage}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(e.currentTarget.value);
                    if (val >= 1 && val <= totalPages) fetchReports(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.currentTarget.value);
                  if (val >= 1 && val <= totalPages && val !== currentPage) fetchReports(val);
                  else e.currentTarget.value = currentPage;
                }}
                className="w-12 py-0.5 text-center border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span>/ {totalPages}</span>
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => fetchReports(currentPage + 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 rounded text-sm font-medium transition-colors"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && detailReport && detailReport.info && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface-color w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 bg-red-50/50 dark:bg-red-900/10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Chi tiết Báo cáo #{detailReport.info.id}</h3>
                  <p className="text-sm font-semibold text-text-muted">Được báo cáo bởi <span className="text-primary-500">{detailReport.info.reporterName}</span></p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-text-muted hover:text-text-color bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Trạng thái hiện tại</p>
                  <div className="mt-1">{getStatusBadge(detailReport.info.status)}</div>
                </div>
                {detailReport.reviewedByName && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Người tiếp nhận</p>
                    <p className="font-bold text-sm">{detailReport.reviewedByName}</p>
                    <p className="text-xs text-text-muted">{new Date(detailReport.reviewedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase text-text-muted mb-3 flex items-center gap-2"><ShieldCheck size={16}/> Nội dung tố cáo</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 rounded-xl">
                    <p className="text-xs font-semibold text-red-400 mb-1">Lý do vi phạm (Reason)</p>
                    <p className="font-bold text-red-600 dark:text-red-400">{detailReport.info.reason}</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <p className="text-xs font-semibold text-text-muted mb-1">Ngày gửi</p>
                    <p className="font-bold">{new Date(detailReport.info.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                    <p className="text-xs font-semibold text-text-muted mb-2">Mô tả chi tiết từ người dùng (Description)</p>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{detailReport.description || <span className="italic text-gray-500">Người dùng không cung cấp thêm mô tả chi tiết.</span>}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase text-text-muted mb-3 flex items-center gap-2"><ExternalLink size={16}/> Đối tượng bị tố cáo</h4>
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => { setShowDetailModal(false); handleTargetClick(detailReport.info); }} className="px-2 py-1 bg-gray-200 hover:bg-primary-100 hover:text-primary-600 dark:bg-gray-700 dark:hover:bg-primary-900/50 rounded text-xs font-bold transition-colors flex items-center gap-1">
                      {detailReport.info.targetType} <ExternalLink size={10} />
                    </button>
                    <span className="font-bold text-sm">ID: {detailReport.info.targetId}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-text-muted">{detailReport.info.targetSummary || 'Không có thông tin tóm tắt cho đối tượng này.'}</p>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 shrink-0 flex flex-col gap-3 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              {(detailReport.info.status === 'PENDING' || detailReport.info.status === 'REVIEWED') ? (
                <>
                  <p className="text-xs text-center text-text-muted mb-1">Hãy xem xét đối tượng vi phạm trên hệ thống trước khi đưa ra quyết định.</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleResolve(detailReport.info.id)} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-500/20">
                      <CheckCircle size={18} /> Đã xử lý (Khóa/Xóa vi phạm)
                    </button>
                    <button onClick={() => handleReject(detailReport.info.id)} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                      <XCircle size={18} /> Bác bỏ (Báo cáo sai)
                    </button>
                  </div>
                </>
              ) : (
                <button onClick={() => setShowDetailModal(false)} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors">
                  Đóng cửa sổ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
