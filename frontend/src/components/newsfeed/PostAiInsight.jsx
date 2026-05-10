import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, RefreshCw, MessageSquare, History, Maximize2, Minimize2, Paperclip } from 'lucide-react';
import { aiApi } from '../../services/ai';
import { resolveUrl } from '../../services/auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostAiInsight = ({ isOpen, onClose, post }) => {
  const [insight, setInsight] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      console.log('AI Insight Panel Opened for post:', post.id);
      if (!insight) fetchInsight();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, insight]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInsight = async () => {
    try {
      setIsLoading(true);
      const response = await aiApi.getPostInsight(post.id);
      setInsight(response);
    } catch (error) {
      console.error('Error fetching insight:', error);
      setInsight('Không thể lấy được phân tích từ AI. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setChatHistory(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      setIsLoading(true);
      const response = await aiApi.chatWithPost(post.id, userMessage);
      setChatHistory(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { type: 'ai', content: 'Có lỗi xảy ra khi trò chuyện với AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const MarkdownRenderer = ({ content, className = "" }) => (
    <div className={`prose prose-sm dark:prose-invert max-w-none 
      prose-p:leading-relaxed prose-p:mb-2
      prose-headings:text-text-color prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
      prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-text-color prose-strong:font-bold
      prose-ul:list-disc prose-ul:ml-4 prose-ul:mb-2
      prose-li:mb-1
      break-words overflow-hidden
      ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          className={`fixed right-6 bottom-6 z-[9999] bg-white dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14 w-64' : 'h-[600px] w-[400px] max-w-[calc(100vw-48px)]'
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800 bg-primary-500/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-500 rounded-lg text-white">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-sm text-text-color">Soundbook AI</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-text-muted hover:text-text-color transition-colors"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Content area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {/* Post Summary Preview */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={resolveUrl(post.user.avatarUrl)} className="w-6 h-6 rounded-full" alt="" />
                    <span className="text-xs font-bold text-text-color">{post.user.name}</span>
                    <span className="text-[10px] text-text-muted">· {post.user.time}</span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{post.content}</p>
                </div>

                {/* AI Insight */}
                {!insight && isLoading ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary-500">
                      <RefreshCw size={14} className="animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-wider">AI Đang phân tích bài viết...</span>
                    </div>
                    <div className="space-y-2">
                       <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
                       <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-[90%] animate-pulse" />
                       <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-[80%] animate-pulse" />
                    </div>
                  </div>
                ) : insight ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary-500">
                      <History size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Phân tích bài viết</span>
                    </div>
                    <MarkdownRenderer content={insight} />
                  </div>
                ) : null}

                {/* Chat History */}
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${chat.type === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-text-color rounded-bl-none'
                      }`}>
                      <MarkdownRenderer content={chat.content} className={chat.type === 'user' ? 'prose-p:text-white prose-strong:text-white' : ''} />
                    </div>
                  </div>
                ))}

                {isLoading && chatHistory.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-color cursor-pointer">
                    <Paperclip size={18} />
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Hỏi gì đó về bài viết này..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none outline-none rounded-2xl py-3 pl-10 pr-24 text-sm text-text-color placeholder-gray-400 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none max-h-32"
                    rows={1}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-text-muted">
                      <span>Fast</span>
                      <Minimize2 size={10} className="rotate-180" />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default PostAiInsight;
