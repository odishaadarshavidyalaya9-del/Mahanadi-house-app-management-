import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { 
  X, 
  Video, 
  Phone, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  ShieldCheck, 
  School, 
  Users, 
  Sparkles,
  Lock
} from 'lucide-react';
import { CallType, CallStatus } from '../../types/house';

interface CallsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallsModal: React.FC<CallsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users } = useHouse();

  const [activeCall, setActiveCall] = useState<{
    type: CallType;
    title: string;
    targetName: string;
    isVideo: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    roomCode: string;
  } | null>(null);

  const [roomCodeInput, setRoomCodeInput] = useState('');
  const otherMembers = users.filter(u => u.id !== currentUser?.id);

  if (!isOpen) return null;

  const handleStartCall = (type: CallType, targetName: string, isVideo: boolean, roomCode = '') => {
    const code = roomCode || `MAH-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveCall({
      type,
      title: type === 'JOIN_CALL' ? `House Assembly (${code})` : type === 'TEACHER_CAPTAIN_CALL' ? 'Leadership Direct Line' : `Peer Call: ${targetName}`,
      targetName,
      isVideo,
      isMuted: false,
      isVideoOff: false,
      roomCode: code,
    });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide">MAHANADI HOUSE CALLS</h2>
              <p className="text-[11px] text-blue-200 font-medium">Encrypted School Voice & Video Line</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (activeCall) handleEndCall();
              onClose();
            }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeCall ? (
            /* Active Call Screen */
            <div className="bg-slate-950 text-white rounded-2xl p-6 flex flex-col items-center justify-between min-h-[380px]">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Connected
                </div>
                <h3 className="text-xl font-black mt-3">{activeCall.targetName}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeCall.title}</p>
              </div>

              {/* Video/Avatar Stage */}
              <div className="w-36 h-36 rounded-full bg-slate-800/80 border-2 border-amber-400/40 flex flex-col items-center justify-center my-6 relative overflow-hidden shadow-inner">
                {activeCall.isVideo && !activeCall.isVideoOff ? (
                  <div className="flex flex-col items-center">
                    <Video className="w-12 h-12 text-sky-400 animate-pulse" />
                    <span className="text-[10px] text-sky-300 font-bold mt-1">HD Video Stream</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 text-amber-400" />
                    <span className="text-[10px] text-amber-300 font-bold mt-1">Voice Audio Active</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveCall({ ...activeCall, isMuted: !activeCall.isMuted })}
                  className={`p-3.5 rounded-full transition-all ${
                    activeCall.isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setActiveCall({ ...activeCall, isVideoOff: !activeCall.isVideoOff })}
                  className={`p-3.5 rounded-full transition-all ${
                    activeCall.isVideoOff ? 'bg-slate-700 text-slate-400' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {activeCall.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-lg"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Join Existing Meeting */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-slate-800/30 border border-blue-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider">JOIN HOUSE MEETING</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value)}
                    placeholder="Enter code (e.g. MAH-4821)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleStartCall('JOIN_CALL', 'Mahanadi House Assembly', true, roomCodeInput)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>

              {/* 2. Direct Hotline */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  LEADERSHIP DIRECT LINE
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStartCall('TEACHER_CAPTAIN_CALL', 'Mrs. Ananya Sharma (House Teacher)', true)}
                    className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <School className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">House Teacher</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Live Video Line</span>
                  </button>

                  <button
                    onClick={() => handleStartCall('TEACHER_CAPTAIN_CALL', 'Rohan Verma (House Captain)', true)}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">House Captain</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Live Video Line</span>
                  </button>
                </div>
              </div>

              {/* 3. Peer Member Calling */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  HOUSE PEER MEMBERS
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {otherMembers.map(member => (
                    <div
                      key={member.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{member.fullName}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Class {member.classLevel}-{member.section} • Roll {member.rollNumber}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartCall('MEMBER_CALL', member.fullName, false)}
                          className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                          title="Audio Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartCall('MEMBER_CALL', member.fullName, true)}
                          className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                          title="Video Call"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Encrypted Peer Architecture • No External Keys Stored</span>
        </div>
      </div>
    </div>
  );
};
