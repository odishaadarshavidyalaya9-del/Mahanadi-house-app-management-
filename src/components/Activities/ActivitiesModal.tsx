import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { ActivityCategory, HouseActivity } from '../../types/house';
import { 
  Compass, 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    activities, 
    addActivity, 
    joinActivity, 
    leaveActivity, 
    currentUser, 
    users 
  } = useHouse();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');
  const [isCreating, setIsCreating] = useState(false);

  // New activity form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('04:00 PM');
  const [location, setLocation] = useState('School Sports Ground');
  const [category, setCategory] = useState<ActivityCategory>('SPORTS');
  const [pointsAwarded, setPointsAwarded] = useState(50);
  const [maxParticipants, setMaxParticipants] = useState(20);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const canManage = currentUser?.role === 'CAPTAIN' || currentUser?.role === 'HOUSE_TEACHER';

  const filteredActivities = activities.filter(a => {
    if (activeTab === 'UPCOMING') return a.status === 'UPCOMING' || a.status === 'IN_PROGRESS';
    return a.status === 'COMPLETED' || a.status === 'CANCELLED';
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim() || !location.trim()) {
      setFormError('Please fill all required activity details.');
      return;
    }

    const res = addActivity({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      pointsAwarded: Number(pointsAwarded),
      maxParticipants: Number(maxParticipants),
    });

    if (res.success) {
      setTitle('');
      setDescription('');
      setIsCreating(false);
    } else {
      setFormError(res.error || 'Failed to create activity.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 to-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold">House Activities & Events</h2>
              <p className="text-xs text-sky-200">Competitions, Sports & Drills</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher and Create Button */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'UPCOMING'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Upcoming ({activities.filter(a => a.status === 'UPCOMING').length})
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'COMPLETED'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Completed ({activities.filter(a => a.status === 'COMPLETED').length})
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Close' : 'Add Event'}</span>
            </button>
          )}
        </div>

        {/* Create Activity Form for Captain / Teachers */}
        {isCreating && (
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900 animate-in fade-in overflow-y-auto max-h-80">
            <h3 className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-2">
              Create New House Activity
            </h3>

            {formError && (
              <div className="mb-2 p-2 text-xs text-rose-700 bg-rose-100 rounded-lg flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateActivity} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Activity Title (e.g. Football Trials)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />

              <textarea
                required
                rows={2}
                placeholder="Description & requirements..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="03:30 PM"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Turf"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ActivityCategory)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    <option value="SPORTS">Sports</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="MEETING">House Meeting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Points for House</label>
                  <input
                    type="number"
                    value={pointsAwarded}
                    onChange={e => setPointsAwarded(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Max Slots</label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={e => setMaxParticipants(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors mt-2"
              >
                Schedule House Activity
              </button>
            </form>
          </div>
        )}

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Compass className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs font-bold">No activities in this section.</p>
            </div>
          ) : (
            filteredActivities.map(activity => {
              const isJoined = currentUser ? activity.participants.includes(currentUser.id) : false;
              const isFull = activity.maxParticipants ? activity.participants.length >= activity.maxParticipants : false;

              return (
                <div
                  key={activity.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      {activity.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      +{activity.pointsAwarded} House Pts
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activity.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {activity.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {activity.time}
                    </span>
                    <span className="flex items-center gap-1.5 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activity.location}
                    </span>
                  </div>

                  {/* Participants & Action RSVP */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold">
                        {activity.participants.length}
                        {activity.maxParticipants ? `/${activity.maxParticipants}` : ''} joined
                      </span>
                    </div>

                    {activity.status === 'UPCOMING' && currentUser && (
                      isJoined ? (
                        <button
                          onClick={() => leaveActivity(activity.id)}
                          className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Joined (Cancel)</span>
                        </button>
                      ) : (
                        <button
                          disabled={isFull}
                          onClick={() => joinActivity(activity.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                            isFull 
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isFull ? 'Slots Full' : 'RSVP / Join'}
                        </button>
                      )
                    )}

                    {activity.status === 'COMPLETED' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Event Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
