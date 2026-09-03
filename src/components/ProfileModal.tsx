import React, { useState } from 'react';
import { UserProfile, Friend } from '../types';
import { X, User, Lock, KeyRound, Shield, Check, Heart, UserMinus, Ban, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onRemoveFriend: (friendId: string) => void;
  onToggleBlockFriend: (friendId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onRemoveFriend,
  onToggleBlockFriend,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'password' | 'friends'>('details');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({ text: 'Please enter your current password.', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    setPasswordMsg({ text: 'Password successfully changed and secured!', isError: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="profile-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-600/30">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">{user.name}</h2>
              <span className="text-xs text-slate-400 font-mono">ID: {user.id}</span>
            </div>
          </div>
          <button
            id="profile-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            id="profile-tab-details"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>
          <button
            id="profile-tab-password"
            onClick={() => setActiveTab('password')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'password'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <button
            id="profile-tab-friends"
            onClick={() => setActiveTab('friends')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'friends'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Friends ({user.friends.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Full Name</span>
                  <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Age</span>
                  <span className="text-sm font-semibold text-slate-100">{user.age} years old</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Gender</span>
                  <span className="text-sm font-semibold text-slate-100">{user.gender}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Current M-Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-cyan-400">{user.currentMScore}</span>
                    <span className="text-[11px] text-emerald-400 font-medium">(Optimal Resilience)</span>
                  </div>
                </div>
              </div>

              {/* Bio Summary Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-300">Mental Wellness Health Profile</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your baseline M-Score has advanced by <strong className="text-emerald-400">+{user.currentMScore - user.previousMScore} points</strong> since your last check-in. Cognitive resilience is stable with positive circadian rhythm adherence.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordMsg && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    passwordMsg.isError
                      ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                      : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  id="profile-current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  id="profile-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  id="profile-confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button
                id="profile-save-password-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </form>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Manage your wellness network. Remove connections or block access anytime.
              </p>
              <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                {user.friends.map((friend) => {
                  const isBlocked = user.blockedFriends?.includes(friend.id);
                  return (
                    <div key={friend.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${isBlocked ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                              {friend.name}
                            </span>
                            {isBlocked && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-400">
                                Blocked
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono">M-Score: {friend.mScore}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          id={`profile-block-friend-${friend.id}`}
                          onClick={() => onToggleBlockFriend(friend.id)}
                          className={`px-2 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                            isBlocked
                              ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                              : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-400'
                          }`}
                        >
                          <Ban className="w-3 h-3" />
                          <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                        </button>
                        <button
                          id={`profile-remove-friend-${friend.id}`}
                          onClick={() => onRemoveFriend(friend.id)}
                          className="px-2 py-1 rounded text-xs font-medium bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
                        >
                          <UserMinus className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
