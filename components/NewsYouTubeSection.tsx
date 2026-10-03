'use client';

import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Youtube,
  Clock,
  User as UserIcon,
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';
import { NewsItem } from '@/lib/types';

export const NewsYouTubeSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (data.news) setNews(data.news);
      })
      .catch(() => {});
  }, []);

  const categories = ['All', 'Announcement', 'Tutorial', 'Tech News'];

  const filteredNews = news.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  // Helper to extract YouTube video ID if standard format
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    } catch (_) {
      return null;
    }
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Youtube className="w-3.5 h-3.5" />
            <span>MEDIA, TUTORIALS & NEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Latest Tech Updates & Video Tutorials
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Official announcements, computer lab video guides, graphic design Masterclasses, and local logistics developments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl hover:shadow-cyan-500/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 backdrop-blur-sm text-cyan-300 border border-cyan-500/30">
                      {item.category}
                    </span>
                  </div>
                  {item.youtubeUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By {item.author}</span>
                  </div>

                  <h3
                    onClick={() => setActiveModalItem(item)}
                    className="text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveModalItem(item)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>{item.youtubeUrl ? 'Watch Video & Read' : 'Read Full Story'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article / Video Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Embedded YouTube video if URL available */}
            {activeModalItem.youtubeUrl && getYouTubeEmbedUrl(activeModalItem.youtubeUrl) ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-5 bg-black border border-slate-800">
                <iframe
                  src={getYouTubeEmbedUrl(activeModalItem.youtubeUrl)!}
                  title={activeModalItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <img
                src={activeModalItem.thumbnailUrl}
                alt={activeModalItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 rounded-xl object-cover mb-5"
              />
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                {activeModalItem.category}
              </span>
              <span className="text-xs text-slate-400">
                Published on {new Date(activeModalItem.publishedAt).toLocaleDateString()} by {activeModalItem.author}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white leading-snug mb-4">
              {activeModalItem.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {activeModalItem.content}
            </div>

            {activeModalItem.youtubeUrl && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Watch directly on YouTube:</span>
                <a
                  href={activeModalItem.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Open Video</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
