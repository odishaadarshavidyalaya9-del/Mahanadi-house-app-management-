import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { MahanadiLogo } from '../MahanadiLogo';
import { Bell, Moon, Sun, ShieldCheck, GraduationCap, BookOpen, ChevronDown } from 'lucide-react';
import { UserRole } from '../../types/house';

interface TopHeaderProps {
  onOpenNotifications: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenNotifications }) => {
  const { currentUser, switchUser, users, darkMode, toggleDarkMode, unreadNotificationsCount } = useHouse();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'CAPTAIN':
        return {
          label: 'House Captain',
          bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5 mr-1" />,
        };
      case 'HOUSE_TEACHER':
        return {
          label: 'House Teacher',
          bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          icon: <BookOpen className="w-3.5 h-3.5 mr-1" />,
        };
      default:
        return {
          label: 'House Member',
          bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
          icon: <GraduationCap className="w-3.5 h-3.5 mr-1" />,
        };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  // Filter 3 primary demo accounts for quick testing
  const quickDemoAccounts = [
    users.find(u => u.role === 'CAPTAIN'),
    users.find(u => u.role === 'HOUSE_TEACHER'),
    users.find(u => u.role === 'MEMBER'),
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo & House Title */}
        <MahanadiLogo size="sm" showText={true} variant={darkMode ? 'dark' : 'light'} />

        {/* Right side controls: Role quick switcher, theme toggle, notifications */}
        <div className="flex items-center gap-1.5">
          {currentUser && (
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full border transition-all ${badge.bg}`}
                title="Switch active testing role"
              >
                {badge.icon}
                <span className="hidden xs:inline">{badge.label}</span>
                <span className="xs:hidden">{currentUser.role === 'CAPTAIN' ? 'Captain' : currentUser.role === 'HOUSE_TEACHER' ? 'Teacher' : 'Student'}</span>
                <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
              </button>

              {/* Quick Switch Dropdown */}
              {showRoleSwitcher && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowRoleSwitcher(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                      Switch Role View
                    </div>
                    {quickDemoAccounts.map(account => (
                      account && (
                        <button
                          key={account.id}
                          onClick={() => {
                            switchUser(account.id);
                            setShowRoleSwitcher(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors ${
                            currentUser?.id === account.id ? 'bg-blue-50 dark:bg-blue-900/30 font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{account.fullName}</p>
                            <p className="text-[10px] text-slate-500 capitalize">
                              {account.role.toLowerCase().replace('_', ' ')} • {account.classLevel}
                            </p>
                          </div>
                          {currentUser?.id === account.id && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </button>
                      )
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            id="btn-theme-toggle"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications bell */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="House Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
