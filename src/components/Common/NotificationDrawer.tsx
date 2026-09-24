import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { TabType } from '../Navigation/BottomNav';
import { 
  Bell, 
  X, 
  CheckCheck, 
  CalendarCheck, 
  Compass, 
  Megaphone, 
  ShieldAlert, 
  ChevronRight 
} from 'lucide-react';
import { NotificationType } from '../../types/house';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useHouse();

  if (!isOpen) return null;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'ATTENDANCE':
        return <CalendarCheck className="w-4 h-4 text-emerald-500" />;
      case 'ACTIVITY':
        return <Compass className="w-4 h-4 text-amber-500" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] mt-12">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              House Notifications
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark Read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="text-xs font-bold">No notifications right now.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.actionTab) {
                    onNavigateTab(notif.actionTab);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  !notif.isRead
                    ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-750 shadow-sm flex-shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
