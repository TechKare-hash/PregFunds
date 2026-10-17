'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Phone, ShieldCheck, Calendar, Clock, CheckCircle2, ArrowLeft, FileText, DollarSign, HeartHandshake } from 'lucide-react';

export default function HospitalPartnerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; residentialAddress: string; dueDate: string; careStatus: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('pregfunds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Fallback sample user if accessed directly
      setUser({
        fullName: 'Abigail Ebuk',
        residentialAddress: '15 Aka Road, Uyo, Akwa Ibom State',
        dueDate: '2026-11-15',
        careStatus: 'matched'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-rose-600 text-white p-2 rounded-xl shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <h1 className="text-sm font-black text-slate-900">Accredited Hospital Partner View</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Escrow Guaranteed Partner</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Hospital Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full pointer-events-none -z-0"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Primary Assigned Escrow Facility
              </span>
              <h2 className="text-2xl font-black text-slate-900">University of Uyo Teaching Hospital (UUTH)</h2>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Official accredited maternal healthcare partner under the B2G/B2B PregFunds Escrow Care Initiative. All antenatal, laboratory investigations, and emergency delivery costs are pre-funded and settled directly through smart escrow milestones.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Nwaniba Road, Uyo, Akwa Ibom State (Matched to your location)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>+234 802 345 6789 (24/7 Maternal Desk)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center shrink-0 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Patient</p>
              <p className="text-xs font-bold text-slate-900">{user?.fullName || 'Abigail Ebuk'}</p>
              <p className="text-[11px] text-rose-600 font-bold">Due: {user?.dueDate || 'Nov 15, 2026'}</p>
              <div className="pt-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  Active Escrow Protection
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Sections: Escrow Milestones & Hospital Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Escrow Disbursement Milestones */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-rose-600" /> Hospital Escrow Disbursement Track
              </h3>
              <span className="text-xs font-bold text-slate-500">Funded by State Donor Pool</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900">Milestone 1: Antenatal Care & Labs</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">Scans, blood tests & consultation fees</p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-2xs">Released ($150)</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-900">Milestone 2: Safe Delivery & Emergency Care</p>
                  <p className="text-[10px] text-rose-700 mt-0.5">Locked in escrow pending delivery confirmation</p>
                </div>
                <span className="text-xs font-black text-rose-700 bg-white px-3 py-1 rounded-xl shadow-2xs">Secured ($650)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Milestone 3: Postpartum & Pediatric Check</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">6-week maternal & infant immunization</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-xl shadow-2xs">Scheduled ($200)</span>
              </div>
            </div>
          </div>

          {/* Upcoming Hospital Appointments & Verification Log */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" /> Next Accredited Appointment
              </h3>
              <span className="text-xs font-bold text-rose-600">Confirmed</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Third Trimester Ultrasound Scan</span>
                <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-rose-600" /> Oct 18, 2026 • 10:00 AM</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Please present your PregFunds Digital ID QR code at the Obstetrics & Gynecology front desk upon arrival. No out-of-pocket payment required.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-700">Dr. Grace Essien (OB-GYN)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-bold">Pre-Approved</span>
              </div>
            </div>

            <div className="bg-rose-600/10 p-4 rounded-2xl border border-rose-200 flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-rose-900 leading-tight">
                Hospital staff verify patient identity via biometric match at check-in, guaranteeing instant claim payouts directly from institutional escrow.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}