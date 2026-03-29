import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const ProfileShelves = ({ t, shelves, isGuest = false }) => {
  const [editingShelfId, setEditingShelfId] = useState(null);

  const toggleEdit = (shelfId) => {
    setEditingShelfId(prev => prev === shelfId ? null : shelfId);
  };

  return (
    <div className="space-y-16">
      {shelves.map((shelf) => {
        const isEditing = editingShelfId === shelf.id;
        return (
          <div key={shelf.id} className="relative">
            <h3 className="text-lg font-bold text-text-muted mb-6 px-2 flex items-center gap-3">
              {shelf.title}
              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              {/* Edit */}
              {!isGuest && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Add */}
                  <button
                    title={t('common.add', { defaultValue: 'Add' })}
                    className="p-1.5 rounded-lg text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    onClick={() => { }}
                  >
                    <Plus size={15} />
                  </button>
                  {/* Edit */}
                  <button
                    title={isEditing ? t('common.done', { defaultValue: 'Done' }) : t('common.edit', { defaultValue: 'Edit' })}
                    className={`p-1.5 rounded-lg transition-colors ${isEditing ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
                    onClick={() => toggleEdit(shelf.id)}
                  >
                    {isEditing ? <Check size={15} /> : <Pencil size={15} />}
                  </button>
                  {/* Delete */}
                  <button
                    title={t('common.delete', { defaultValue: 'Delete' })}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    onClick={() => { }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </h3>

            <div className="flex gap-x-6 sm:gap-x-10 gap-y-12 flex-wrap items-end px-4 sm:px-8 min-h-[160px]">
              {shelf.items.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={!isEditing ? { y: -10, scale: 1.05, rotateY: item.type === 'book' ? -10 : 0, rotateX: item.type === 'music' ? 10 : 0 } : {}}
                  className="relative cursor-pointer group perspective-1000"
                >

                  {isEditing && (
                    <button
                      className="absolute -top-2 -right-2 z-40 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      title="Remove"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <X size={11} />
                    </button>
                  )}

                  <div className={`shadow-xl transition-shadow duration-300 group-hover:shadow-2xl ${item.style} ${!item.image ? 'flex items-center justify-center text-white/90 drop-shadow-sm text-sm font-bold text-center p-2 break-words leading-tight' : 'overflow-hidden'}`}>
                    {item.image
                      ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      : item.title
                    }
                  </div>

                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-black/20 dark:bg-black/50 blur-sm rounded-full" />

                  {/* Progress Bar */}
                  {item.progress !== undefined && (
                    <div className="absolute -bottom-5 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}

                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                    <div className="bg-surface-color text-text-color rounded-xl shadow-2xl p-3 text-sm w-48 border border-gray-200 dark:border-gray-700 transform scale-95 group-hover:scale-100 transition-transform">
                      <p className="font-bold break-words leading-snug">{item.title}</p>
                      <p className="text-text-muted text-xs break-words mb-1">{item.author}</p>
                      {item.rating && (
                        <div className="flex text-yellow-500 text-[10px]">
                          {'★'.repeat(item.rating)}
                        </div>
                      )}
                    </div>

                    <div className="w-3 h-3 bg-surface-color border-b border-r border-gray-200 dark:border-gray-700 absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45" />
                  </div>

                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-sm shadow-md flex -z-10 items-end overflow-hidden">
              <div className="w-full h-1 bg-black/10" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileShelves;
