export type UserRole = 
  | 'HOUSE_CAPTAIN'
  | 'VICE_CAPTAIN'
  | 'HOUSE_TEACHER'
  | 'ATTENDANCE_COORDINATOR'
  | 'SPORTS_COORDINATOR'
  | 'CULTURAL_COORDINATOR'
  | 'DISCIPLINE_COORDINATOR'
  | 'EVENT_COORDINATOR'
  | 'COMMUNICATION_COORDINATOR'
  | 'HOUSE_MEMBER'
  // Backward compatibility alias:
  | 'CAPTAIN'
  | 'MEMBER';

export interface RolePermission {
  canTakeAttendance: boolean;
  canPostAnnouncements: boolean;
  canManageActivities: boolean;
  canBroadcastChat: boolean;
  canModerateDiscipline: boolean;
  label: string;
  badgeColor: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  HOUSE_CAPTAIN: {
    canTakeAttendance: true,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: true,
    canModerateDiscipline: true,
    label: 'House Captain',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300',
  },
  CAPTAIN: {
    canTakeAttendance: true,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: true,
    canModerateDiscipline: true,
    label: 'House Captain',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300',
  },
  VICE_CAPTAIN: {
    canTakeAttendance: true,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: true,
    canModerateDiscipline: true,
    label: 'Vice Captain',
    badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300',
  },
  HOUSE_TEACHER: {
    canTakeAttendance: true,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: true,
    canModerateDiscipline: true,
    label: 'House Teacher',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300',
  },
  ATTENDANCE_COORDINATOR: {
    canTakeAttendance: true,
    canPostAnnouncements: false,
    canManageActivities: false,
    canBroadcastChat: false,
    canModerateDiscipline: false,
    label: 'Attendance Coordinator',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 border-teal-300',
  },
  SPORTS_COORDINATOR: {
    canTakeAttendance: false,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: false,
    canModerateDiscipline: false,
    label: 'Sports Coordinator',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-300',
  },
  CULTURAL_COORDINATOR: {
    canTakeAttendance: false,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: false,
    canModerateDiscipline: false,
    label: 'Cultural Coordinator',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-300',
  },
  DISCIPLINE_COORDINATOR: {
    canTakeAttendance: true,
    canPostAnnouncements: false,
    canManageActivities: false,
    canBroadcastChat: false,
    canModerateDiscipline: true,
    label: 'Discipline Coordinator',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-300',
  },
  EVENT_COORDINATOR: {
    canTakeAttendance: false,
    canPostAnnouncements: true,
    canManageActivities: true,
    canBroadcastChat: false,
    canModerateDiscipline: false,
    label: 'Event Coordinator',
    badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300 border-pink-300',
  },
  COMMUNICATION_COORDINATOR: {
    canTakeAttendance: false,
    canPostAnnouncements: true,
    canManageActivities: false,
    canBroadcastChat: true,
    canModerateDiscipline: false,
    label: 'Communication Coordinator',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 border-sky-300',
  },
  HOUSE_MEMBER: {
    canTakeAttendance: false,
    canPostAnnouncements: false,
    canManageActivities: false,
    canBroadcastChat: false,
    canModerateDiscipline: false,
    label: 'House Member',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200',
  },
  MEMBER: {
    canTakeAttendance: false,
    canPostAnnouncements: false,
    canManageActivities: false,
    canBroadcastChat: false,
    canModerateDiscipline: false,
    label: 'House Member',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200',
  },
};

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string; // e.g. +91 9876543210
  password?: string;
  role: UserRole;
  classLevel: string; // e.g. "10th", "11th", "12th", "9th", or "Faculty"
  section: string; // "A", "B", "C", "D"
  rollNumber: string;
  dob: string; // YYYY-MM-DD
  house: string; // Always "Mahanadi House"
  avatarUrl?: string;
  joinedDate: string;
  bloodGroup?: string;
  isVerified: boolean;
  motto?: string;
}

export interface AttendanceStatus {
  present: boolean;
  markedBy: string;
  markedByName: string;
  timestamp: string;
  remarks?: string;
}

export interface DailyAttendance {
  id: string; // e.g. "attendance-2026-09-21"
  date: string; // YYYY-MM-DD
  records: Record<string, AttendanceStatus>; // memberId -> AttendanceStatus
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedRole: UserRole;
  timestamp: string;
}

export type AnnouncementCategory = 
  | 'NOTICE' 
  | 'ACTIVITY' 
  | 'COMPETITION' 
  | 'MEETING' 
  | 'PRACTICE' 
  | 'EVENT';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  category: AnnouncementCategory;
  isPinned?: boolean;
  imageUrl?: string;
  attachmentName?: string;
  attachmentSize?: string;
  likesCount?: number;
}

export type ActivityStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ActivityCategory = 
  | 'COMPETITION' 
  | 'SPORTS' 
  | 'CULTURAL' 
  | 'MEETING' 
  | 'EVENT' 
  | 'ACADEMIC' 
  | 'COMMUNITY';

export interface HouseActivity {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "03:30 PM"
  location: string;
  category: ActivityCategory;
  status: ActivityStatus;
  participants: string[]; // memberIds
  maxParticipants?: number;
  pointsAwarded: number;
  createdBy: string;
  createdByName: string;
  createdByRole: UserRole;
}

export type ChatChannel = 'HOUSE_CHAT' | 'OFFICIAL_BROADCAST' | 'DIRECT';

export interface ChatMessage {
  id: string;
  channel: ChatChannel;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderClass?: string;
  senderAvatar?: string;
  recipientId?: string; // only for DIRECT channel
  text: string;
  timestamp: string;
  isRead?: boolean;
  isFlagged?: boolean;
}

export type NotificationType = 'ANNOUNCEMENT' | 'ACTIVITY' | 'ATTENDANCE' | 'CHAT' | 'CALL' | 'SYSTEM';

export interface HouseNotification {
  id: string;
  userId: string; // "ALL" or specific userId
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  actionTab?: 'home' | 'attendance' | 'chat' | 'activities' | 'calls' | 'me';
}

export interface HouseStatistics {
  houseName: string;
  motto: string;
  colorHex: string;
  secondaryColorHex: string;
  totalMembers: number;
  housePoints: number;
  schoolRank: number;
  totalActivitiesCount: number;
  wonTrophiesCount: number;
}

// Calls Architecture
export type CallType = 'JOIN_CALL' | 'MEMBER_CALL' | 'TEACHER_CAPTAIN_CALL';
export type CallStatus = 'IDLE' | 'CALLING' | 'CONNECTED' | 'ENDED';

export interface CallSession {
  id: string;
  type: CallType;
  title: string;
  callerId: string;
  callerName: string;
  callerRole: UserRole;
  targetId?: string;
  targetName?: string;
  roomCode: string;
  status: CallStatus;
  startedAt: string;
  isVideo: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
}
