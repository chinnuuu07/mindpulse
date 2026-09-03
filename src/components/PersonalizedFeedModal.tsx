import React, { useState } from 'react';
import { FeedItem, Friend } from '../types';
import {
  X,
  Sparkles,
  Bookmark,
  Share2,
  Heart,
  Clock,
  BookOpen,
  Apple,
  Wind,
  Stethoscope,
  Check,
  Search,
} from 'lucide-react';

interface PersonalizedFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedItems: FeedItem[];
  currentMScore: number;
  onToggleBookmark: (itemId: string) => void;
  onShareItem: (item: FeedItem) => void;
}

export const PersonalizedFeedModal: React.FC<PersonalizedFeedModalProps> = ({
  isOpen,
  onClose,
  feedItems,
  currentMScore,
  onToggleBookmark,
  onShareItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'meditation' | 'recipe' | 'article' | 'advice' | 'bookmarked'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = feedItems.filter((item) => {
    if (activeCategory === 'bookmarked') {
      if (!item.isBookmarked) return false;
    } else if (activeCategory !== 'all') {
      if (item.category !== activeCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCategoryBadge = (cat: FeedItem['category']) => {
    switch (cat) {
      case 'meditation':
        return (
          <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Wind className="w-3 h-3" /> Meditation
          </span>
        );
      case 'recipe':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Apple className="w-3 h-3" /> Healthy Recipe
          </span>
        );
      case 'article':
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Science Article
          </span>
        );
      case 'advice':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Stethoscope className="w-3 h-3" /> Expert Advice
          </span>
        );
    }
  };

  return (
    <div
      id="personalized-feed-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="personalized-feed-modal-container"
        className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">
                Personalized Wellness Feed
              </h2>
              <span className="text-xs text-slate-400">
                AI Curated for M-Score {currentMScore}/100 • Articles, Meditations, Recipes &amp; Advice
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 bg-slate-950/40 border-b border-slate-800 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Curations' },
              { id: 'meditation', label: 'Meditations' },
              { id: 'recipe', label: 'Healthy Recipes' },
              { id: 'article', label: 'Articles' },
              { id: 'advice', label: 'Doctor Advice' },
              { id: 'bookmarked', label: 'Saved Bookmarks' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search neuro-nutrition, breathwork, blood pressure, circadian rhythm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Feed Items List */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">No content found matching your filter.</p>
              <p className="text-xs text-slate-500">
                Try clearing your search or switching categories to explore more curated wellness guides.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden hover:border-slate-700 transition shadow-lg flex flex-col sm:flex-row"
                >
                  {/* Image banner */}
                  <div className="sm:w-48 h-40 sm:h-auto shrink-0 relative overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      {getCategoryBadge(item.category)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1.5">
                        <span className="font-medium text-indigo-300">
                          {item.author} • {item.authorRole}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.readTime}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Expanded In-depth Content */}
                      {isExpanded && (
                        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed animate-fade-in">
                          {item.content}
                        </div>
                      )}

                      {/* Tags & M-Score Match */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 font-bold uppercase font-mono">
                          {item.mScoreTarget}
                        </span>
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions: Read More, Bookmark, Share with Friends */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      >
                        {isExpanded ? 'Show Less' : 'Read Full Protocol & Guidelines'}
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => onToggleBookmark(item.id)}
                          className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                            item.isBookmarked
                              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                          title={item.isBookmarked ? 'Remove Bookmark' : 'Save / Bookmark Content'}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-amber-400' : ''}`}
                          />
                          <span className="hidden sm:inline">
                            {item.isBookmarked ? 'Saved' : 'Save'}
                          </span>
                        </button>

                        {/* Share with Friends Button */}
                        <button
                          onClick={() => onShareItem(item)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-950"
                          title="Share this tip with friends to earn +2 M-Score points"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Tip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
