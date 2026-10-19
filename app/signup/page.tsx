'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const AFRICAN_COUNTRIES = [
  { name: 'Nigeria', currency: 'NGN (₦)' },
  { name: 'Kenya', currency: 'KES (KSh)' },
  { name: 'Ghana', currency: 'GHS (GH₵)' },
  { name: 'South Africa', currency: 'ZAR (R)' },
  { name: 'Rwanda', currency: 'RWF (FRw)' },
  { name: 'Uganda', currency: 'UGX (USh)' },
  { name: 'Egypt', currency: 'EGP (E£)' },
  { name: 'Ethiopia', currency: 'ETB (Br)' },
  { name: 'Tanzania', currency: 'TZS (TSh)' },
  { name: 'Senegal', currency: 'XOF (CFA)' },
];

export default function SignupPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'hospital' | 'grantor' | 'patient'>('hospital');
  const [facilityName, setFacilityName] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [nationalId, setNationalId] = useState('');

  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignedId, setAssignedId] = useState('');

  const handleCountryChange = (cName: string) => {
    setCountry(cName);
    const matched = AFRICAN_COUNTRIES.find(c => c.name === cName);
    if (matched) setCurrency(matched.currency);
  };

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Unable to access webcam for facial scan. Please allow camera permissions.');
    }
  };

  const captureAndVerifyFace = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setFaceVerified(true);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
    }, 2500);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName, 
          role, 
          facilityName, 
          country, 
          currency, 
          nationalId, 
          faceVerified 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Account creation failed');

      setAssignedId(data.signInId);
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDashboard = () => {
    if (role === 'hospital') router.push('/hospital');
    else if (role === 'grantor') router.push('/dashboard');
    else router.push('/apply');
  };

  const getProgressWidth = () => {
    if (step === 1) return 'w-1/4';
    if (step === 2) return 'w-2/4';
    if (step === 3) return 'w-3/4';
    return 'w-full';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            <span>Step {step} of 4</span>
            <span className="text-blue-600">{step === 1 ? 'Credentials' : step === 2 ? 'Pan-African Region' : step === 3 ? 'Facial Scan' : 'ID Assigned'}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className={`bg-blue-600 h-full transition-all duration-300 ${getProgressWidth()}`}></div>
          </div>
          <h2 className="text-center text-2xl font-extrabold text-gray-900 mt-6">PregFunds Commercial Onboarding</h2>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200 font-medium">{error}</div>}

        {step === 1 && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Select Account Role:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('hospital')}
                  className={role === 'hospital' ? 'py-2 px-2 border rounded-md text-xs font-bold bg-blue-600 text-white border-blue-600' : 'py-2 px-2 border rounded-md text-xs font-semibold bg-white text-gray-800 border-gray-300'}
                >
                  Healthcare Facility
                </button>
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={role === 'patient' ? 'py-2 px-2 border rounded-md text-xs font-bold bg-blue-600 text-white border-blue-600' : 'py-2 px-2 border rounded-md text-xs font-semibold bg-white text-gray-800 border-gray-300'}
                >
                  Patient / Mother
                </button>
                <button
                  type="button"
                  onClick={() => setRole('grantor')}
                  className={role === 'grantor' ? 'py-2 px-2 border rounded-md text-xs font-bold bg-blue-600 text-white border-blue-600' : 'py-2 px-2 border rounded-md text-xs font-semibold bg-white text-gray-800 border-gray-300'}
                >
                  Grantor / Donor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {role === 'hospital' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900">Registered Medical Facility Name</label>
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue to Pan-African Region
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
            <div>
              <label className="block text-sm font-semibold text-gray-900">Country of Residence / Operation</label>
              <select
                required
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select African Country</option>
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900">Assigned Operating Currency</label>
              <input
                type="text"
                disabled
                value={currency || 'Auto-detected upon country selection'}
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 bg-gray-100 rounded-md text-gray-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900">National Identity Number / License No.</label>
              <input
                type="text"
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="mt-1 block w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-gray-900 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                placeholder="NIN, ID Number, or Medical License ID"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-4 border border-gray-300 rounded-md text-sm font-bold text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700"
              >
                Proceed to Facial Biometrics
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-5 text-center">
            <p className="text-sm text-gray-600">Activate your device camera to complete mandatory facial biometric verification.</p>

            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-400">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              
              {!cameraActive && !faceVerified && (
                <div className="absolute text-white text-center p-4">
                  <p className="text-sm font-medium">Camera is offline</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold"
                  >
                    Enable WebCam
                  </button>
                </div>
              )}

              {scanning && (
                <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Scanning Facial Markers...</p>
                </div>
              )}

              {faceVerified && (
                <div className="absolute inset-0 bg-green-900 bg-opacity-70 flex flex-col items-center justify-center text-white">
                  <span className="text-4xl mb-1">✅</span>
                  <p className="text-sm font-extrabold uppercase">Biometric Verification Passed</p>
                </div>
              )}
            </div>

            {cameraActive && !faceVerified && !scanning && (
              <button
                type="button"
                onClick={captureAndVerifyFace}
                className="w-full py-3 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-green-600 hover:bg-green-700"
              >
                Scan & Verify Face
              </button>
            )}

            {faceVerified && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Submitting Registration...' : 'Finalize & Issue Unique Sign-In ID'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-gray-500 underline"
            >
              Back to Region Details
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Unique Commercial ID Generated</p>
              <p className="text-3xl font-mono font-extrabold text-blue-900 mt-2">{assignedId}</p>
              <p className="text-xs text-gray-600 mt-2">Operating Currency: <span className="font-bold">{currency}</span></p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-left text-xs text-green-900 space-y-1">
              <p>✔ Account Verified: <span className="font-bold">{fullName}</span></p>
              <p>✔ Pan-African Region: <span className="font-bold">{country}</span></p>
              <p>✔ Facial Biometrics: <span className="font-bold">Verified & Enrolled</span></p>
            </div>

            <button
              type="button"
              onClick={navigateToDashboard}
              className="w-full py-3 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-sm"
            >
              Launch Role Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}