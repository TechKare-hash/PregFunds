'use client';
import { useRouter } from 'next/navigation';
import { Heart, ShieldCheck, UserCheck, UserPlus, Building2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-rose-50/40 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        <div className="inline-flex p-4 bg-rose-100 rounded-full text-rose-600 shadow-sm">
          <Heart className="w-12 h-12 fill-rose-600" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            PregFunds <span className="text-rose-600">Nigeria</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Eliminating financial barriers to maternal healthcare by connecting pregnant women with grants and partner hospitals across all 36 states and FCT.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <button
            onClick={() => router.push('/signup')}
            className="bg-rose-600 text-white p-5 rounded-2xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition flex flex-col items-center space-y-2 text-center cursor-pointer"
          >
            <UserPlus className="w-6 h-6" />
            <span className="font-bold text-base">Sign Up</span>
            <span className="text-xs text-rose-100">Create your account</span>
          </button>

          <button
            onClick={() => router.push('/login')}
            className="bg-white border border-rose-200 text-gray-900 p-5 rounded-2xl shadow-sm hover:bg-rose-50/50 transition flex flex-col items-center space-y-2 text-center cursor-pointer"
          >
            <UserCheck className="w-6 h-6 text-rose-600" />
            <span className="font-bold text-base">Sign In</span>
            <span className="text-xs text-gray-500">Access your dashboard</span>
          </button>

          <button
            onClick={() => router.push('/apply')}
            className="bg-white border border-rose-200 text-gray-900 p-5 rounded-2xl shadow-sm hover:bg-rose-50/50 transition flex flex-col items-center space-y-2 text-center cursor-pointer"
          >
            <ShieldCheck className="w-6 h-6 text-rose-600" />
            <span className="font-bold text-base">Apply for Grant</span>
            <span className="text-xs text-gray-500">AI triage & hospital matching</span>
          </button>

          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-900 text-white p-5 rounded-2xl shadow-sm hover:bg-gray-800 transition flex flex-col items-center space-y-2 text-center cursor-pointer"
          >
            <Building2 className="w-6 h-6" />
            <span className="font-bold text-base">Hospital Portal</span>
            <span className="text-xs text-gray-400">Verify vouchers</span>
          </button>
        </div>

      </div>
    </main>
  );
}
