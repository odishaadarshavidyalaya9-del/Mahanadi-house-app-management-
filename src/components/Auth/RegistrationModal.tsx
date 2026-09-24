import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { UserRole } from '../../types/house';
import { MahanadiLogo } from '../MahanadiLogo';
import { X, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerUser } = useHouse();

  const [formData, setFormData] = useState({
    fullName: '',
    classLevel: '10th',
    section: 'A',
    rollNumber: '',
    dob: '2010-05-15',
    mobileNumber: '',
    email: '',
    password: '',
    role: 'MEMBER' as UserRole,
    bloodGroup: 'B+',
    motto: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Math Captcha
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(5);
  const [captchaInput, setCaptchaInput] = useState('');

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput('');
  };

  const [error, setError] = useState<string | null>(null);
  const [successCard, setSuccessCard] = useState<boolean>(false);

  if (!isOpen) return null;

  const validateIndianMobile = (phone: string): boolean => {
    // Check clean digits: either 10 digits starting with 6-9, or +91 followed by 10 digits
    const cleaned = phone.replace(/[\s\-+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      const remaining = cleaned.slice(2);
      return /^[6-9]\d{9}$/.test(remaining);
    }
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validations
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.rollNumber.trim()) {
      setError('Please provide your class roll number.');
      return;
    }

    if (!validateIndianMobile(formData.mobileNumber)) {
      setError('Invalid Indian mobile number. Enter a valid 10-digit number starting with 6-9 (e.g. +91 9876543210).');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid school or personal email address.');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setError('Please create a secure password (minimum 4 characters).');
      return;
    }

    // Captcha validation
    if (parseInt(captchaInput.trim(), 10) !== captchaNum1 + captchaNum2) {
      setError('Captcha calculation is incorrect. Please try again.');
      refreshCaptcha();
      return;
    }

    // Format mobile to +91 XXXXXXXXXX
    const digitsOnly = formData.mobileNumber.replace(/\D/g, '');
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith('91') 
      ? digitsOnly.slice(2) 
      : digitsOnly.slice(-10);
    const formattedMobile = `+91 ${clean10}`;

    const res = registerUser({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobileNumber: formattedMobile,
      password: formData.password,
      role: formData.role,
      classLevel: formData.role === 'HOUSE_TEACHER' ? 'Faculty' : formData.classLevel,
      section: formData.role === 'HOUSE_TEACHER' ? 'Staff' : formData.section,
      rollNumber: formData.role === 'HOUSE_TEACHER' ? 'FACULTY' : formData.rollNumber.trim(),
      dob: formData.dob,
      house: 'Mahanadi House',
      bloodGroup: formData.bloodGroup,
      motto: formData.motto.trim() || 'Proud to be a member of Mahanadi House.',
    });

    if (!res.success) {
      setError(res.error || 'Registration failed. Please check your details.');
      return;
    }

    setSuccessCard(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MahanadiLogo size="sm" showText={false} variant="dark" />
            <div>
              <h2 className="text-base font-bold leading-tight">Mahanadi House Registration</h2>
              <p className="text-xs text-sky-200">Official School House Enrollment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {successCard ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300 dark:border-emerald-700">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Welcome to Mahanadi House!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Your account for <span className="font-semibold">{formData.fullName}</span> has been successfully enrolled into Mahanadi House.
              </p>

              {/* ID Badge Preview */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 text-white text-left shadow-lg border border-amber-400/40 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">Official House Pass</span>
                    <h4 className="text-base font-bold">{formData.fullName}</h4>
                    <p className="text-xs text-sky-200">{formData.role} • {formData.classLevel} {formData.section}</p>
                  </div>
                  <MahanadiLogo size="sm" showText={false} variant="dark" />
                </div>
                <div className="mt-4 pt-3 border-t border-white/15 flex justify-between text-[11px] text-slate-300">
                  <span>Roll No: <strong className="text-white">{formData.rollNumber}</strong></span>
                  <span>House: <strong className="text-amber-300">Mahanadi</strong></span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="mt-6 w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                Proceed to House Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MEMBER', 'CAPTAIN', 'HOUSE_TEACHER'] as UserRole[]).map(roleOption => {
                    const isSelected = formData.role === roleOption;
                    const roleLabel = roleOption === 'CAPTAIN' ? 'Captain' : roleOption === 'HOUSE_TEACHER' ? 'Teacher' : 'Member';
                    return (
                      <button
                        type="button"
                        key={roleOption}
                        onClick={() => setFormData({ ...formData, role: roleOption })}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {roleLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class, Section, Roll Number */}
              {formData.role !== 'HOUSE_TEACHER' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Class
                    </label>
                    <select
                      value={formData.classLevel}
                      onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                    >
                      <option value="9th">9th</option>
                      <option value="10th">10th</option>
                      <option value="11th">11th</option>
                      <option value="12th">12th</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Section
                    </label>
                    <select
                      value={formData.section}
                      onChange={e => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                      <option value="C">Sec C</option>
                      <option value="D">Sec D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Roll No <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24"
                      value={formData.rollNumber}
                      onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Date of Birth & Blood Group */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* House (Automatically locked to Mahanadi House) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  School House
                </label>
                <div className="flex items-center justify-between px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold text-blue-800 dark:text-blue-300">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Mahanadi House</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-blue-200/70 dark:bg-blue-900/60 px-1.5 py-0.5 rounded text-blue-900 dark:text-blue-200 font-semibold">
                    Assigned
                  </span>
                </div>
              </div>

              {/* Mobile Number (+91 format) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Indian Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.mobileNumber}
                    onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full pl-12 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  10-digit mobile number starting with 6, 7, 8, or 9
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@school.edu"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Set Account Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 4 characters"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Captcha */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Security Verification (Captcha)
                  </label>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-extrabold tracking-widest text-slate-800 dark:text-slate-200 select-none">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="Result"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    className="w-24 px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white text-center font-bold"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                id="btn-submit-registration"
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-sky-700 hover:from-blue-800 hover:to-sky-800 text-white font-bold rounded-xl shadow-md transition-all text-sm mt-2"
              >
                Complete House Enrollment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
