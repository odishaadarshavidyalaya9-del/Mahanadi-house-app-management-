import React, { useState, useMemo } from 'react';
import { useHouse } from '../../context/HouseContext';
import { 
  CalendarCheck, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Search, 
  Filter, 
  Save, 
  ShieldAlert, 
  CheckCircle2, 
  History, 
  UserCheck, 
  UserX,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    attendanceMap, 
    saveAttendanceForDate,
    getUserAttendanceStats 
  } = useHouse();

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-21');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const canEditAttendance = currentUser?.role === 'CAPTAIN' || currentUser?.role === 'HOUSE_TEACHER';

  // Approved house members (students + captain)
  const houseMembers = useMemo(() => {
    return users.filter(u => u.role === 'MEMBER' || u.role === 'CAPTAIN');
  }, [users]);

  // Current records for selected date
  const dailyRecord = attendanceMap[selectedDate];

  // Local draft state for editing
  const [draftRecords, setDraftRecords] = useState<Record<string, { present: boolean; remarks?: string }>>({});

  // Synchronize draft when date or record changes
  React.useEffect(() => {
    const initialDraft: Record<string, { present: boolean; remarks?: string }> = {};
    houseMembers.forEach(member => {
      if (dailyRecord?.records && dailyRecord.records[member.id] !== undefined) {
        initialDraft[member.id] = {
          present: dailyRecord.records[member.id].present,
          remarks: dailyRecord.records[member.id].remarks || '',
        };
      } else {
        // Default to present if no record exists yet
        initialDraft[member.id] = { present: true, remarks: '' };
      }
    });
    setDraftRecords(initialDraft);
    setSaveSuccess(false);
    setSaveError(null);
  }, [selectedDate, dailyRecord, houseMembers]);

  // Toggle present/absent for a member
  const handleToggleStatus = (memberId: string) => {
    if (!canEditAttendance) return;
    setDraftRecords(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        present: !prev[memberId]?.present,
      },
    }));
    setSaveSuccess(false);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    if (!canEditAttendance) return;
    const updated: Record<string, { present: boolean; remarks?: string }> = {};
    houseMembers.forEach(m => {
      updated[m.id] = { present: true, remarks: draftRecords[m.id]?.remarks || '' };
    });
    setDraftRecords(updated);
    setSaveSuccess(false);
  };

  // Save attendance
  const handleSave = () => {
    if (!canEditAttendance) return;
    const res = saveAttendanceForDate(selectedDate, draftRecords);
    if (res.success) {
      setSaveSuccess(true);
      setSaveError(null);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setSaveError(res.error || 'Failed to save attendance.');
    }
  };

  // Quick date change
  const handleDateOffset = (offsetDays: number) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + offsetDays);
    const newDateStr = curr.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return houseMembers.filter(m => {
      const matchesSearch = 
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClassFilter === 'ALL' || m.classLevel === selectedClassFilter;
      return matchesSearch && matchesClass;
    });
  }, [houseMembers, searchQuery, selectedClassFilter]);

  // Statistics calculation for the current draft or day
  const totalCount = houseMembers.length;
  const presentCount = Object.values(draftRecords).filter(r => r.present).length;
  const absentCount = totalCount - presentCount;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Personal stats if user is a Member
  const myStats = currentUser ? getUserAttendanceStats(currentUser.id) : null;
  const isMyAttendancePresent = currentUser ? draftRecords[currentUser.id]?.present : true;

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                House Attendance
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {canEditAttendance ? 'Date-wise roll call & verification' : 'Personal attendance tracker'}
              </p>
            </div>
          </div>

          {/* Actions & Role badge */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              id="btn-attendance-history"
              onClick={() => setHistoryOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1 text-[11px] border border-blue-200 dark:border-blue-900 transition-colors"
            >
              <History className="w-3 h-3 text-blue-600" />
              <span>History</span>
            </button>

            {canEditAttendance ? (
              <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 text-[10px]">
                <UserCheck className="w-3 h-3" /> Roll Taker
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1 text-[10px]">
                <Lock className="w-3 h-3" /> View Only
              </span>
            )}
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-750/70 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
          <button
            onClick={() => handleDateOffset(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            />
            {selectedDate === '2026-09-21' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Today
              </span>
            )}
          </div>

          <button
            onClick={() => handleDateOffset(1)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Attendance Summary Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Present</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">{presentCount}</p>
          </div>
          <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
            <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">Absent</p>
            <p className="text-lg font-black text-rose-700 dark:text-rose-300">{absentCount}</p>
          </div>
          <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Rate</p>
            <p className="text-lg font-black text-blue-700 dark:text-blue-300">{percentage}%</p>
          </div>
        </div>

        {dailyRecord && (
          <div className="mt-2.5 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Last recorded by: <strong>{dailyRecord.lastUpdatedByName}</strong> ({dailyRecord.lastUpdatedRole})</span>
            <span>{dailyRecord.timestamp.split(' ')[1] || ''}</span>
          </div>
        )}
      </div>

      {/* If current user is a Member, show their own dedicated attendance card */}
      {!canEditAttendance && currentUser && (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-4 text-white shadow-md border border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                Your Attendance Status
              </span>
              <h3 className="text-base font-bold mt-0.5">{currentUser.fullName}</h3>
              <p className="text-xs text-sky-300">Roll No: {currentUser.rollNumber} • {currentUser.classLevel} {currentUser.section}</p>
            </div>
            
            <div className={`p-2.5 rounded-xl flex items-center gap-1.5 font-extrabold text-xs shadow-md ${
              isMyAttendancePresent ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {isMyAttendancePresent ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>PRESENT</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 stroke-[3]" />
                  <span>ABSENT</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-sky-200">Cumulative Term Attendance</p>
              <p className="text-base font-bold text-amber-300">{myStats?.percentage || 94}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-sky-200">Total Recorded Sessions</p>
              <p className="text-base font-bold text-white">{myStats?.totalDays || 22} Days</p>
            </div>
          </div>
        </div>
      )}

      {/* Member Warning / Info banner */}
      {!canEditAttendance && (
        <div className="p-3 bg-blue-50 dark:bg-slate-800/80 rounded-xl border border-blue-200 dark:border-slate-700 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            As a student member, you can review house member attendance in view-only mode. Only House Captain & House Teachers can save attendance.
          </span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search member or roll no..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
          />
        </div>

        <select
          value={selectedClassFilter}
          onChange={e => setSelectedClassFilter(e.target.value)}
          className="px-2.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
        >
          <option value="ALL">All Classes</option>
          <option value="9th">9th</option>
          <option value="10th">10th</option>
          <option value="11th">11th</option>
          <option value="12th">12th</option>
        </select>
      </div>

      {/* Captain / Teacher Action Bar */}
      {canEditAttendance && (
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Mark All Present
          </button>

          <button
            type="button"
            id="btn-save-attendance"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Attendance
          </button>
        </div>
      )}

      {/* Success notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Attendance for {selectedDate} has been saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Members Attendance List */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Approved Members ({filteredMembers.length})</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {filteredMembers.map((member, index) => {
            const isPresent = draftRecords[member.id]?.present ?? true;
            const remarks = draftRecords[member.id]?.remarks;

            return (
              <div 
                key={member.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-5">
                    {index + 1}
                  </span>

                  <img 
                    src={member.avatarUrl} 
                    alt={member.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {member.fullName}
                      </h4>
                      {member.role === 'CAPTAIN' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          Captain
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Roll No: <strong className="text-slate-700 dark:text-slate-300">{member.rollNumber}</strong> • Class {member.classLevel} {member.section}
                    </p>
                    {remarks && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">
                        Note: {remarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interactive Status Button */}
                <button
                  type="button"
                  id={`attendance-toggle-${member.id}`}
                  disabled={!canEditAttendance}
                  onClick={() => handleToggleStatus(member.id)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    isPresent
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-200'
                  } ${!canEditAttendance ? 'cursor-default opacity-90' : 'cursor-pointer active:scale-95'}`}
                >
                  {isPresent ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
                      <span>Present</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 stroke-[3] text-rose-600" />
                      <span>Absent</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance History Modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 px-4 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">Attendance History</h3>
                  <p className="text-[10px] text-sky-200">
                    {canEditAttendance ? 'Past Date Logs & Verification' : `Record for ${currentUser?.fullName}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* History List */}
            <div className="p-4 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              {Object.keys(attendanceMap).length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No previous attendance records found.
                </div>
              ) : (
                Object.values(attendanceMap)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(record => {
                    const totalMembers = Object.keys(record.records).length;
                    const presentNum = Object.values(record.records).filter(r => r.present).length;
                    const absentNum = totalMembers - presentNum;
                    const pct = totalMembers > 0 ? Math.round((presentNum / totalMembers) * 100) : 0;
                    const myRecord = currentUser ? record.records[currentUser.id] : null;

                    return (
                      <div key={record.id} className="pt-3 first:pt-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                              {record.date}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Verified by: {record.lastUpdatedByName} ({record.lastUpdatedRole})
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedDate(record.date);
                              setHistoryOpen(false);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-lg transition-colors"
                          >
                            View Day
                          </button>
                        </div>

                        {/* Stats or Personal status */}
                        <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 font-bold">Present: {presentNum}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-rose-600 font-bold">Absent: {absentNum}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-blue-600 font-bold">{pct}%</span>
                          </div>

                          {myRecord && (
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              myRecord.present 
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300' 
                                : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                            }`}>
                              You: {myRecord.present ? 'Present' : 'Absent'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-1.5 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
