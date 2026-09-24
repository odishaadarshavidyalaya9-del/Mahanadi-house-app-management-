import React, { useState, useRef, useEffect } from 'react';
import { useHouse } from '../../context/HouseContext';
import { ChatChannel, ChatMessage, UserRole } from '../../types/house';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap, 
  AlertTriangle, 
  Flag, 
  Lock, 
  CheckCheck,
  Megaphone,
  Users2,
  Smile,
  Info
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    chatMessages, 
    sendMessage, 
    flagMessage, 
    users 
  } = useHouse();

  const [activeChannel, setActiveChannel] = useState<ChatChannel>('HOUSE_CHAT');
  const [inputText, setInputText] = useState('');
  const [reportModalMessage, setReportModalMessage] = useState<ChatMessage | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCaptainOrTeacher = currentUser?.role === 'CAPTAIN' || currentUser?.role === 'HOUSE_TEACHER';

  // Filter messages for active channel
  const currentMessages = chatMessages.filter(msg => {
    if (activeChannel === 'HOUSE_CHAT') return msg.channel === 'HOUSE_CHAT';
    if (activeChannel === 'OFFICIAL_BROADCAST') return msg.channel === 'OFFICIAL_BROADCAST';
    return msg.channel === 'DIRECT';
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length, activeChannel]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    if (!inputText.trim()) return;

    if (activeChannel === 'OFFICIAL_BROADCAST' && !isCaptainOrTeacher) {
      setSendError('Only House Captain and House Teachers can post in the Official Broadcast channel.');
      return;
    }

    const res = sendMessage(activeChannel, inputText);
    if (res.success) {
      setInputText('');
    } else {
      setSendError(res.error || 'Failed to send message.');
    }
  };

  const handleReport = (msg: ChatMessage) => {
    setReportModalMessage(msg);
  };

  const confirmReport = () => {
    if (reportModalMessage) {
      flagMessage(reportModalMessage.id);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportModalMessage(null);
      }, 2000);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'CAPTAIN':
        return {
          label: 'Captain',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
          icon: <ShieldCheck className="w-2.5 h-2.5 inline mr-0.5" />
        };
      case 'HOUSE_TEACHER':
        return {
          label: 'Teacher',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
          icon: <BookOpen className="w-2.5 h-2.5 inline mr-0.5" />
        };
      default:
        return {
          label: 'Member',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
          icon: <GraduationCap className="w-2.5 h-2.5 inline mr-0.5" />
        };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] pb-16">
      
      {/* Channel Switcher Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm mb-3">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => { setActiveChannel('HOUSE_CHAT'); setSendError(null); }}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeChannel === 'HOUSE_CHAT'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>House Room</span>
          </button>

          <button
            onClick={() => { setActiveChannel('OFFICIAL_BROADCAST'); setSendError(null); }}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeChannel === 'OFFICIAL_BROADCAST'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>

          <button
            onClick={() => { setActiveChannel('DIRECT'); setSendError(null); }}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeChannel === 'DIRECT'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Safe Direct</span>
          </button>
        </div>

        {/* Channel info banner */}
        <div className="mt-2 px-2.5 py-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2">
          {activeChannel === 'HOUSE_CHAT' && (
            <span>🌊 Mahanadi Common Room • All verified house students & faculty</span>
          )}
          {activeChannel === 'OFFICIAL_BROADCAST' && (
            <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" /> Only Captains & House Teachers can broadcast
            </span>
          )}
          {activeChannel === 'DIRECT' && (
            <span>🛡️ Safe peer channel • Supervised school house chat</span>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-4 overflow-y-auto space-y-3">
        {currentMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto opacity-40 mb-2" />
            <p className="text-xs font-semibold">No messages yet in this channel.</p>
            <p className="text-[11px] mt-0.5">Start the conversation with your house mates!</p>
          </div>
        ) : (
          currentMessages.map(msg => {
            const isMe = msg.senderId === currentUser?.id;
            const roleInfo = getRoleBadge(msg.senderRole);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
              >
                {/* Sender line */}
                {!isMe && (
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {msg.senderName}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${roleInfo.badge}`}>
                      {roleInfo.icon}{roleInfo.label}
                    </span>
                    {msg.senderClass && (
                      <span className="text-[10px] text-slate-400">
                        ({msg.senderClass})
                      </span>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div className="relative max-w-[85%]">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : msg.senderRole === 'HOUSE_TEACHER'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-100 border border-emerald-200 dark:border-emerald-800 rounded-tl-none'
                        : msg.senderRole === 'CAPTAIN'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-slate-800 dark:text-slate-100 border border-amber-200 dark:border-amber-800 rounded-tl-none'
                        : 'bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.isFlagged && (
                      <span className="block text-[10px] text-rose-500 font-bold mb-1">
                        [Reported for Teacher Review]
                      </span>
                    )}
                    {msg.text}

                    {/* Timestamp & read receipts */}
                    <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      isMe ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>

                  {/* Quick Report Flag for students */}
                  {!isMe && (
                    <button
                      onClick={() => handleReport(msg)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-6 top-2 text-slate-400 hover:text-rose-500 p-1"
                      title="Report message for teacher moderation"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message Input Bar */}
      <div className="mt-2.5">
        {sendError && (
          <div className="mb-2 p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>{sendError}</span>
          </div>
        )}

        {/* Input box */}
        {activeChannel === 'OFFICIAL_BROADCAST' && !isCaptainOrTeacher ? (
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            <Lock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
            <span>Official announcements can only be posted by House Captain or House Teachers.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder={
                activeChannel === 'OFFICIAL_BROADCAST' 
                  ? 'Post official announcement to all Mahanadi members...' 
                  : 'Type a message to Mahanadi House...'
              }
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white shadow-sm"
            />
            <button
              type="submit"
              id="btn-send-chat"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Safety Report Modal */}
      {reportModalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Report Message</h3>
            </div>
            
            {reportSuccess ? (
              <p className="text-xs text-emerald-600 py-3 font-semibold">
                ✓ Report logged. House Master Mrs. Ananya Sharma has been alerted.
              </p>
            ) : (
              <>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Report this message from <strong>{reportModalMessage.senderName}</strong> for violation of school communication conduct?
                </p>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs italic text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
                  "{reportModalMessage.text}"
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReportModalMessage(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReport}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    Confirm Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
