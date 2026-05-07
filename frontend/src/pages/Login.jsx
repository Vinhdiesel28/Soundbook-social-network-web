import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { GoogleLogin } from '@react-oauth/google';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  // Thêm displayName vào formData để khớp với API Register
  const [formData, setFormData] = useState({ email: '', username: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false); // Thêm state loading để chặn bấm nút liên tục
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleGoogleLogin = async (idToken) => {
    if (!idToken) {
      alert('Google không trả về ID token hợp lệ. Vui lòng thử lại.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.data.token);
        const auth = {
            token: result.data.token,
            user: {
                id: result.data.userId,
                email: result.data.email,
                displayName: result.data.displayName,
                role: result.data.role?.toUpperCase().replace(/^ROLE_/, '')
            }
        };
        localStorage.setItem('soundbook_auth', JSON.stringify(auth));
        
        const isAdmin = ['ADMIN', 'MODERATOR'].includes(auth.user.role);
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/feed');
        }
      } else {
        alert(result.message || 'Đăng nhập Google thất bại.');
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      alert('Không thể kết nối đến Backend khi đăng nhập bằng Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    // Reset form khi chuyển chế độ
    setFormData({ email: '', username: '', password: '', displayName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // URL Backend của bạn (vì vite.config.js không đổi được nên dùng URL đầy đủ)
    const BASE_URL = 'http://localhost:8081/api/v1';
    const endpoint = isLogin ? `${BASE_URL}/auth/login` : `${BASE_URL}/auth/register`;

    // Chuẩn bị dữ liệu gửi lên
    const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
          email: formData.email,
          password: formData.password,
          // Ưu tiên dùng username làm displayName nếu không nhập displayName
          displayName: formData.displayName || formData.username
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        // 1. Lưu JWT Token vào LocalStorage để dùng cho các trang sau
        localStorage.setItem('token', result.data.token);
        
        // Lưu thông tin user để dùng cho việc phân quyền (isLoggedIn, isAdminRole)
        const auth = {
            token: result.data.token,
            user: {
                id: result.data.userId,
                email: result.data.email,
                displayName: result.data.displayName,
                role: result.data.role?.toUpperCase().replace(/^ROLE_/, '')
            }
        };
        localStorage.setItem('soundbook_auth', JSON.stringify(auth));

        // 2. Điều hướng người dùng
        if (isLogin) {
          const isAdmin = ['ADMIN', 'MODERATOR'].includes(auth.user.role);
          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/feed');
          }
        } else {
          // Người mới đăng ký thì đi qua trang Onboarding
          navigate('/onboarding');
        }
      } else {
        // Hiển thị thông báo lỗi từ Backend (Sai mật khẩu, Email đã tồn tại...)
        alert(result.message || "Thao tác thất bại. Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến Backend (Cổng 8081). Hãy chắc chắn bạn đã chạy ứng dụng Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-bg-color text-text-color flex flex-col md:flex-row">

        {/* Left side (Giữ nguyên giao diện đẹp của bạn) */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-primary-600 via-purple-700 to-black overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

          <div className="relative z-10 text-white max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-600 animate-[spin_10s_linear_infinite]">
                <Disc3 size={28} />
              </div>
              <h1 className="text-4xl font-black tracking-tight">Soundbook</h1>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">{t('login.branding_tagline')}</h2>
            <p className="text-xl text-white/80 font-medium">{t('login.branding_desc')}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
          <div className="w-full max-sm relative z-10">
            <div className="mb-10 text-center md:text-left">
              <div className="md:hidden flex items-center justify-center gap-2 mb-6 text-primary-500">
                <Disc3 size={32} className="animate-[spin_10s_linear_infinite]" />
                <span className="text-2xl font-black">Soundbook</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                {isLogin ? t('login.welcome_back') : t('login.create_account')}
              </h2>
              <p className="text-text-muted">
                {isLogin ? t('login.signin_desc') : t('login.register_desc')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/DisplayName - Chỉ hiện khi đăng ký */}
              {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">{t('login.label_username')}</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                          type="text"
                          required
                          placeholder="johndoe"
                          className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value, displayName: e.target.value })}
                      />
                    </div>
                  </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">{t('login.label_email')}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">{t('login.label_password')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                      type="password"
                      required
                      placeholder="......"
                      className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm mb-1"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                  type="submit"
                  disabled={loading} // Vô hiệu hóa nút khi đang gửi request
                  className={`w-full bg-primary-500 text-white rounded-xl py-3 font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? '...' : (isLogin ? t('login.signin_btn') : t('login.register_btn'))}
                <ArrowRight size={18} />
              </button>
            </form>

            {/* ... Các thành phần Google và Toggle giữ nguyên ... */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs text-text-muted uppercase font-semibold">{t('login.or_continue')}</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log('Token từ Google:', credentialResponse.credential);
                    handleGoogleLogin(credentialResponse?.credential);
                  }}
                  onError={() => {
                    console.log('Đăng nhập Google thất bại');
                    alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
                  }}
                  useOneTap
                  shape="pill"
                  theme="filled_blue"
              />
            </div>

            <p className="mt-8 text-center text-sm text-text-muted">
              {isLogin ? t('login.no_account') + ' ' : t('login.have_account') + ' '}
              <button onClick={handleToggle} className="text-primary-500 font-semibold hover:underline">
                {isLogin ? t('login.signup_link') : t('login.login_link')}
              </button>
            </p>
          </div>

          {/* Language Selection (Giữ nguyên) */}
          <div className="absolute bottom-6 left-0 w-full flex items-center justify-center gap-1 text-sm">
            <button onClick={() => setLanguage('vi')} className={`px-2 py-1 rounded-lg transition-colors font-medium ${language === 'vi' ? 'text-primary-500 font-semibold' : 'text-text-muted hover:text-text-color'}`}>Tiếng Việt</button>
            <span className="text-text-muted">|</span>
            <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded-lg transition-colors font-medium ${language === 'en' ? 'text-primary-500 font-semibold' : 'text-text-muted hover:text-text-color'}`}>English (UK)</button>
          </div>
        </div>
      </div>
  );
};

export default Login;