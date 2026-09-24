import React from 'react';
import { Home, CalendarCheck, MessageSquare, Compass, User as UserIcon } from 'lucide-react';

export type TabType = 'home' | 'attendance' | 'chat' | 'activities' | 'calls' | 'me';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadChatCount?: number;
  upcomingActivitiesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadChatCount = 0,
  upcomingActivitiesCount = 0,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'attendance' as TabType, label: 'Attendance', icon: CalendarCheck },
    { id: 'chat' as TabType, label: 'Chat', icon: MessageSquare, badge: unreadChatCount },
    { id: 'activities' as TabType, label: 'Activities', icon: Compass, badge: upcomingActivitiesCount },
    { id: 'me' as TabType, label: 'Me', icon: UserIcon },
  ];

  return (
    <nav 
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 safe-bottom"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 py-1 transition-all duration-200 group ${
                isActive 
                  ? 'text-blue-700 dark:text-blue-400 font-bold scale-105' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-2'
                  }`} 
                />
                
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full leading-none shadow-sm animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[10px] xs:text-[11px] mt-1 tracking-tight transition-all ${
                isActive ? 'opacity-100 font-bold' : 'opacity-80 font-medium'
              }`}>
                {tab.label}
              </span>

              {/* Active pill dot indicator */}
              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
