import React from 'react';
import { useHouse } from '../../context/HouseContext';
import { TabType } from '../Navigation/BottomNav';
import { MahanadiLogo } from '../MahanadiLogo';
import { 
  Users, 
  CalendarCheck, 
  MessageSquare, 
  Bell, 
  Trophy, 
  Flame, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Pin,
  Video
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenActivities: () => void;
  onOpenMembers: () => void;
  onOpenAnnouncements: () => void;
  onOpenCalls?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onOpenActivities,
  onOpenMembers,
  onOpenAnnouncements,
  onOpenCalls,
}) => {
  const { 
    currentUser, 
    stats, 
    announcements, 
    activities, 
    users, 
    attendanceMap 
  } = useHouse();

  const todayStr = '2026-09-21';
  const todayAttendance = attendanceMap[todayStr];
  
  // Calculate today's attendance stats
  const totalApprovedMembers = users.filter(u => u.role === 'MEMBER' || u.role === 'CAPTAIN').length;
  let presentTodayCount = 0;
  if (todayAttendance?.records) {
    Object.values(todayAttendance.records).forEach(r => {
      if (r.present) presentTodayCount++;
    });
  } else {
    presentTodayCount = Math.round(totalApprovedMembers * 0.92);
  }
  const attendanceRate = totalApprovedMembers > 0 
    ? Math.round((presentTodayCount / totalApprovedMembers) * 100) 
    : 100;

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const recentAnnouncements = announcements.slice(0, 3);
  const upcomingActivities = activities.filter(a => a.status === 'UPCOMING').slice(0, 2);

  // Quick action buttons
  const quickActions = [
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: CalendarCheck, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: () => onNavigateTab('attendance'),
      subtext: 'Date records'
    },
    { 
      id: 'chat', 
      label: 'House Chat', 
      icon: MessageSquare, 
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      action: () => onNavigateTab('chat'),
      subtext: '3 active channels'
    },
    { 
      id: 'calls', 
      label: 'House Calls', 
      icon: Video, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: () => (onOpenCalls ? onOpenCalls() : onNavigateTab('calls')),
      subtext: 'Audio & HD Video'
    },
    { 
      id: 'activities', 
      label: 'Activities', 
      icon: Compass, 
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      action: onOpenActivities,
      subtext: `${activities.filter(a => a.status === 'UPCOMING').length} upcoming`
    },
    { 
      id: 'members', 
      label: 'Members', 
      icon: Users, 
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      action: onOpenMembers,
      subtext: `${users.length} enrolled`
    },
    { 
      id: 'announcements', 
      label: 'Notices', 
      icon: Bell, 
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      action: onOpenAnnouncements,
      subtext: 'Official feed'
    },
    { 
      id: 'profile', 
      label: 'My Profile', 
      icon: GraduationCap, 
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      action: () => onNavigateTab('me'),
      subtext: currentUser?.rollNumber ? `Roll ${currentUser.rollNumber}` : 'House ID'
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-sky-900 to-slate-900 text-white p-5 shadow-lg border border-sky-800/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-sky-200 border border-white/10 mb-2">
              {currentUser?.role === 'CAPTAIN' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              {currentUser?.role === 'HOUSE_TEACHER' && <BookOpen className="w-3.5 h-3.5 text-emerald-400" />}
              {currentUser?.role === 'MEMBER' && <GraduationCap className="w-3.5 h-3.5 text-sky-400" />}
              <span>{currentUser?.role.replace('_', ' ')}</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Namaste, {currentUser?.fullName.split(' ')[0]}!
            </h1>
            <p className="text-xs text-sky-200/90 mt-0.5">
              Welcome to your Mahanadi House portal.
            </p>
          </div>

          <MahanadiLogo size="md" showText={false} variant="dark" />
        </div>

        {/* House Championship Score Pill */}
        <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-sky-200 font-medium uppercase tracking-wider">Inter-House Championship</p>
              <p className="font-bold text-white flex items-center gap-1.5">
                <span>{stats.housePoints} Points</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Rank #{stats.schoolRank}
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              "PRIDE BY MY SIDE"
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row: Total Members, Present Today & Upcoming Activities */}
      <div className="grid grid-cols-3 gap-2">
        {/* Total Members */}
        <div 
          onClick={onOpenMembers}
          className="cursor-pointer bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
            {users.length}
          </p>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
            Total Members
          </p>
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 truncate">
            All active
          </p>
        </div>

        {/* Present Today */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="cursor-pointer bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              {attendanceRate}%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
            {presentTodayCount}
          </p>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
            Present Today
          </p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            of {totalApprovedMembers} students
          </p>
        </div>

        {/* Upcoming Activities */}
        <div 
          onClick={onOpenActivities}
          className="cursor-pointer bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
            {activities.filter(a => a.status === 'UPCOMING' || a.status === 'IN_PROGRESS').length}
          </p>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
            Upcoming Events
          </p>
          <p className="text-[9px] text-amber-600 dark:text-amber-400 font-medium mt-0.5 truncate">
            Sports & Drills
          </p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          House Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                id={`quick-action-${action.id}`}
                onClick={action.action}
                className="flex flex-col items-center text-center p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all group active:scale-95"
              >
                <div className={`p-2.5 rounded-xl ${action.color} mb-1.5 transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {action.label}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-full">
                  {action.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Announcements Section */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Announcements
            </h2>
          </div>
          <button
            onClick={onOpenAnnouncements}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center hover:underline"
          >
            <span>View All ({announcements.length})</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentAnnouncements.map(item => (
            <div
              key={item.id}
              onClick={onOpenAnnouncements}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-100 dark:border-slate-700 hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    item.category === 'COMPETITION' 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' 
                      : item.category === 'PRACTICE'
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  }`}>
                    {item.category}
                  </span>
                  {item.isPinned && (
                    <span className="flex items-center text-[10px] text-amber-600 dark:text-amber-400 font-semibold gap-0.5">
                      <Pin className="w-2.5 h-2.5 fill-amber-500" /> Pinned
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">
                  {item.date.split(' ')[0]}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1.5 leading-snug line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>By: <strong>{item.authorName}</strong> ({item.authorRole})</span>
                {item.attachmentName && (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">📎 Attachment</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Activities Section */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming House Activities
            </h2>
          </div>
          <button
            onClick={onOpenActivities}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center hover:underline"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {upcomingActivities.map(activity => (
            <div
              key={activity.id}
              onClick={onOpenActivities}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-100 dark:border-slate-700 hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide bg-blue-100/80 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                  {activity.category}
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  +{activity.pointsAwarded} House Pts
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1.5 leading-snug">
                {activity.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {activity.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {activity.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {activity.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* House Master & Captain Corner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border border-amber-200/70 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span className="font-bold text-amber-900 dark:text-amber-300">House Captain's Dispatch</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
          "Remember to keep our house banner high. Wear your badges with dignity and prepare for the athletics qualifiers tomorrow. Flow strong like Mahanadi!"
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1.5 text-right">
          — Rohan Verma, House Captain
        </p>
      </div>
    </div>
  );
};
