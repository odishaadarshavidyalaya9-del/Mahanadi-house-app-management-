import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  DailyAttendance, 
  Announcement, 
  HouseActivity, 
  ChatMessage, 
  HouseNotification, 
  HouseStatistics,
  ChatChannel,
  AnnouncementCategory,
  ActivityCategory
} from '../types/house';
import { 
  SEED_USERS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ACTIVITIES, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_ATTENDANCE_MAP, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_HOUSE_STATS 
} from '../data/mockSeedData';

interface HouseContextType {
  currentUser: User | null;
  users: User[];
  stats: HouseStatistics;
  attendanceMap: Record<string, DailyAttendance>;
  announcements: Announcement[];
  activities: HouseActivity[];
  chatMessages: ChatMessage[];
  notifications: HouseNotification[];
  darkMode: boolean;
  
  // Auth & Roles
  loginWithEmail: (email: string) => boolean;
  loginWithMobileOtp: (mobile: string, otp: string) => boolean;
  loginWithGoogle: () => boolean;
  registerUser: (userData: Omit<User, 'id' | 'isVerified' | 'joinedDate'>) => { success: boolean; error?: string };
  switchUser: (userId: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  
  // Attendance
  getAttendanceForDate: (date: string) => DailyAttendance | null;
  saveAttendanceForDate: (date: string, records: Record<string, { present: boolean; remarks?: string }>) => { success: boolean; error?: string };
  getUserAttendanceStats: (userId: string) => { totalDays: number; presentDays: number; percentage: number };
  
  // Announcements
  addAnnouncement: (data: {
    title: string;
    description: string;
    category: AnnouncementCategory;
    isPinned?: boolean;
    attachmentName?: string;
  }) => { success: boolean; error?: string };
  toggleLikeAnnouncement: (id: string) => void;
  
  // Activities
  addActivity: (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: ActivityCategory;
    pointsAwarded: number;
    maxParticipants?: number;
  }) => { success: boolean; error?: string };
  updateActivity: (activityId: string, data: Partial<HouseActivity>) => { success: boolean; error?: string };
  deleteActivity: (activityId: string) => { success: boolean; error?: string };
  joinActivity: (activityId: string) => { success: boolean; error?: string };
  leaveActivity: (activityId: string) => void;
  
  // Chat
  sendMessage: (channel: ChatChannel, text: string, recipientId?: string) => { success: boolean; error?: string };
  flagMessage: (messageId: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Reset demo
  resetToDefaults: () => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'mahanadi_current_user',
  USERS: 'mahanadi_users',
  ATTENDANCE: 'mahanadi_attendance',
  ANNOUNCEMENTS: 'mahanadi_announcements',
  ACTIVITIES: 'mahanadi_activities',
  MESSAGES: 'mahanadi_messages',
  NOTIFICATIONS: 'mahanadi_notifications',
  STATS: 'mahanadi_stats',
  DARK_MODE: 'mahanadi_dark_mode',
};

export const HouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or seed
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      // Default to House Captain for rich initial review
      return SEED_USERS[0];
    } catch {
      return SEED_USERS[0];
    }
  });

  const [attendanceMap, setAttendanceMap] = useState<Record<string, DailyAttendance>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_MAP;
    } catch {
      return INITIAL_ATTENDANCE_MAP;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [activities, setActivities] = useState<HouseActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  const [notifications, setNotifications] = useState<HouseNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [stats] = useState<HouseStatistics>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, motto: INITIAL_HOUSE_STATS.motto };
      }
      return INITIAL_HOUSE_STATS;
    } catch {
      return INITIAL_HOUSE_STATS;
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    } catch {
      return false;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceMap));
  }, [attendanceMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Authentication methods
  const loginWithEmail = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      addNotification({
        title: 'Logged In',
        message: `Welcome back, ${found.fullName}!`,
        type: 'SYSTEM',
        actionTab: 'home',
      });
      return true;
    }
    return false;
  };

  const loginWithMobileOtp = (mobile: string, otp: string): boolean => {
    // Basic verification: OTP must be 6 digits (e.g. 123456)
    if (otp !== '123456' && otp.length !== 6) {
      return false;
    }
    const cleanMobile = mobile.replace(/\s+/g, '');
    const found = users.find(u => u.mobileNumber.replace(/\s+/g, '') === cleanMobile);
    if (found) {
      setCurrentUser(found);
      addNotification({
        title: 'OTP Verified',
        message: `Welcome to Mahanadi House, ${found.fullName}!`,
        type: 'SYSTEM',
        actionTab: 'home',
      });
      return true;
    }
    return false;
  };

  const loginWithGoogle = (): boolean => {
    // Default to Captain or first user for demo Google login
    const target = users[0];
    setCurrentUser(target);
    addNotification({
      title: 'Google Sign-In Successful',
      message: `Signed in as ${target.fullName} (${target.email})`,
      type: 'SYSTEM',
      actionTab: 'home',
    });
    return true;
  };

  const registerUser = (userData: Omit<User, 'id' | 'isVerified' | 'joinedDate'>) => {
    // Clean inputs
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanMobile = userData.mobileNumber.trim().replace(/\s+/g, '');

    // Duplicate checks
    const emailExists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'An account with this email address already exists in Mahanadi House.' };
    }

    const mobileExists = users.some(u => u.mobileNumber.replace(/\s+/g, '') === cleanMobile);
    if (mobileExists) {
      return { success: false, error: 'An account with this mobile number already exists in Mahanadi House.' };
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      house: 'Mahanadi House', // strictly forced
      isVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.fullName)}`,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    addNotification({
      title: 'Registration Complete',
      message: `Welcome to Mahanadi House, ${newUser.fullName}! Your roll no is ${newUser.rollNumber}.`,
      type: 'SYSTEM',
      actionTab: 'home',
    });

    return { success: true };
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      addNotification({
        title: 'Profile Switched',
        message: `Viewing app as ${found.fullName} (${found.role})`,
        type: 'SYSTEM',
        actionTab: 'home',
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Notification helper
  const addNotification = (notif: Omit<HouseNotification, 'id' | 'timestamp' | 'isRead' | 'userId'>) => {
    const newNotif: HouseNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: 'ALL',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Attendance
  const getAttendanceForDate = (date: string): DailyAttendance | null => {
    return attendanceMap[date] || null;
  };

  const saveAttendanceForDate = (
    date: string, 
    records: Record<string, { present: boolean; remarks?: string }>
  ) => {
    if (!currentUser) {
      return { success: false, error: 'You must be logged in.' };
    }
    // Only Captain and House Teacher can save attendance
    if (currentUser.role === 'MEMBER') {
      return { success: false, error: 'Unauthorized: Only House Captain and House Teachers can mark attendance.' };
    }

    const formattedRecords: Record<string, { present: boolean; markedBy: string; markedByName: string; timestamp: string; remarks?: string }> = {};
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    Object.entries(records).forEach(([memberId, data]) => {
      formattedRecords[memberId] = {
        present: data.present,
        markedBy: currentUser.id,
        markedByName: currentUser.fullName,
        timestamp: nowTime,
        remarks: data.remarks,
      };
    });

    const dailyRecord: DailyAttendance = {
      id: `attendance-${date}`,
      date,
      records: formattedRecords,
      lastUpdatedBy: currentUser.id,
      lastUpdatedByName: currentUser.fullName,
      lastUpdatedRole: currentUser.role,
      timestamp: `${date} ${nowTime}`,
    };

    setAttendanceMap(prev => ({
      ...prev,
      [date]: dailyRecord,
    }));

    addNotification({
      title: 'Attendance Recorded',
      message: `Attendance for ${date} has been saved by ${currentUser.fullName} (${currentUser.role}).`,
      type: 'ATTENDANCE',
      actionTab: 'attendance',
    });

    return { success: true };
  };

  const getUserAttendanceStats = (userId: string) => {
    const dates = Object.values(attendanceMap);
    let totalDays = 0;
    let presentDays = 0;

    dates.forEach(day => {
      if (day.records && day.records[userId] !== undefined) {
        totalDays++;
        if (day.records[userId].present) {
          presentDays++;
        }
      }
    });

    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
    return { totalDays, presentDays, percentage };
  };

  // Announcements
  const addAnnouncement = (data: {
    title: string;
    description: string;
    category: AnnouncementCategory;
    isPinned?: boolean;
    attachmentName?: string;
  }) => {
    if (!currentUser) return { success: false, error: 'Must be logged in.' };
    if (currentUser.role === 'MEMBER') {
      return { success: false, error: 'Only House Teachers and Captains can publish official announcements.' };
    }

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: dateStr,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      category: data.category,
      isPinned: data.isPinned || false,
      attachmentName: data.attachmentName,
      attachmentSize: data.attachmentName ? '512 KB' : undefined,
      likesCount: 1,
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);

    addNotification({
      title: `Notice: ${data.title}`,
      message: `Posted by ${currentUser.fullName} (${currentUser.role}).`,
      type: 'ANNOUNCEMENT',
      actionTab: 'home',
    });

    return { success: true };
  };

  const toggleLikeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === id) {
        return { ...ann, likesCount: (ann.likesCount || 0) + 1 };
      }
      return ann;
    }));
  };

  // Activities
  const addActivity = (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: ActivityCategory;
    pointsAwarded: number;
    maxParticipants?: number;
  }) => {
    if (!currentUser) return { success: false, error: 'Must be logged in.' };
    if (currentUser.role === 'MEMBER') {
      return { success: false, error: 'Only House Teachers and Captains can create house activities.' };
    }

    const newAct: HouseActivity = {
      id: `act-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      category: data.category,
      status: 'UPCOMING',
      participants: [currentUser.id],
      maxParticipants: data.maxParticipants || 20,
      pointsAwarded: data.pointsAwarded || 50,
      createdBy: currentUser.id,
      createdByName: currentUser.fullName,
      createdByRole: currentUser.role,
    };

    setActivities(prev => [newAct, ...prev]);

    addNotification({
      title: `New House Activity: ${data.title}`,
      message: `Scheduled on ${data.date} at ${data.location}. RSVP now!`,
      type: 'ACTIVITY',
      actionTab: 'home',
    });

    return { success: true };
  };

  const updateActivity = (activityId: string, data: Partial<HouseActivity>) => {
    if (!currentUser) return { success: false, error: 'Must be logged in' };
    if (currentUser.role === 'MEMBER') {
      return { success: false, error: 'Only House Teachers and Captains can modify activities.' };
    }
    setActivities(prev => prev.map(act => act.id === activityId ? { ...act, ...data } : act));
    return { success: true };
  };

  const deleteActivity = (activityId: string) => {
    if (!currentUser) return { success: false, error: 'Must be logged in' };
    if (currentUser.role === 'MEMBER') {
      return { success: false, error: 'Only House Teachers and Captains can delete activities.' };
    }
    setActivities(prev => prev.filter(act => act.id !== activityId));
    return { success: true };
  };

  const joinActivity = (activityId: string) => {
    if (!currentUser) return { success: false, error: 'Must be logged in' };
    
    let joined = false;
    setActivities(prev => prev.map(act => {
      if (act.id === activityId) {
        if (act.participants.includes(currentUser.id)) {
          return act;
        }
        if (act.maxParticipants && act.participants.length >= act.maxParticipants) {
          return act;
        }
        joined = true;
        return {
          ...act,
          participants: [...act.participants, currentUser.id]
        };
      }
      return act;
    }));

    if (joined) {
      addNotification({
        title: 'RSVP Confirmed',
        message: `You registered for the activity. See you there!`,
        type: 'ACTIVITY',
        actionTab: 'home',
      });
      return { success: true };
    }
    return { success: false, error: 'Activity is full or already joined.' };
  };

  const leaveActivity = (activityId: string) => {
    if (!currentUser) return;
    setActivities(prev => prev.map(act => {
      if (act.id === activityId) {
        return {
          ...act,
          participants: act.participants.filter(id => id !== currentUser.id)
        };
      }
      return act;
    }));
  };

  // Chat
  const sendMessage = (channel: ChatChannel, text: string, recipientId?: string) => {
    if (!currentUser) return { success: false, error: 'Must be logged in' };
    if (!text.trim()) return { success: false, error: 'Message cannot be empty' };

    // Broadcast channel constraint: Only Captain & Teacher can post
    if (channel === 'OFFICIAL_BROADCAST' && currentUser.role === 'MEMBER') {
      return { 
        success: false, 
        error: 'Only House Captain and House Teachers can post in the Official Announcements channel.' 
      };
    }

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      channel,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      senderClass: currentUser.classLevel === 'Faculty' ? 'Faculty' : `${currentUser.classLevel} ${currentUser.section}`,
      senderAvatar: currentUser.avatarUrl,
      recipientId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newMsg]);
    return { success: true };
  };

  const flagMessage = (messageId: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isFlagged: true };
      }
      return msg;
    }));
    addNotification({
      title: 'Message Reported',
      message: 'Thank you. The reported message has been forwarded to the House Teacher for review.',
      type: 'SYSTEM',
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(SEED_USERS);
    setCurrentUser(SEED_USERS[0]);
    setAttendanceMap(INITIAL_ATTENDANCE_MAP);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDarkMode(false);
  };

  return (
    <HouseContext.Provider
      value={{
        currentUser,
        users,
        stats,
        attendanceMap,
        announcements,
        activities,
        chatMessages,
        notifications,
        darkMode,
        loginWithEmail,
        loginWithMobileOtp,
        loginWithGoogle,
        registerUser,
        switchUser,
        logout,
        toggleDarkMode,
        getAttendanceForDate,
        saveAttendanceForDate,
        getUserAttendanceStats,
        addAnnouncement,
        toggleLikeAnnouncement,
        addActivity,
        updateActivity,
        deleteActivity,
        joinActivity,
        leaveActivity,
        sendMessage,
        flagMessage,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        resetToDefaults,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export const useHouse = () => {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
};
