import React from 'react';

export const PostSkeleton = () => {
  return (
    <div className="bg-surface-color rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-800 animate-pulse w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
        </div>
      </div>
      
      {/* Content Text */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
      </div>

      {/* Media Box */}
      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>

      {/* Reactions Bar */}
      <div className="flex gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-b-3xl"></div>
      <div className="max-w-screen-xl w-full mx-auto px-4 mt-8 flex flex-wrap gap-8">
        <div className="w-32 h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="w-32 h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="w-32 h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
    </div>
  );
};
