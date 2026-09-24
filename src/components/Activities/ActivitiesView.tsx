import React, { useState, useMemo } from 'react';
import { useHouse } from '../../context/HouseContext';
import { ActivityCategory, HouseActivity, ActivityStatus } from '../../types/house';
import { 
  Compass, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  School, 
  Flame, 
  X,
  UserPlus,
  UserMinus
} from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const { 
    activities, 
    addActivity, 
    updateActivity, 
    deleteActivity, 
    joinActivity, 
    leaveActivity, 
    currentUser, 
    users 
  } = useHouse();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('UPCOMING');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<HouseActivity | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('2026-09-25');
  const [formTime, setFormTime] = useState('04:00 PM');
  const [formLocation, setFormLocation] = useState('School Main Ground');
  const [formCategory, setFormCategory] = useState<ActivityCategory>('SPORTS');
  const [formPoints, setFormPoints] = useState(50);
  const [formMaxParticipants, setFormMaxParticipants] = useState(25);
  const [formError, setFormError] = useState<string | null>(null);

  const canManage = currentUser?.role === 'CAPTAIN' || currentUser?.role === 'HOUSE_TEACHER';

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = 
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        activeCategoryFilter === 'ALL' || act.category === activeCategoryFilter;

      const matchesStatus = 
        activeStatusFilter === 'ALL' 
          ? true 
          : activeStatusFilter === 'UPCOMING'
            ? act.status === 'UPCOMING' || act.status === 'IN_PROGRESS'
            : act.status === 'COMPLETED' || act.status === 'CANCELLED';

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [activities, searchQuery, activeCategoryFilter, activeStatusFilter]);

  const openCreateModal = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDate('2026-09-28');
    setFormTime('03:30 PM');
    setFormLocation('School Auditorium / Ground');
    setFormCategory('COMPETITION');
    setFormPoints(50);
    setFormMaxParticipants(30);
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (activity: HouseActivity) => {
    setEditingActivity(activity);
    setFormTitle(activity.title);
    setFormDescription(activity.description);
    setFormDate(activity.date);
    setFormTime(activity.time);
    setFormLocation(activity.location);
    setFormCategory(activity.category);
    setFormPoints(activity.pointsAwarded || 50);
    setFormMaxParticipants(activity.maxParticipants || 20);
    setFormError(null);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim() || !formDescription.trim() || !formLocation.trim()) {
      setFormError('Please fill in all required activity details.');
      return;
    }

    if (editingActivity) {
      const res = updateActivity(editingActivity.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        date: formDate,
        time: formTime,
        location: formLocation.trim(),
        category: formCategory,
        pointsAwarded: Number(formPoints),
        maxParticipants: Number(formMaxParticipants),
      });

      if (res.success) {
        setEditingActivity(null);
      } else {
        setFormError(res.error || 'Failed to update activity.');
      }
    } else {
      const res = addActivity({
        title: formTitle.trim(),
        description: formDescription.trim(),
        date: formDate,
        time: formTime,
        location: formLocation.trim(),
        category: formCategory,
        pointsAwarded: Number(formPoints),
        maxParticipants: Number(formMaxParticipants),
      });

      if (res.success) {
        setIsCreateModalOpen(false);
      } else {
        setFormError(res.error || 'Failed to create activity.');
      }
    }
  };

  const confirmDeleteActivity = () => {
    if (deletingActivityId) {
      deleteActivity(deletingActivityId);
      setDeletingActivityId(null);
    }
  };

  const getCategoryBadge = (cat: ActivityCategory) => {
    switch (cat) {
      case 'COMPETITION':
        return { label: 'Competition', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300' };
      case 'SPORTS':
        return { label: 'Sports Activity', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300' };
      case 'CULTURAL':
        return { label: 'Cultural Program', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300' };
      case 'MEETING':
        return { label: 'House Meeting', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300' };
      case 'EVENT':
      case 'ACADEMIC':
      case 'COMMUNITY':
      default:
        return { label: 'School Event', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-300' };
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white p-4 shadow-md border border-sky-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-wide">HOUSE ACTIVITIES</h1>
              <p className="text-xs text-sky-200">Competitions, Sports, Cultural & Events</p>
            </div>
          </div>

          {canManage && (
            <button
              onClick={openCreateModal}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create</span>
            </button>
          )}
        </div>

        {/* Quick count strip */}
        <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/10 rounded-xl py-1.5">
            <p className="text-[10px] text-sky-200 uppercase font-bold">Upcoming</p>
            <p className="text-base font-black text-amber-300">
              {activities.filter(a => a.status === 'UPCOMING' || a.status === 'IN_PROGRESS').length}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl py-1.5">
            <p className="text-[10px] text-sky-200 uppercase font-bold">Completed</p>
            <p className="text-base font-black text-emerald-300">
              {activities.filter(a => a.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl py-1.5">
            <p className="text-[10px] text-sky-200 uppercase font-bold">My Joined</p>
            <p className="text-base font-black text-sky-300">
              {currentUser ? activities.filter(a => a.participants.includes(currentUser.id)).length : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search activities, venues, competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'COMPETITION', label: 'Competitions' },
            { id: 'SPORTS', label: 'Sports' },
            { id: 'CULTURAL', label: 'Cultural' },
            { id: 'MEETING', label: 'Meetings' },
            { id: 'EVENT', label: 'School Events' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeCategoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Tab Toggle */}
        <div className="flex bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveStatusFilter('UPCOMING')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeStatusFilter === 'UPCOMING'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Upcoming & Live
          </button>
          <button
            onClick={() => setActiveStatusFilter('COMPLETED')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeStatusFilter === 'COMPLETED'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed & History
          </button>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-6">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2.5 opacity-60" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No activities found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {searchQuery ? 'Try adjusting your search or category filter.' : 'No activities scheduled under this section yet.'}
            </p>
            {canManage && (
              <button
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Schedule First Activity
              </button>
            )}
          </div>
        ) : (
          filteredActivities.map(activity => {
            const badge = getCategoryBadge(activity.category);
            const isJoined = currentUser ? activity.participants.includes(currentUser.id) : false;
            const isFull = activity.maxParticipants ? activity.participants.length >= activity.maxParticipants : false;

            return (
              <div
                key={activity.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Points ribbon */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    {activity.status === 'COMPLETED' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Finished
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {isJoined ? 'Joined ✓' : 'Registration Open'}
                      </span>
                    )}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-black flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    +{activity.pointsAwarded || 50} Pts
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  {activity.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {activity.description}
                </p>

                {/* Metadata Details */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-750 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{activity.location}</span>
                  </div>
                </div>

                {/* Participants bar and action buttons */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {activity.participants.length}
                      {activity.maxParticipants ? ` / ${activity.maxParticipants}` : ''} participants
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Management actions (Edit / Delete) */}
                    {canManage && (
                      <>
                        <button
                          onClick={() => openEditModal(activity)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title="Edit Activity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingActivityId(activity.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {/* Member RSVP action */}
                    {activity.status !== 'COMPLETED' && (
                      isJoined ? (
                        <button
                          onClick={() => leaveActivity(activity.id)}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          <span>Leave</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => joinActivity(activity.id)}
                          disabled={isFull}
                          className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 ${
                            isFull 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          }`}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{isFull ? 'Full' : 'Join'}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Activity Modal */}
      {(isCreateModalOpen || editingActivity) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">
                  {editingActivity ? 'Edit House Activity' : 'Schedule New Activity'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingActivity(null);
                }}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inter-House Football Championship"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as ActivityCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="COMPETITION">Upcoming Competition</option>
                  <option value="SPORTS">Sports Activity</option>
                  <option value="CULTURAL">Cultural Program</option>
                  <option value="MEETING">House Meeting</option>
                  <option value="EVENT">School Event</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details, eligibility, house lineup, and rules..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="04:00 PM"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School Sports Complex / Room 204"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">House Points</label>
                  <input
                    type="number"
                    value={formPoints}
                    onChange={e => setFormPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Participants</label>
                  <input
                    type="number"
                    value={formMaxParticipants}
                    onChange={e => setFormMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingActivity(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  {editingActivity ? 'Update Activity' : 'Publish Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingActivityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete House Activity?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              This will remove the event schedule and all member registrations.
            </p>
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setDeletingActivityId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteActivity}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
