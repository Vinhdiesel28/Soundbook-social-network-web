import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Setup logic here (JWT auth simulation)
    // Default flow: redirect to onboarding for new users or feed for returning
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-bg-color text-text-color flex flex-col md:flex-row">
      
      {/* LEFT SIDE: Branding / Art */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-primary-600 via-purple-700 to-black overflow-hidden items-center justify-center p-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        
        {/* Branding text */}
        <div className="relative z-10 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-600 animate-[spin_10s_linear_infinite]">
              <Disc3 size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Soundbook</h1>
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Where Music & Books Connect Souls
          </h2>
          <p className="text-xl text-white/80 font-medium">
            Discover a new kind of social network. Find friends with the same Music DNA, share what you're reading, and sync up your listening experience.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-sm relative z-10">
          
          <div className="mb-10 text-center md:text-left">
            <div className="md:hidden flex items-center justify-center gap-2 mb-6 text-primary-500">
               <Disc3 size={32} className="animate-[spin_10s_linear_infinite]" />
               <span className="text-2xl font-black">Soundbook</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-text-muted">
              {isLogin ? 'Enter your details to access your account.' : 'Join to explore the best personalized feed.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Username</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="johndoe"
                    className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm mb-1"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs font-medium text-primary-500 hover:underline">Forgot password?</a>
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-3 font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4">
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-text-muted uppercase font-semibold">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          <button className="w-full bg-surface-color border border-gray-200 dark:border-gray-800 rounded-xl py-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center gap-3">
             <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
             Google
          </button>

          <p className="mt-8 text-center text-sm text-text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={handleToggle} className="text-primary-500 font-semibold hover:underline">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
