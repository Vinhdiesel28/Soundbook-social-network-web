import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Book, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Indie', 'Lo-Fi', 'Metal', 'K-Pop', 'Country'];
const bookGenres = ['Fiction', 'Non-fiction', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Biography', 'History', 'Self-help', 'Poetry', 'Business'];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const navigate = useNavigate();

  const toggleSelection = (item, type) => {
    if (type === 'music') {
      setSelectedMusic(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else {
      setSelectedBooks(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-bg-color text-text-color flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-color rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary-500"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">What's your Music DNA?</h2>
                  <p className="text-text-muted mt-2">Pick at least 3 genres to customize your feed.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-[250px] custom-scrollbar">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {musicGenres.map(genre => {
                      const isSelected = selectedMusic.includes(genre);
                      return (
                        <button
                          key={genre}
                          onClick={() => toggleSelection(genre, 'music')}
                          className={`px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center gap-2 ${
                            isSelected 
                              ? 'border-primary-500 bg-primary-500/10 text-primary-500 font-medium' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {isSelected && <Check size={16} />}
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={nextStep}
                    disabled={selectedMusic.length < 3}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">What books do you consume?</h2>
                  <p className="text-text-muted mt-2">Pick at least 3 genres to find your reading buddies.</p>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[250px] custom-scrollbar">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {bookGenres.map(genre => {
                      const isSelected = selectedBooks.includes(genre);
                      return (
                        <button
                          key={genre}
                          onClick={() => toggleSelection(genre, 'books')}
                          className={`px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center gap-2 ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-500/10 text-orange-500 font-medium' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-orange-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {isSelected && <Check size={16} />}
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-text-muted hover:text-text-color transition-colors">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={selectedBooks.length < 3}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">Sync your Spotify</h2>
                  <p className="text-text-muted mt-2">Connect your account to auto-generate your Music DNA and share currently playing tracks to your Live Radar.</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] space-y-4">
                  <button className="w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 bg-[#1DB954] text-white rounded-xl font-bold hover:bg-[#1ed760] transition-colors shadow-lg shadow-green-500/30">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.361.181.54.78.301 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                    Connect Spotify
                  </button>
                  <button onClick={() => navigate('/feed')} className="w-full max-w-sm px-6 py-4 text-text-muted hover:text-text-color hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium">
                    Skip for now
                  </button>
                </div>

                <div className="mt-8 flex justify-start">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-2 text-text-muted hover:text-text-color transition-colors">
                    <ArrowLeft size={18} /> Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
