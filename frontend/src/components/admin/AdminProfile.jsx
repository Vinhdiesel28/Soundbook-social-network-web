import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Key, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getAdminProfile, updateAdminProfile, updateAdminAvatar, changeAdminPassword } from '../../services/adminApi';

const AdminProfile = ({ t }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profile, setProfile] = useState({ displayName: '', email: '', role: 'ADMIN', avatarUrl: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Cropping State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getAdminProfile();
      if (res) setProfile(res.data || res);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateAdminProfile({ displayName: profile.displayName });
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      await changeAdminPassword({ 
        oldPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      alert("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Failed to change password", error);
      alert("Error changing password");
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleAvatarSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
      // Reset input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const uploadCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('file', file);
      
      await updateAdminAvatar(formData);
      fetchProfile();
      setImageSrc(null); // Close modal
    } catch (error) {
      console.error("Failed to upload avatar", error);
      alert("Error uploading avatar");
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6 animate-in fade-in duration-300 relative">
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-6 text-center">{t('admin.nav.profile')}</h3>

        <div className="flex flex-col items-center gap-10">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-4 border-surface-color shadow-lg overflow-hidden flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-white font-bold">{profile.displayName?.[0] || 'A'}</span>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarSelect} className="hidden" accept="image/*" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-transform hover:scale-105"
                title="Change Avatar"
              >
                <Camera size={18} />
              </button>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full">
              {profile.role || 'ADMIN'}
            </span>
          </div>

          {/* Info */}
          <div className="w-full max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.name')}</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.email')}</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm font-medium outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.current_role')}</label>
                <div className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm text-gray-500 cursor-not-allowed">
                  {profile.role || 'ADMIN'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('admin.profile.last_login')}</label>
                <div className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm text-gray-500 cursor-not-allowed">
                  Recent
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                onClick={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text-color rounded-lg text-sm font-semibold transition-colors"
              >
                <Key size={16} /> {t('admin.profile.change_password')}
              </button>

              <button
                onClick={handleUpdateProfile}
                className="w-full sm:w-auto px-10 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5">
                {t('admin.profile.update')}
              </button>
            </div>

            {/* Password Modal inline */}
            {isPasswordModalOpen && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
                <h4 className="text-sm font-bold mb-4">{t('admin.profile.change_password')}</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-text-muted font-medium">{t('admin.profile.current_pwd')}</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-text-muted font-medium">{t('admin.profile.new_pwd')}</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-text-muted font-medium">{t('admin.profile.confirm_pwd')}</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="px-4 py-2 rounded-lg font-medium text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {t('admin.profile.pwd_cancel')}
                    </button>
                    <button 
                      onClick={handleChangePassword}
                      className="px-5 py-2 rounded-lg font-bold text-sm bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                      {t('admin.profile.pwd_save')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-color w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10 relative">
              <h3 className="font-bold">Cắt ảnh đại diện</h3>
              <button onClick={() => setImageSrc(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="relative w-full h-[400px] bg-black/50">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-4 z-10 relative">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-2 block">Thu phóng</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-primary-500"
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  onClick={() => setImageSrc(null)}
                  className="px-4 py-2 font-semibold text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-text-color rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={uploadCroppedImage}
                  className="px-6 py-2 font-bold text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-md transition-colors"
                >
                  Lưu & Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
