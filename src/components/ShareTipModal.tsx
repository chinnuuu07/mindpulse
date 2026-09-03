import React, { useState } from 'react';
import { Friend } from '../types';
import { X, Share2, CheckCircle2, Send, Users, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipTitle: string;
  tipSummary: string;
  category?: string;
  friends: Friend[];
  onConfirmShare: (friendName: string, tipTitle: string) => void;
}

export const ShareTipModal: React.FC<ShareTipModalProps> = ({
  isOpen,
  onClose,
  tipTitle,
  tipSummary,
  category = 'Wellness Tip',
  friends,
  onConfirmShare,
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string>('all');
  const [personalNote, setPersonalNote] = useState<string>('Thought this would help boost your M-Score!');
  const [sharedSuccess, setSharedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#34d399', '#38bdf8'],
    });

    const targetName =
      selectedFriendId === 'all'
        ? 'All Friends'
        : friends.find((f) => f.id === selectedFriendId)?.name || 'Friend';

    onConfirmShare(targetName, tipTitle);
    setSharedSuccess(true);
    setTimeout(() => {
      setSharedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      id="share-tip-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="share-tip-modal-container"
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Share2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">
                Share Wellness Tip
              </h2>
              <span className="text-xs text-slate-400">
                Inspire your friends &amp; earn +2 M-Score Points
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

        {sharedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Tip Shared Successfully!</h3>
            <p className="text-xs text-slate-400">
              Your friend has received this wellness insight in their bio-network mailbox.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono">
              <Award className="w-4 h-4 text-indigo-400" />
              +2 M-Score Social Connection Bonus Awarded!
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Preview Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 uppercase tracking-wider border border-indigo-500/30">
                {category}
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-1">{tipTitle}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {tipSummary}
              </p>
            </div>

            {/* Friend Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Select Recipient:</span>
                <span className="text-[10px] text-indigo-400 font-mono">
                  {friends.length} Friends Connected
                </span>
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {/* Broadcast Option */}
                <div
                  onClick={() => setSelectedFriendId('all')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedFriendId === 'all'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs block">Broadcast to All Friends</span>
                      <span className="text-[10px] text-slate-400 font-mono">Share with entire circle</span>
                    </div>
                  </div>
                  {selectedFriendId === 'all' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  )}
                </div>

                {/* Individual Friends */}
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriendId(friend.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      selectedFriendId === friend.id
                        ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <span className="text-xs block">{friend.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          M-Score: {friend.mScore}/100
                        </span>
                      </div>
                    </div>
                    {selectedFriendId === friend.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Personal Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Add a personal note:
              </label>
              <input
                type="text"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="Write a warm mindful message..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-950"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Friend</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
