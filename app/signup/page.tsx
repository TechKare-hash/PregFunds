'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'hospital' | 'grantor' | 'patient'>('hospital');
  const [facilityName, setFacilityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role, facilityName }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      if (role === 'hospital') {
        router.push('/hospital');
      } else if (role === 'grantor') {
        router.push('/dashboard');
      } else {
        router.push('/apply');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your PregFunds Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Connecting maternal healthcare with digital funding</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200 font-medium">{error}</div>}

        <form className="mt-8 space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">I am joining as a:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('hospital')}
                className={role === 'hospital' ? 'py-2.5 px-3 border rounded-md text-xs font-bold transition-colors bg-blue-600 text-white border-blue-600 shadow-sm' : 'py-2.5 px-3 border rounded-md text-xs font-semibold transition-colors bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
              >
                Healthcare Facility
              </button>
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={role === 'patient' ? 'py-2.5 px-3 border rounded-md text-xs font-bold transition-colors bg-blue-600 text-white border-blue-600 shadow-sm' : 'py-2.5 px-3 border rounded-md text-xs font-semibold transition-colors bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
              >
                Patient / Mother
              </button>
              <button
                type="button"
                onClick={() => setRole('grantor')}
                className={role === 'grantor' ? 'py-2.5 px-3 border rounded-md text-xs font-bold transition-colors bg-blue-600 text-white border-blue-600 shadow-sm' : 'py-2.5 px-3 border rounded-md text-xs font-semibold transition-colors bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
              >
                Grantor / Donor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Dr. Abigail Ebuk"
            />
          </div>

          {role === 'hospital' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900">Facility / Hospital Name</label>
              <input
                type="text"
                required
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="e.g. St. Mary Maternal Clinic"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="abigail@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Creating Account...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}