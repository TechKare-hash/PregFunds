'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake, Mail, Lock, User, Building2, Landmark, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'hospital' | 'donor'>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Retrieve existing user directory to enforce strict unique email constraint
    const existingUsersJSON = localStorage.getItem('pregfunds_all_users');
    const allUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

    const emailTaken = allUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (emailTaken) {
      setErrorMsg(`Error: The email address "${email}" is already registered as a ${emailTaken.role.toUpperCase()}. Each user must maintain a unique account.`);
      return;
    }

    // Build user profile based on role
    let newUser: any = {
      fullName,
      email: email.toLowerCase(),
      phone,
      role,
      createdAt: new Date().toISOString()
    };

    if (role === 'patient') {
      newUser.residenceCountry = 'Nigeria';
      newUser.currency = 'NGN';
      newUser.escrowAllocated = 250000;
      newUser.assignedHospital = 'St. Raphael Maternal Hospital';
      newUser.stage = 'Third Trimester (Care Active)';
    } else if (role === 'donor') {
      newUser.residenceCountry = 'United States';
      newUser.currency = 'USD';
      newUser.totalDisbursed = 0;
      newUser.activeEscrowPools = 5000000;
    } else {
      newUser.isPremium = true;
      newUser.residenceCountry = 'Nigeria';
      newUser.currency = 'NGN';
      newUser.adminName = fullName;
      newUser.careStatus = 'verified_active';
      newUser.escrowBalance = 1500000;
      newUser.subscriptionTier = 'Premium Enterprise';
      newUser.walletBalance = 450000;
    }

    // Save to global user registry & active session
    allUsers.push(newUser);
    localStorage.setItem('pregfunds_all_users', JSON.stringify(allUsers));
    localStorage.setItem('pregfunds_user', JSON.stringify(newUser));

    // Record Founder Notification Telemetry
    const notificationsJSON = localStorage.getItem('pregfunds_founder_notifications');
    const notifications = notificationsJSON ? JSON.parse(notificationsJSON) : [];
    notifications.unshift({
      id: Date.now().toString(),
      text: `New ${role.toUpperCase()} Registration: ${fullName} (${email})`,
      timestamp: new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString()
    });
    localStorage.setItem('pregfunds_founder_notifications', JSON.stringify(notifications));

    setSuccessMsg(`Account successfully created! Welcome to Pregfunds, ${fullName}. Redirecting to your dashboard...`);

    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Your Pregfunds Account</h2>
          <p className="text-xs text-slate-500">Commercial clearinghouse for maternal care & institutional grants</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex flex-col items-center gap-1 ${role === 'patient' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <User className="w-4 h-4" /> Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('hospital')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex flex-col items-center gap-1 ${role === 'hospital' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <Building2 className="w-4 h-4" /> Hospital
          </button>
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex flex-col items-center gap-1 ${role === 'donor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            <Landmark className="w-4 h-4" /> Donor
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">
              {role === 'hospital' ? 'Hospital / Facility Name' : role === 'donor' ? 'Organization / Funder Name' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={role === 'hospital' ? 'St. Raphael Maternal Hospital' : role === 'donor' ? 'Bill & Melinda Gates Foundation' : 'Zainab Ibrahim'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-indigo-600 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Unique Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="user@domain.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-indigo-600 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="+234 803 000 1122"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-indigo-600 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-indigo-600 font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            Create Unique {role.charAt(0).toUpperCase() + role.slice(1)} Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs">
          <p className="text-slate-500">
            Already have a unique account?{' '}
            <a href="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}