import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Announcement, AnnouncementCategory } from '../../types/house';
import { 
  Bell, 
  X, 
  Plus, 
  Pin, 
  Paperclip, 
  Heart, 
  ShieldCheck, 
  BookOpen, 
  AlertCircle,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    announcements, 
    addAnnouncement, 
    toggleLikeAnnouncement, 
    currentUser 
  } = useHouse();

  const [activeCategory, setActiveCategory] = useState<'ALL' | AnnouncementCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('NOTICE');
  const [isPinned, setIsPinned] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  if (!isOpen) return null;

  const canPublish = currentUser?.role === 'CAPTAIN' || currentUser?.role === 'HOUSE_TEACHER';

  const categories: { id: 'ALL' | AnnouncementCategory; label: string }[] = [
    { id: 'ALL', label: 'All Notices' },
    { id: 'NOTICE', label: 'Notice' },
    { id: 'COMPETITION', label: 'Competitions' },
    { id: 'PRACTICE', label: 'Practice' },
    { id: 'ACTIVITY', label: 'Activities' },
    { id: 'MEETING', label: 'Meetings' },
  ];

  const filtered = announcements.filter(item => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!title.trim() || !description.trim()) {
      setCreateError('Please provide both title and description.');
      return;
    }

    const res = addAnnouncement({
      title: title.trim(),
      description: description.trim(),
      category,
      isPinned,
      attachmentName: attachmentName.trim() || undefined,
    });

    if (res.success) {
      setTitle('');
      setDescription('');
      setIsPinned(false);
      setAttachmentName('');
      setIsCreating(false);
    } else {
      setCreateError(res.error || 'Failed to post announcement.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 to-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold">House Announcements</h2>
              <p className="text-xs text-sky-200">Official Notices & Circulars</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button for Captain & Teachers */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          {canPublish && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Close Form' : 'Publish'}</span>
            </button>
          )}
        </div>

        {/* Publish form (Captain & House Teacher only) */}
        {isCreating && (
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900 animate-in fade-in">
            <h3 className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              New Official Announcement
            </h3>

            {createError && (
              <div className="mb-2 p-2 text-xs text-rose-700 bg-rose-100 rounded-lg flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Announcement Title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />

              <textarea
                required
                rows={3}
                placeholder="Detailed description, schedule, or guidelines..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    <option value="NOTICE">Notice</option>
                    <option value="COMPETITION">Competition</option>
                    <option value="PRACTICE">Practice Schedule</option>
                    <option value="ACTIVITY">Activity</option>
                    <option value="MEETING">Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Attachment (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule.pdf"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Pin to top of feed</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Announcements Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Bell className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs font-bold">No announcements found.</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isPinned
                    ? 'bg-amber-50/50 dark:bg-slate-800/90 border-amber-300 dark:border-amber-700/60 shadow-sm'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      {item.category}
                    </span>
                    {item.isPinned && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                        <Pin className="w-2.5 h-2.5 fill-amber-500" /> Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>

                {/* Optional Attachment Card */}
                {item.attachmentName && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                        {item.attachmentName}
                      </span>
                      <span className="text-[10px] text-slate-400">({item.attachmentSize || 'PDF'})</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Download
                    </span>
                  </div>
                )}

                {/* Footer info: Author & Likes */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {item.authorRole === 'CAPTAIN' && <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />}
                    {item.authorRole === 'HOUSE_TEACHER' && <BookOpen className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{item.authorName} ({item.authorRole})</span>
                  </div>

                  <button
                    onClick={() => toggleLikeAnnouncement(item.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{item.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
