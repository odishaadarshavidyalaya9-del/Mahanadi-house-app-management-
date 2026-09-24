/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HouseProvider, useHouse } from './context/HouseContext';
import { TopHeader } from './components/Navigation/TopHeader';
import { BottomNav, TabType } from './components/Navigation/BottomNav';
import { LoginScreen } from './components/Auth/LoginScreen';
import { HomeDashboard } from './components/Home/HomeDashboard';
import { AttendanceView } from './components/Attendance/AttendanceView';
import { ChatView } from './components/Chat/ChatView';
import { ActivitiesView } from './components/Activities/ActivitiesView';
import { ProfileView } from './components/Profile/ProfileView';
import { AnnouncementsModal } from './components/Announcements/AnnouncementsModal';
import { ActivitiesModal } from './components/Activities/ActivitiesModal';
import { MembersDirectoryModal } from './components/Members/MembersDirectoryModal';
import { CallsModal } from './components/Calls/CallsModal';
import { NotificationDrawer } from './components/Common/NotificationDrawer';
import { MahanadiLogo } from './components/MahanadiLogo';

const MainAppContent: React.FC = () => {
  const { currentUser, unreadNotificationsCount, chatMessages, activities } = useHouse();

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [announcementsOpen, setAnnouncementsOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [callsOpen, setCallsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);

  // Initial smooth splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (splashLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center text-white z-50 animate-in fade-in">
        <MahanadiLogo size="xl" showText={false} variant="dark" />
        <h1 
          className="text-2xl font-black tracking-widest text-amber-400 mt-4"
          style={{ fontFamily: 'var(--font-crest)' }}
        >
          MAHANADI
        </h1>
        <p className="text-xs text-white font-bold uppercase tracking-[0.25em] mt-1">
          PRIDE BY MY SIDE
        </p>
        <div className="mt-6 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]" />
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.3s]" />
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login/Registration Portal
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Count unread chat messages for student
  const unreadChatCount = chatMessages.length > 5 ? 2 : 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex justify-center selection:bg-blue-600 selection:text-white transition-colors">
      {/* Mobile-first framed container */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 border-x border-slate-200/80 dark:border-slate-800 relative shadow-2xl">
        
        {/* Fixed Top Header */}
        <TopHeader 
          onOpenNotifications={() => setNotificationsOpen(true)} 
        />

        {/* Dynamic Tab Content */}
        <main className="flex-1 px-4 pt-3 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeDashboard
              onNavigateTab={setActiveTab}
              onOpenActivities={() => setActiveTab('activities')}
              onOpenMembers={() => setMembersOpen(true)}
              onOpenAnnouncements={() => setAnnouncementsOpen(true)}
              onOpenCalls={() => setCallsOpen(true)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView />
          )}

          {activeTab === 'chat' && (
            <ChatView />
          )}

          {activeTab === 'activities' && (
            <ActivitiesView />
          )}

          {activeTab === 'calls' && (
            <HomeDashboard
              onNavigateTab={setActiveTab}
              onOpenActivities={() => setActiveTab('activities')}
              onOpenMembers={() => setMembersOpen(true)}
              onOpenAnnouncements={() => setAnnouncementsOpen(true)}
              onOpenCalls={() => setCallsOpen(true)}
            />
          )}

          {activeTab === 'me' && (
            <ProfileView />
          )}
        </main>

        {/* Fixed Bottom Navigation (Home | Attendance | Chat | Activities | Me) */}
        <BottomNav
          activeTab={activeTab === 'calls' ? 'home' : activeTab}
          onSelectTab={(tab) => {
            if (tab === 'calls') {
              setCallsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          unreadChatCount={unreadChatCount}
          upcomingActivitiesCount={activities.filter(a => a.status === 'UPCOMING' || a.status === 'IN_PROGRESS').length}
        />

        {/* Modals & Overlays */}
        <AnnouncementsModal
          isOpen={announcementsOpen}
          onClose={() => setAnnouncementsOpen(false)}
        />

        <ActivitiesModal
          isOpen={activitiesOpen}
          onClose={() => setActivitiesOpen(false)}
        />

        <MembersDirectoryModal
          isOpen={membersOpen}
          onClose={() => setMembersOpen(false)}
        />

        <CallsModal
          isOpen={callsOpen}
          onClose={() => setCallsOpen(false)}
        />

        <NotificationDrawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          onNavigateTab={(tab) => {
            if (tab === 'calls') {
              setCallsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HouseProvider>
      <MainAppContent />
    </HouseProvider>
  );
}
