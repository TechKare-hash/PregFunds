'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ShieldCheck, Mail, Lock, ArrowRight, User, Building2, Landmark, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'hospital' | 'donor'>('hospital');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    let userData: any = {};

    if (selectedRole === 'patient') {
      userData = {
        fullName: email ? email.split('@')[0] : 'Zainab Ibrahim',
        email: email || 'zainab@gmail.com',
        role: 'patient',
        residenceCountry: 'Nigeria',
        currency: 'NGN',
        escrowAllocated: 250000,
        assignedHospital: 'St. Raphael Maternal Hospital',
        stage: 'Third Trimester (Care Completed)'
      };
    } else if (selectedRole === 'donor') {
      userData = {
        fullName: email ? email.split('@')[0] : 'Bill & Melinda Gates Foundation',
        email: email || 'grants@gatesfoundation.org',
        role: 'donor',
        residenceCountry: 'United States',
        currency: 'USD',
        totalDisbursed: 15400000,
        activeEscrowPools: 6850000
      };
    } else {
      userData = {
        fullName: email ? email.split('@')[0] : 'St. Raphael Maternal Hospital',
        email: email || 'admin@straphaelhospital.org',
        role: 'hospital',
        isPremium: true,
        residenceCountry: 'Nigeria',
        currency: 'NGN',
        adminName: 'Dr. Amina Bello',
        careStatus: 'verified_active',
        escrowBalance: 2350000,
        subscriptionTier: 'Premium Enterprise',
        walletBalance: 450000,
        phone: '+234 803 000 1122'
      };
    }

    localStorage.setItem('pregfunds_user', JSON.stringify(userData));
    setSuccessMsg(`Login successful as ${selectedRole.toUpperCase()}. Redirecting to your dashboard...`);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Sign In to Pregfunds</h2>
          <p className="text-xs text-slate-500">Select your role and access your dedicated portal</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedRole('patient')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'patient' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Patient
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('hospital')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'hospital' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Hospital
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('donor')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'donor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4" /> Donor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address ({selectedRole} account)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder={selectedRole === 'patient' ? 'zainab@gmail.com' : selectedRole === 'donor' ? 'grants@gatesfoundation.org' : 'admin@straphaelhospital.org'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs">
          <p className="text-slate-500">
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-600 font-bold hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}