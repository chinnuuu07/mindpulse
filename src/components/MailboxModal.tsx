import React from 'react';
import { FriendRequest } from '../types';
import { X, Mail, Check, Trash2, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface MailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: FriendRequest[];
  onAccept: (request: FriendRequest) => void;
  onReject: (requestId: string) => void;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({
  isOpen,
  onClose,
  requests,
  onAccept,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mailbox-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="mailbox-modal-container"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">Mailbox &amp; Requests</h2>
              <span className="text-xs text-slate-400">
                {requests.length} incoming wellness invitation{requests.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
          <button
            id="mailbox-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Requests List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <UserCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No pending friend invitations in your mailbox right now.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                id={`friend-request-${req.id}`}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.senderAvatar}
                      alt={req.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">{req.senderName}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                          M-Score {req.senderMScore}
                        </span>
                        <span className="text-[10px] text-slate-500">• {req.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  "{req.message}"
                </p>

                {/* Actions: Accept and Reject */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id={`accept-request-btn-${req.id}`}
                    onClick={() => onAccept(req)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Friend</span>
                  </button>
                  <button
                    id={`reject-request-btn-${req.id}`}
                    onClick={() => onReject(req.id)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
