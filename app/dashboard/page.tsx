'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ShieldCheck, Building2, Landmark, CheckCircle2, Award, ArrowUpRight, Wallet, Sparkles, Check, Zap, Users, ExternalLink, Clock, FileText, ChevronRight, X, Activity, CreditCard, Settings, HelpCircle, Shield, User, Lock, LogOut, Mail, Baby, Plus, Stethoscope, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pregfunds_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-4 max-w-sm w-full">
          <p className="text-xs font-bold text-slate-700">No active session found or role not selected.</p>
          <button 
            onClick={() => router.push('/login')} 
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-md hover:bg-indigo-700 transition"
          >
            Please Sign In Again
          </button>
        </div>
      </div>
    );
  }

  // STRICT ROLE ROUTING: RENDER ONLY THE LOGGED-IN USER'S UNIQUE DASHBOARD
  if (user.role === 'patient') {
    return <PatientDashboard user={user} router={router} setUser={setUser} />;
  } else if (user.role === 'donor') {
    return <DonorDashboard user={user} router={router} setUser={setUser} />;
  } else {
    return <HospitalDashboard user={user} router={router} setUser={setUser} />;
  }
}

/* ==========================================
   1. PATIENT DASHBOARD (Expecting Mother)
   ========================================== */
function PatientDashboard({ user, router, setUser }: { user: any; router: any; setUser: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'grants' | 'wallet' | 'settings'>('overview');
  const [successMessage, setSuccessMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '+234 803 111 2233' });

  const [appointments, setAppointments] = useState<any[]>([
    { id: 'apt1', hospital: 'St. Raphael Maternal Hospital', date: 'Oct 12, 2026 - 10:00 AM', doctor: 'Dr. Amina Bello', type: 'Third Trimester Anomaly & Vitals Check', status: 'Confirmed' },
    { id: 'apt2', hospital: 'St. Raphael Maternal Hospital', date: 'Nov 2, 2026 - 09:00 AM', doctor: 'Dr. John Okafor', type: 'Postpartum Pediatric & Maternal Review', status: 'Scheduled' }
  ]);

  const [walletBalance, setWalletBalance] = useState<number>(15000);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt = { id: Date.now().toString(), hospital: user.assignedHospital || 'St. Raphael Maternal Hospital', date: 'Oct 20, 2026 - 11:00 AM', doctor: 'Dr. Amina Bello', type: 'Antenatal Consultation & Ultrasound', status: 'Confirmed' };
    setAppointments([newApt, ...appointments]);
    setSuccessMessage('Appointment booked successfully! Automated calendar invite dispatched.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleFundCopay = (amount: number) => {
    setWalletBalance(walletBalance + amount);
    setSuccessMessage(`Successfully added ₦${amount.toLocaleString()} to your personal medical copay balance.`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, fullName: profileForm.fullName, email: profileForm.email, phone: profileForm.phone };
    setUser(updated);
    localStorage.setItem('pregfunds_user', JSON.stringify(updated));
    setShowProfile(false);
    setSuccessMessage('Patient profile updated successfully.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('pregfunds_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-900 tracking-tight">Pregfunds Care Clearinghouse</h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Expecting Mother Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowProfile(true)}
              className="text-right hidden sm:flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-2xl transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {user.fullName ? user.fullName[0] : 'P'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                <p className="text-[10px] text-slate-500">Patient Profile</p>
              </div>
            </button>
            <button 
              onClick={handleSignOut}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">Patient Navigation</p>
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Activity className="w-4 h-4" /> Health Overview
            </button>
            <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'appointments' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Calendar className="w-4 h-4" /> Hospital Appointments
            </button>
            <button onClick={() => setActiveTab('grants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'grants' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ShieldCheck className="w-4 h-4" /> Escrow & Subsidies
            </button>
            <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Wallet className="w-4 h-4" /> Personal Copay Wallet
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Settings className="w-4 h-4" /> Profile & Settings
            </button>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
                <span className="bg-indigo-700 text-indigo-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Verified Patient Care Account</span>
                <h2 className="text-2xl font-black">Welcome back, {user.fullName}</h2>
                <p className="text-xs text-indigo-200 max-w-xl">
                  Your antenatal care and milestone treatments are fully subsidized and backed by international institutional escrow grants.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Hospital</span>
                  <p className="text-sm font-black text-slate-900">{user.assignedHospital || 'St. Raphael Maternal Hospital'}</p>
                  <p className="text-[11px] text-emerald-600 font-bold">Verified Active Care Center</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Care Stage</span>
                  <p className="text-sm font-black text-indigo-600">{user.stage || 'Third Trimester & Delivery'}</p>
                  <p className="text-[11px] text-slate-500">Milestone tracking active</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Escrow Grant Allocation</span>
                  <p className="text-sm font-black text-slate-900">₦{(user.escrowAllocated || 250000).toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">Fully covered for treatment</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Scheduled Hospital Appointments</h3>
                  <p className="text-xs text-slate-500">Manage upcoming checkups and consultations at your designated facility.</p>
                </div>
                <button onClick={handleBookAppointment} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm">
                  Book New Visit
                </button>
              </div>

              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{apt.type}</p>
                      <p className="text-indigo-600">{apt.hospital} • {apt.doctor}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{apt.date}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-lg">{apt.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'grants' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900">Subsidized Grant Coverage</h3>
              <p className="text-slate-500">Your pregnancy care is fully funded by global institutional grants locked in smart escrow contracts.</p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-indigo-900">Gates Foundation Global Health Grant</p>
                  <p className="text-indigo-700 text-[10px]">Covers antenatal, delivery, and postpartum care.</p>
                </div>
                <span className="bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg">Active Subsidy</span>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Personal Copay & Extras Wallet</h3>
                  <p className="text-xs text-slate-500">Use for optional medications or private hospital amenities.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Balance</p>
                  <p className="text-lg font-black text-indigo-600">₦{walletBalance.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleFundCopay(5000)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                  + Add ₦5,000 to Copay
                </button>
                <button onClick={() => handleFundCopay(10000)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                  + Add ₦10,000 to Copay
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900">Patient Settings & Notifications</h3>
              <div className="flex justify-between items-center py-2">
                <p className="font-bold text-slate-900">SMS Appointment Reminders</p>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
              </div>
            </div>
          )}
        </main>
      </div>

      {showProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900">Patient Profile Settings</h3>
              <button onClick={() => setShowProfile(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Full Name</label>
                <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Email Address</label>
                <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Phone Number</label>
                <input type="text" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   2. DONOR DASHBOARD (Institutional Funder)
   ========================================== */
function DonorDashboard({ user, router, setUser }: { user: any; router: any; setUser: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'escrow_audit' | 'analytics' | 'settings' | 'support'>('overview');
  const [successMessage, setSuccessMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '+1 206 555 0199' });

  const [pendingApplications, setPendingApplications] = useState<any[]>([
    { id: 'app1', hospital: 'St. Raphael Maternal Hospital', grantTitle: 'Global Maternal Emergency Grant 2026', amount: 1500000, date: 'Oct 6, 2026', status: 'Pending Board Review' },
    { id: 'app2', hospital: 'Grace Maternity Clinic', grantTitle: 'Safe Delivery Equipment Subsidy', amount: 850000, date: 'Oct 5, 2026', status: 'Pending Board Review' },
    { id: 'app3', hospital: 'Evergreen Health Center', grantTitle: 'Community Rural Outreach Care Fund', amount: 500000, date: 'Oct 4, 2026', status: 'Pending Board Review' }
  ]);

  const [escrowAudits, setEscrowAudits] = useState<any[]>([
    { id: 'esc1', hospital: 'St. Raphael Maternal Hospital', grant: 'Global Maternal Emergency Grant', amount: 1500000, status: 'Locked in Escrow (Milestone Active)', date: 'Oct 5, 2026' },
    { id: 'esc2', hospital: 'Lagos Island Maternity', grant: 'WHO Maternal Care Subsidy', amount: 2000000, status: 'Disbursed to Facility Account', date: 'Oct 1, 2026' }
  ]);

  const handleApproveApplication = (appId: string, hospitalName: string, amount: number) => {
    setPendingApplications(pendingApplications.map(app => app.id === appId ? { ...app, status: 'Approved & Funded' } : app));
    setEscrowAudits([
      { id: Date.now().toString(), hospital: hospitalName, grant: 'Approved Grant Allocation', amount: amount, status: 'Locked in Escrow (Milestone Active)', date: 'Just now' },
      ...escrowAudits
    ]);
    setSuccessMessage(`Successfully approved grant application for ${hospitalName}. ₦${amount.toLocaleString()} securely locked in escrow.`);
    setTimeout(() => setSuccessMessage(''), 7000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, fullName: profileForm.fullName, email: profileForm.email, phone: profileForm.phone };
    setUser(updated);
    localStorage.setItem('pregfunds_user', JSON.stringify(updated));
    setShowProfile(false);
    setSuccessMessage('Donor profile updated successfully.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('pregfunds_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-900 tracking-tight">Pregfunds Donor Funder Portal</h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Institutional Grantmaker Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowProfile(true)}
              className="text-right hidden sm:flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-2xl transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {user.fullName ? user.fullName[0] : 'D'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                <p className="text-[10px] text-slate-500">Institutional Funder</p>
              </div>
            </button>
            <button 
              onClick={handleSignOut}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">Donor Command</p>
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Building2 className="w-4 h-4" /> Funder Overview
            </button>
            <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Zap className="w-4 h-4" /> Review Hospital Applications
            </button>
            <button onClick={() => setActiveTab('escrow_audit')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'escrow_audit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Shield className="w-4 h-4" /> Escrow & Disbursal Audit
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Activity className="w-4 h-4" /> Impact & Analytics
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Settings className="w-4 h-4" /> Funder Settings
            </button>
            <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'support' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <HelpCircle className="w-4 h-4" /> Support & Compliance
            </button>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 z-10">
                  <span className="bg-indigo-700 text-indigo-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Verified Institutional Grantmaker</span>
                  <h2 className="text-xl sm:text-2xl font-black">{user.fullName || 'Bill & Melinda Gates Foundation'}</h2>
                  <p className="text-xs text-indigo-200 max-w-xl">
                    Review hospital grant applications, lock funds securely in smart escrow contracts, and monitor health impact metrics in real-time.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[200px]">
                  <p className="text-[10px] text-indigo-200 font-bold uppercase">Total Disbursed Grants</p>
                  <p className="text-xl font-black text-white mt-1">₦17,250,000</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Partner Hospitals</span>
                  <p className="text-lg font-black text-indigo-600">14 Facilities</p>
                  <p className="text-[11px] text-slate-500">Active across regions</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Escrow Pools</span>
                  <p className="text-lg font-black text-slate-900">₦6,850,000</p>
                  <p className="text-[11px] text-slate-500">Locked in milestone contracts</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Applications</span>
                  <p className="text-lg font-black text-amber-600">3 Hospital Requests</p>
                  <p className="text-[11px] text-slate-500">Action required</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-sm font-black text-slate-900">Hospital Grant Applications Review</h3>
                <p className="text-xs text-slate-500">Inspect grant requests submitted by healthcare facilities and approve them to automatically lock funds into escrow.</p>
              </div>

              <div className="space-y-4">
                {pendingApplications.map(app => (
                  <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{app.hospital}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${app.status === 'Approved & Funded' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-indigo-600">{app.grantTitle}</p>
                      <p className="text-[10px] text-slate-400">Submitted: {app.date}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Requested Amount</p>
                        <p className="text-sm font-black text-slate-900">₦{app.amount.toLocaleString()}</p>
                      </div>

                      {app.status !== 'Approved & Funded' ? (
                        <button
                          onClick={() => handleApproveApplication(app.id, app.hospital, app.amount)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Lock Escrow
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Funded
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'escrow_audit' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-sm font-black text-slate-900">Escrow & Disbursal Audit Trail</h3>
                <p className="text-xs text-slate-500">Cryptographically secure logs of all grant funds locked in escrow and released to participating hospitals.</p>
              </div>

              <div className="space-y-3">
                {escrowAudits.map(esc => (
                  <div key={esc.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{esc.hospital}</p>
                      <p className="text-indigo-600">{esc.grant}</p>
                      <p className="text-[10px] text-slate-400">{esc.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-sm">₦{esc.amount.toLocaleString()}</p>
                      <span className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-2.5 py-1 rounded-lg">{esc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900">Global Maternal Impact Analytics</h3>
              <p className="text-slate-500">Over 1,200 successful deliveries recorded across partner facilities with 99.4% maternal survival rate.</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Total Mothers Supported</span>
                  <span className="text-lg font-black text-indigo-600">1,240 Mothers</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Escrow Utilization Rate</span>
                  <span className="text-lg font-black text-emerald-600">98.2% Efficiency</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900">Donor Funder Preferences</h3>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">Automatic Hospital Application Notifications</p>
                  <p className="text-slate-400 text-[10px]">Receive email alerts whenever a new facility submits a grant request</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl space-y-3 text-xs">
              <p className="font-bold text-indigo-900">Pregfunds Institutional Compliance Desk</p>
              <p className="text-indigo-700">Email: institutional@pregfunds.org • Phone: +1 206 555 0100</p>
              <button onClick={() => setSuccessMessage('Compliance inquiry submitted successfully.')} className="bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm">
                Open Compliance Ticket
              </button>
            </div>
          )}
        </main>
      </div>

      {showProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900">Donor Profile Settings</h3>
              <button onClick={() => setShowProfile(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Organization Name</label>
                <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Official Email</label>
                <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Phone</label>
                <input type="text" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   3. HOSPITAL DASHBOARD (Facility Command)
   ========================================== */
function HospitalDashboard({ user, router, setUser }: { user: any; router: any; setUser: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'grants' | 'escrow_patients' | 'subscription' | 'payment_methods' | 'settings' | 'compliance' | 'support'>('overview');
  const [appliedGrants, setAppliedGrants] = useState<string[]>(['Gates Foundation Global Health Grant', 'WHO Maternal Care Subsidy']);
  const [disbursedLogs, setDisbursedLogs] = useState<any[]>([
    { id: 'l1', donor: 'Gates Foundation Global Health Grant', amount: 1500000, date: 'Oct 5, 2026', status: 'Disbursed to Linked Account' },
    { id: 'l2', donor: 'WHO Maternal Care Subsidy', amount: 850000, date: 'Oct 6, 2026', status: 'Funds in Escrow Vault' }
  ]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([
    { id: 'b1', bankName: 'Zenith Bank', accountNumber: '2294810059', accountName: 'Ebuk, Abigail Okokon', isDefault: true }
  ]);
  const [newBankForm, setNewBankForm] = useState({ bankName: '', accountNumber: '', accountName: '' });
  const [showAddBank, setShowAddBank] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [checkoutPkg, setCheckoutPkg] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user.fullName || '', adminName: user.adminName || '', email: user.email || '', phone: user.phone || '' });

  const assignedPatients = [
    { id: 'p1', name: 'Zainab Ibrahim', age: 28, bloodGroup: 'O+', stage: 'Third Trimester (Care Completed)', assignedGrant: 'Gates Foundation Global Health Grant', escrowAllocated: 250000, status: 'Completed', lastVisit: 'Oct 5, 2026', vitals: { bp: '120/80 mmHg', heartRate: '78 bpm', weight: '72 kg' }, notes: 'Delivered successfully. Postpartum recovery phase initiated.' },
    { id: 'p2', name: 'Grace Chinedu', age: 32, bloodGroup: 'A+', stage: 'Postpartum Care Phase', assignedGrant: 'WHO Maternal Care Subsidy', escrowAllocated: 180000, status: 'Postpartum Active', lastVisit: 'Oct 4, 2026', vitals: { bp: '115/75 mmHg', heartRate: '82 bpm', weight: '65 kg' }, notes: 'Post-childbirth wellness checkups ongoing.' }
  ];

  const subscriptionPackages = [
    { name: 'Standard Care Tier', price: '₦50,000 / mo', desc: 'Ideal for small local clinics.', features: ['Up to 50 Patient Records', 'Single Funder Pipeline'] },
    { name: 'Premium Enterprise', price: '₦150,000 / mo', desc: 'For established maternity hospitals.', features: ['Unlimited Patient Records', 'Multi-Donor Grant Matching'], popular: true },
    { name: 'Global Health Partner', price: '₦350,000 / mo', desc: 'For major medical centers.', features: ['Multi-Facility Command', 'Direct API Access'] }
  ];

  const realDonorsDirectory = [
    { id: 'd1', name: 'Bill & Melinda Gates Foundation', type: 'Global Philanthropic Funder', status: 'Active Funder', totalFunded: '₦3,500,000', activeGrant: 'Gates Foundation Global Health Grant', website: 'https://www.gatesfoundation.org' },
    { id: 'd2', name: 'World Health Organization (WHO)', type: 'Multilateral Health Agency', status: 'Active Funder', totalFunded: '₦1,850,000', activeGrant: 'WHO Maternal Care Subsidy', website: 'https://www.who.int' },
    { id: 'd3', name: 'UNICEF Health & Family Welfare', type: 'International Development Agency', status: 'Open Funder', totalFunded: '₦0', activeGrant: 'UNICEF Rural Family Health Initiative', website: 'https://www.unicef.org' }
  ];

  const grantsList = [
    { id: 'g1', title: 'Gates Foundation Global Health Grant', funder: 'Bill & Melinda Gates Foundation', amount: 1500000, description: 'Funding for high-risk obstetric care and C-sections.', portalLink: 'https://www.gatesfoundation.org' },
    { id: 'g2', title: 'WHO Maternal Care Subsidy', funder: 'World Health Organization (WHO)', amount: 850000, description: 'Allocation for antenatal screening and neonatal units.', portalLink: 'https://www.who.int' },
    { id: 'g3', title: 'UNICEF Rural Family Health Initiative', funder: 'UNICEF', amount: 600000, description: 'Subsidized care packages for rural expectant mothers.', portalLink: 'https://www.unicef.org' }
  ];

  const handleApplyGrant = (grantTitle: string, amount: number) => {
    if (appliedGrants.includes(grantTitle)) return;
    setAppliedGrants([...appliedGrants, grantTitle]);
    const updatedBalance = (user.escrowBalance || 2350000) + amount;
    const updatedUser = { ...user, escrowBalance: updatedBalance };
    setUser(updatedUser);
    localStorage.setItem('pregfunds_user', JSON.stringify(updatedUser));
    setDisbursedLogs([{ id: Date.now().toString(), donor: grantTitle, amount: amount, date: 'Just now', status: 'Funds in Escrow Vault' }, ...disbursedLogs]);
    setSuccessMessage(`[Automated Email Dispatched to ${user.email}]: Grant application for "${grantTitle}" approved! ₦${amount.toLocaleString()} added to your escrow vault.`);
    setTimeout(() => setSuccessMessage(''), 7000);
  };

  const handleRequestPayout = (patientName: string, amount: number) => {
    const defaultBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0];
    setSuccessMessage(`Escrow payout of ₦${amount.toLocaleString()} for patient ${patientName}'s completed care transferred to ${defaultBank.bankName} (${defaultBank.accountNumber}).`);
    setTimeout(() => setSuccessMessage(''), 7000);
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankForm.bankName || !newBankForm.accountNumber || !newBankForm.accountName) return;
    const newAcc = { id: Date.now().toString(), bankName: newBankForm.bankName, accountNumber: newBankForm.accountNumber, accountName: newBankForm.accountName, isDefault: bankAccounts.length === 0 };
    setBankAccounts([...bankAccounts, newAcc]);
    setNewBankForm({ bankName: '', accountNumber: '', accountName: '' });
    setShowAddBank(false);
    setSuccessMessage('New bank account successfully added.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSetDefaultBank = (id: string) => {
    setBankAccounts(bankAccounts.map(b => ({ ...b, isDefault: b.id === id })));
    setSuccessMessage('Preferred payout bank account updated.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleConfirmPayment = (pkgName: string) => {
    const updated = { ...user, subscriptionTier: pkgName };
    setUser(updated);
    localStorage.setItem('pregfunds_user', JSON.stringify(updated));
    setCheckoutPkg(null);
    setSuccessMessage(`Successfully upgraded to ${pkgName}.`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, fullName: profileForm.fullName, adminName: profileForm.adminName, email: profileForm.email, phone: profileForm.phone };
    setUser(updated);
    localStorage.setItem('pregfunds_user', JSON.stringify(updated));
    setShowProfileModal(false);
    setSuccessMessage('Hospital profile updated.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('pregfunds_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-900 tracking-tight">Pregfunds Hospital Portal</h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Facility Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="text-right hidden sm:flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-2xl transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {user.fullName ? user.fullName[0] : 'H'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                <p className="text-[10px] text-slate-500">Hospital Admin Profile</p>
              </div>
            </button>
            <button 
              onClick={handleSignOut}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">Hospital Command</p>
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Building2 className="w-4 h-4" /> Facility Overview
            </button>
            <button onClick={() => setActiveTab('donors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'donors' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Landmark className="w-4 h-4" /> Real Donors & Directory
            </button>
            <button onClick={() => setActiveTab('grants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'grants' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Zap className="w-4 h-4" /> Grants & Funding Pipeline
            </button>
            <button onClick={() => setActiveTab('escrow_patients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'escrow_patients' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Users className="w-4 h-4" /> Escrow & Patient Records
            </button>
            <button onClick={() => setActiveTab('subscription')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'subscription' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <CreditCard className="w-4 h-4" /> Subscription & Billing
            </button>
            <button onClick={() => setActiveTab('payment_methods')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'payment_methods' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Wallet className="w-4 h-4" /> Payment & Bank Accounts
            </button>

            <div className="pt-3 pb-1 border-t border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">Tools & Settings</p>
            </div>
            <button onClick={() => setActiveTab('compliance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'compliance' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Shield className="w-4 h-4" /> Compliance & Audits
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Settings className="w-4 h-4" /> System Settings
            </button>
            <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${activeTab === 'support' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <HelpCircle className="w-4 h-4" /> Help & Support
            </button>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 z-10">
                  <span className="bg-indigo-700 text-indigo-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase">{user.subscriptionTier || 'Premium Enterprise'}</span>
                  <h2 className="text-xl sm:text-2xl font-black">{user.fullName}</h2>
                  <p className="text-xs text-indigo-200 max-w-xl">
                    Manage institutional grant disbursements, request milestone payouts to your preferred bank account, and oversee patient care.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[200px]">
                  <p className="text-[10px] text-indigo-200 font-bold uppercase">Total Escrow Vault</p>
                  <p className="text-xl font-black text-white mt-1">₦{(user.escrowBalance || 2350000).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-indigo-600" /> Real-Time Fund Disbursal Monitor
                </h3>
                <div className="space-y-2 text-xs">
                  {disbursedLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">{log.donor}</p>
                        <p className="text-[10px] text-slate-400">{log.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-indigo-600 text-sm">₦{log.amount.toLocaleString()}</p>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md">{log.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donors' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-sm font-black text-slate-900">Real Donors & Official Grant Directory</h3>
                <p className="text-xs text-slate-500">Access direct official grant application portals for global health institutional donors.</p>
              </div>
              <div className="space-y-4">
                {realDonorsDirectory.map(donor => (
                  <div key={donor.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">{donor.type}</span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{donor.name}</h4>
                      <p className="text-xs text-slate-500">Grant Program: <span className="font-bold text-slate-800">{donor.activeGrant}</span></p>
                    </div>
                    <a href={donor.website} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      Official Funder Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'grants' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-sm font-black text-slate-900">Grants & Funding Application Pipeline</h3>
                <p className="text-xs text-slate-500">Click <strong>Apply for Grant</strong> to submit your application. Funds are instantly added to your escrow vault upon approval.</p>
              </div>
              <div className="space-y-4">
                {grantsList.map(grant => {
                  const isApplied = appliedGrants.includes(grant.title);
                  return (
                    <div key={grant.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xl">
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">{grant.funder}</span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">{grant.title}</h4>
                        <p className="text-xs text-slate-600">{grant.description}</p>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Grant Amount</p>
                          <p className="text-base font-black text-indigo-600">₦{grant.amount.toLocaleString()}</p>
                        </div>
                        {isApplied ? (
                          <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Funded & In Escrow
                          </div>
                        ) : (
                          <button onClick={() => handleApplyGrant(grant.title, grant.amount)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm cursor-pointer">
                            Apply for Grant
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'escrow_patients' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900">Escrow Vault & Patient Care Completion</h3>
                <p className="text-xs text-slate-500">Request escrow release to your preferred bank account upon patient treatment completion.</p>
              </div>
              <div className="space-y-4">
                {assignedPatients.map(patient => (
                  <div key={patient.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span onClick={() => setSelectedPatient(patient)} className="text-xs font-black text-slate-900 hover:text-indigo-600 cursor-pointer underline">
                          {patient.name} (View Profile)
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">{patient.stage} • Blood Group: {patient.bloodGroup}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Milestone Allocation</p>
                        <p className="text-sm font-black text-indigo-600">₦{patient.escrowAllocated.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] text-slate-600 italic">"{patient.notes}"</span>
                      <button onClick={() => handleRequestPayout(patient.name, patient.escrowAllocated)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5" /> Request Payout to Bank
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Subscription Tier: {user.subscriptionTier || 'Premium Enterprise'}</h3>
                  <p className="text-xs text-slate-500">Active wallet balance: ₦{(user.walletBalance || 450000).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPackages.map((pkg, idx) => {
                  const isCurrent = user.subscriptionTier === pkg.name;
                  return (
                    <div key={idx} className={`bg-white p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative ${isCurrent ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200'}`}>
                      <div className="space-y-3">
                        <h5 className="text-sm font-black text-slate-900">{pkg.name}</h5>
                        <p className="text-lg font-black text-indigo-600">{pkg.price}</p>
                        <p className="text-xs text-slate-500">{pkg.desc}</p>
                      </div>
                      <button onClick={() => setCheckoutPkg(pkg)} disabled={isCurrent} className={`w-full py-3 rounded-xl text-xs font-bold cursor-pointer ${isCurrent ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                        {isCurrent ? 'Current Active Package' : 'Upgrade Package'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'payment_methods' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Payment & Payout Bank Accounts</h3>
                  <p className="text-xs text-slate-500">Manage preferred bank accounts for escrow transfers.</p>
                </div>
                <button onClick={() => setShowAddBank(true)} className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm">
                  <Plus className="w-4 h-4" /> Add Bank Account
                </button>
              </div>
              <div className="space-y-4">
                {bankAccounts.map(acc => (
                  <div key={acc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{acc.bankName}</span>
                        {acc.isDefault && <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Preferred Payout Account</span>}
                      </div>
                      <p className="text-xs text-slate-600 font-mono font-bold mt-1">{acc.accountNumber}</p>
                      <p className="text-[11px] text-slate-400">Account Name: {acc.accountName}</p>
                    </div>
                    {!acc.isDefault && (
                      <button onClick={() => handleSetDefaultBank(acc.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                        Set as Preferred
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900">Compliance & Audit Logs</h3>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <p className="font-bold text-slate-900">NDPR & HIPAA Healthcare Privacy Audit</p>
                <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-lg">Passed (100%)</span>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900">System Preferences</h3>
              <div className="flex justify-between items-center py-2">
                <p className="font-bold text-slate-900">Email & SMS Grant Alerts</p>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl space-y-3 text-xs">
              <p className="font-bold text-indigo-900">Pregfunds Care Support Desk</p>
              <p className="text-indigo-700">Email: support@pregfunds.org • Phone: +234 1 888 0922</p>
              <button onClick={() => setSuccessMessage('Support ticket dispatched successfully.')} className="bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm">
                Open Support Ticket
              </button>
            </div>
          )}
        </main>
      </div>

      {showAddBank && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900">Add Payout Bank Account</h3>
              <button onClick={() => setShowAddBank(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddBank} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Bank Name</label>
                <input type="text" placeholder="e.g. Zenith Bank" value={newBankForm.bankName} onChange={e => setNewBankForm({ ...newBankForm, bankName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Account Number (10 Digits)</label>
                <input type="text" maxLength={10} placeholder="2294810059" value={newBankForm.accountNumber} onChange={e => setNewBankForm({ ...newBankForm, accountNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1 font-mono" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Account Name</label>
                <input type="text" placeholder="Ebuk, Abigail Okokon" value={newBankForm.accountName} onChange={e => setNewBankForm({ ...newBankForm, accountName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer">Save Bank Account</button>
            </form>
          </div>
        </div>
      )}

      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900">{selectedPatient.name}'s Medical Profile</h3>
              <button onClick={() => setSelectedPatient(null)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div><span className="text-slate-400 block">Age & Blood Group</span><span className="font-bold">{selectedPatient.age} ({selectedPatient.bloodGroup})</span></div>
                <div><span className="text-slate-400 block">Stage</span><span className="font-bold text-indigo-600">{selectedPatient.stage}</span></div>
              </div>
              <p className="text-slate-600 italic">"{selectedPatient.notes}"</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900">Hospital Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Hospital Name</label>
                <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Administrator</label>
                <input type="text" value={profileForm.adminName} onChange={e => setProfileForm({ ...profileForm, adminName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <div>
                <label className="font-bold text-slate-700">Email</label>
                <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mt-1" required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {checkoutPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900">Subscription Checkout ({checkoutPkg.name})</h3>
              <button onClick={() => setCheckoutPkg(null)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 text-xs space-y-2">
              <p className="font-bold text-indigo-900">Bank Transfer Details:</p>
              <p>Bank: <strong>Zenith Bank</strong></p>
              <p>Account Name: <strong>Ebuk, Abigail Okokon</strong></p>
              <p>Account Number: <strong className="text-indigo-600">2294810059</strong></p>
              <p>Amount: <strong>{checkoutPkg.price}</strong></p>
            </div>
            <button onClick={() => handleConfirmPayment(checkoutPkg.name)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer">I Have Made Payment - Confirm Upgrade</button>
          </div>
        </div>
      )}
    </div>
  );
}