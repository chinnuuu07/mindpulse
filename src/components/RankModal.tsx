import React from 'react';
import { Friend, UserProfile } from '../types';
import { X, Trophy, Medal, Crown, Sparkles, TrendingUp, Heart } from 'lucide-react';

interface RankModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  friends: Friend[];
}

export const RankModal: React.FC<RankModalProps> = ({
  isOpen,
  onClose,
  user,
  friends,
}) => {
  if (!isOpen) return null;

  // Combine user with friends
  const userEntry: Friend = {
    id: user.id,
    name: `${user.name} (You)`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    mScore: user.currentMScore,
    gender: user.gender,
    status: 'online',
  };

  const allParticipants = [userEntry, ...friends.filter((f) => !user.blockedFriends?.includes(f.id))];
  const sorted = [...allParticipants].sort((a, b) => b.mScore - a.mScore);

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  return (
    <div
      id="rank-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="rank-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-600/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">Friends M-Score Leaderboard</h2>
              <span className="text-xs text-slate-400">
                Peer Mental Resilience &amp; Mindful Comparison
              </span>
            </div>
          </div>
          <button
            id="rank-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top 3 High Scored Highlight Podium */}
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400 uppercase tracking-widest mb-5">
              <Crown className="w-4 h-4" />
              <span>Top 3 High Scored Leaders</span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end justify-center text-center">
              {/* 2nd Place */}
              {top2 && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <img
                      src={top2.avatar}
                      alt={top2.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow">
                      2
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[95px] block">
                    {top2.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-400 mt-0.5">
                    M-{top2.mScore}
                  </span>
                  <div className="w-full h-16 bg-slate-800/80 rounded-t-xl mt-2 flex items-center justify-center border-t border-x border-slate-700">
                    <Medal className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              )}

              {/* 1st Place (Highest) */}
              {top1 && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <Crown className="w-6 h-6 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                    <img
                      src={top1.avatar}
                      alt={top1.name}
                      className="w-18 h-18 rounded-full object-cover border-3 border-amber-400 shadow-lg shadow-amber-500/30"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center shadow">
                      1
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 truncate max-w-[105px] block">
                    {top1.name}
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                    M-{top1.mScore}
                  </span>
                  <div className="w-full h-22 bg-gradient-to-t from-amber-950/40 to-amber-900/30 rounded-t-xl mt-2 flex items-center justify-center border-t-2 border-x border-amber-400/80">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <img
                      src={top3.avatar}
                      alt={top3.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-700 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center shadow">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[95px] block">
                    {top3.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-400 mt-0.5">
                    M-{top3.mScore}
                  </span>
                  <div className="w-full h-12 bg-slate-800/60 rounded-t-xl mt-2 flex items-center justify-center border-t border-x border-slate-700">
                    <Medal className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complete Standings List */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2.5 uppercase tracking-widest">
              All Ranked Friends
            </span>
            <div className="divide-y divide-slate-800 rounded-xl bg-slate-950/80 border border-slate-700 overflow-hidden">
              {sorted.map((item, index) => {
                const isUser = item.id === user.id;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 text-xs transition ${
                      isUser
                        ? 'bg-indigo-950/40 border-l-4 border-indigo-500 font-semibold'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 text-center font-mono font-bold ${
                          index === 0
                            ? 'text-amber-400'
                            : index === 1
                            ? 'text-slate-300'
                            : index === 2
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <span className={`block leading-none ${isUser ? 'text-indigo-300 font-bold' : 'text-slate-200'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 capitalize">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        {item.mScore}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">M-PTS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
