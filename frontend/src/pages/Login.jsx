import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', username: '', password: '', displayName: '' });
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', username: '', password: '', displayName: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
      <div className="min-h-screen bg-bg-color text-text-color flex flex-col md:flex-row">

        {/* Left side */}
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
                  className="w-full bg-primary-500 text-white rounded-xl py-3 font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLogin ? t('login.signin_btn') : t('login.register_btn')}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-text-muted">
              {isLogin ? t('login.no_account') + ' ' : t('login.have_account') + ' '}
              <button onClick={handleToggle} className="text-primary-500 font-semibold hover:underline">
                {isLogin ? t('login.signup_link') : t('login.login_link')}
              </button>
            </p>
          </div>

          {/* Language */}
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