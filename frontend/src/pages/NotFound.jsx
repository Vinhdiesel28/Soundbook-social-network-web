import React from 'react';
import { Link } from 'react-router-dom';
import { Disc3, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-color text-text-color flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <Disc3 className="w-[800px] h-[800px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Broken Vinyl Illustration */}
        <div className="relative w-48 h-48 mx-auto mb-8 drop-shadow-2xl">
          <div className="absolute inset-0 bg-gray-900 rounded-full border-8 border-gray-800 flex items-center justify-center overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 border-4 border-gray-800" />
            <div className="absolute w-4 h-4 bg-gray-200 dark:bg-bg-color rounded-full" />
            
            {/* The "Crack" */}
            <div className="absolute inset-0 text-white/20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M50 0 L45 20 L55 35 L48 50 L52 70 L40 100" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M0 50 L20 45 L35 55 L50 48 L70 52 L100 40" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-6xl font-black mb-4 tracking-tight bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4">Track Not Found</h2>
        <p className="text-text-muted mb-8 text-lg">
          Looks like this record is scratched or the page has been moved. Let's get you back to the music.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 hover:-translate-y-1 transition-all shadow-lg shadow-primary-500/30"
        >
          <ArrowLeft size={18} />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
