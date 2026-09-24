import React, { useState, useMemo } from 'react';
import { useHouse } from '../../context/HouseContext';
import { UserRole } from '../../types/house';
import { 
  Users, 
  X, 
  Search, 
  Filter, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface MembersDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MembersDirectoryModal: React.FC<MembersDirectoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { users } = useHouse();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  if (!isOpen) return null;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.rollNumber.toLowerCase().includes(search.toLowerCase());

      const matchesClass = classFilter === 'ALL' || user.classLevel === classFilter;
      const matchesSection = sectionFilter === 'ALL' || user.section === sectionFilter;
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

      return matchesSearch && matchesClass && matchesSection && matchesRole;
    });
  }, [users, search, classFilter, sectionFilter, roleFilter]);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'CAPTAIN':
        return {
          label: 'House Captain',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
          icon: <ShieldCheck className="w-3 h-3 inline mr-1 text-amber-600" />
        };
      case 'HOUSE_TEACHER':
        return {
          label: 'House Teacher',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
          icon: <BookOpen className="w-3 h-3 inline mr-1 text-emerald-600" />
        };
      default:
        return {
          label: 'Student Member',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200',
          icon: <GraduationCap className="w-3 h-3 inline mr-1 text-blue-600" />
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 to-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold">Mahanadi House Directory</h2>
              <p className="text-xs text-sky-200">Enrolled Students & Faculty ({users.length})</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="ALL">All Classes</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="Faculty">Faculty</option>
            </select>

            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="ALL">All Sec</option>
              <option value="A">Sec A</option>
              <option value="B">Sec B</option>
              <option value="C">Sec C</option>
              <option value="D">Sec D</option>
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="ALL">All Roles</option>
              <option value="CAPTAIN">Captain</option>
              <option value="HOUSE_TEACHER">Teacher</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
        </div>

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Users className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs font-bold">No members found matching filters.</p>
            </div>
          ) : (
            filteredUsers.map(member => {
              const roleInfo = getRoleBadge(member.role);

              return (
                <div
                  key={member.id}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {member.fullName}
                        </h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleInfo.badge}`}>
                          {roleInfo.icon}{roleInfo.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Class {member.classLevel} {member.section} • Roll No: <strong className="text-slate-700 dark:text-slate-300">{member.rollNumber}</strong>
                      </p>

                      {member.motto && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                          "{member.motto}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 justify-end">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">
                      Joined {member.joinedDate.split('-')[0]}
                    </span>
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
