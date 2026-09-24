import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { MahanadiLogo } from '../MahanadiLogo';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap, 
  Lock, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Edit3, 
  CheckCircle2, 
  RefreshCw, 
  Key, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    switchUser, 
    users, 
    getUserAttendanceStats, 
    resetToDefaults 
  } = useHouse();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notifSettingsOpen, setNotifSettingsOpen] = useState(false);
  const [privacySettingsOpen, setPrivacySettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Edit form state
  const [editedName, setEditedName] = useState(currentUser?.fullName || '');
  const [editedMotto, setEditedMotto] = useState(currentUser?.motto || '');
  const [saveToast, setSaveToast] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  // Notification toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [chatAlerts, setChatAlerts] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [activityAlerts, setActivityAlerts] = useState(true);

  if (!currentUser) return null;

  const attendanceStats = getUserAttendanceStats(currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      currentUser.fullName = editedName;
      currentUser.motto = editedMotto;
      setSaveToast(true);
      setTimeout(() => {
        setSaveToast(false);
        setEditProfileOpen(false);
      }, 1200);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setChangePasswordOpen(false);
      setCurrentPw('');
      setNewPw('');
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Profile Card Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-lg shadow">
                {currentUser.role === 'CAPTAIN' && <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
                {currentUser.role === 'HOUSE_TEACHER' && <BookOpen className="w-3.5 h-3.5 text-emerald-300" />}
                {currentUser.role === 'MEMBER' && <GraduationCap className="w-3.5 h-3.5 text-sky-300" />}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {currentUser.fullName}
                </h1>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.classLevel} {currentUser.section}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-1">
                Roll No: <strong className="text-slate-700 dark:text-slate-200">{currentUser.rollNumber}</strong>
              </p>
            </div>
          </div>

          <MahanadiLogo size="sm" showText={false} variant="dark" />
        </div>

        {/* Motto / Bio quote */}
        {currentUser.motto && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs italic text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
            "{currentUser.motto}"
          </div>
        )}

        {/* Credentials & Details Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{currentUser.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{currentUser.mobileNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>House: <strong>Mahanadi</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
            <span>DOB: <strong>{currentUser.dob}</strong></span>
          </div>
        </div>
      </div>

      {/* Attendance Stats Card */}
      <div className="bg-gradient-to-r from-blue-900 to-sky-900 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
            {currentUser.role === 'HOUSE_TEACHER' ? 'House Attendance Overview' : 'Personal Attendance Summary'}
          </p>
          <p className="text-xl font-extrabold mt-0.5">
            {attendanceStats.percentage}% <span className="text-xs font-normal text-sky-300">Present</span>
          </p>
          <p className="text-[11px] text-sky-200 mt-0.5">
            {currentUser.role === 'HOUSE_TEACHER' 
              ? 'Average roll-call compliance across all active house grades'
              : `Attended ${attendanceStats.presentDays} of ${attendanceStats.totalDays} recorded sessions`}
          </p>
        </div>

        <div className="p-3 bg-white/10 rounded-2xl text-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mt-1">
            {attendanceStats.percentage >= 75 ? 'Good Standing' : 'Needs Attention'}
          </span>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/70 overflow-hidden shadow-sm">
        <button
          onClick={() => {
            setEditedName(currentUser.fullName);
            setEditedMotto(currentUser.motto || '');
            setEditProfileOpen(true);
          }}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Edit Profile</p>
              <p className="text-[10px] text-slate-400">Update display name, motto and bio</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setChangePasswordOpen(true)}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Change Password</p>
              <p className="text-[10px] text-slate-400">Manage school account credentials</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setNotifSettingsOpen(true)}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Notification Settings</p>
              <p className="text-[10px] text-slate-400">Announcements, chat, and attendance alerts</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setPrivacySettingsOpen(true)}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Privacy & Security Settings</p>
              <p className="text-[10px] text-slate-400">Profile visibility & data protection</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setHelpOpen(true)}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">House Creed & Guidelines</p>
              <p className="text-[10px] text-slate-400">Code of conduct & house rules</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Switch Demo Account Quick Box */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick Demo Role Switcher
        </p>
        <div className="grid grid-cols-3 gap-2">
          {users.slice(0, 3).map(u => (
            <button
              key={u.id}
              onClick={() => switchUser(u.id)}
              className={`p-2 rounded-xl border text-left transition-all ${
                currentUser.id === u.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <p className="text-xs font-bold truncate">{u.fullName.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-400 capitalize">{u.role.toLowerCase().replace('_', ' ')}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reset & Logout actions */}
      <div className="space-y-2">
        <button
          onClick={logout}
          id="btn-logout"
          className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-2xl border border-rose-200 dark:border-rose-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Mahanadi House</span>
        </button>

        <button
          onClick={resetToDefaults}
          className="w-full py-2 text-slate-400 hover:text-slate-600 text-[11px] flex items-center justify-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Demo Data to Initial Defaults</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Edit House Profile
            </h3>

            {saveToast && (
              <div className="mb-3 p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Personal Motto / Bio
                </label>
                <textarea
                  rows={2}
                  value={editedMotto}
                  onChange={e => setEditedMotto(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Change Account Password
            </h3>

            {pwSuccess && (
              <div className="mb-3 p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Password changed securely!
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Settings Sheet */}
      {notifSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Notification Preferences
            </h3>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                  <p className="text-[10px] text-slate-400">Receive device alerts for urgent notices</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={e => setPushNotifs(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Official Announcements</p>
                  <p className="text-[10px] text-slate-400">Circulars from House Teachers & Captain</p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance Updates</p>
                  <p className="text-[10px] text-slate-400">Daily verification notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={attendanceAlerts}
                  onChange={e => setAttendanceAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">House Chat Pings</p>
                  <p className="text-[10px] text-slate-400">Mentions in Mahanadi Common Room</p>
                </div>
                <input
                  type="checkbox"
                  checked={chatAlerts}
                  onChange={e => setChatAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setNotifSettingsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Sheet */}
      {privacySettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Privacy & Safeguards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Mahanadi House follows strict school data privacy protocols.
            </p>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="font-bold block text-slate-800 dark:text-slate-200">Phone Number Masking</span>
                <span className="text-[11px] text-slate-400">Your phone number is visible only to verified House Faculty & Captain.</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="font-bold block text-slate-800 dark:text-slate-200">Moderated Chat Oversight</span>
                <span className="text-[11px] text-slate-400">All channels are reviewed by Faculty House Masters for a respectful environment.</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setPrivacySettingsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* House Creed & Help */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-3">
              <MahanadiLogo size="sm" showText={false} variant="dark" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                The Mahanadi House Creed
              </h3>
              <p className="text-[11px] text-amber-500 font-extrabold uppercase tracking-wider">
                "PRIDE BY MY SIDE"
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <p>1. Every member represents Mahanadi House with honor, integrity, and discipline.</p>
              <p>2. Attendance at zero-period house roll call is mandatory for all students.</p>
              <p>3. Compete fiercely on the field and in academics, maintaining high sportsmanship.</p>
              <p>4. Respect house peers, prefects, Captain, and faculty House Masters.</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setHelpOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
