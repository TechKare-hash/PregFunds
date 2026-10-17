'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    state: 'Lagos',
    trimester: 'First Trimester',
    dueDate: '',
    monthlyIncome: 'Under ?50,000',
    medicalRiskNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-rose-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
        
        {/* Header */}
        <div className="bg-rose-600 px-6 py-8 text-white text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-3">
            <Heart className="w-8 h-8 text-rose-200" />
          </div>
          <h1 className="text-2xl font-bold">PregFunds Grant Application</h1>
          <p className="text-rose-100 text-sm mt-1">AI-Powered Maternal Care & Hospital Voucher Matching</p>
        </div>

        {successData ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Application Approved!</h2>
            <p className="text-gray-600 text-sm">
              Your application has been successfully evaluated by our triage engine. You have been matched with healthcare funding and a partner facility.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2 border border-gray-200">
              <p className="text-gray-900"><strong>Status:</strong> <span className="text-emerald-600 font-semibold">Approved</span></p>
              <p className="text-gray-900"><strong>Triage Assessment:</strong> {successData.riskLevel}</p>
              <p className="text-gray-900"><strong>Reference ID:</strong> {successData.applicationId}</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 transition"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="08012345678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State / Region</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Trimester</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  value={formData.trimester}
                  onChange={(e) => setFormData({ ...formData, trimester: e.target.value })}
                >
                  <option value="First Trimester">First Trimester</option>
                  <option value="Second Trimester">Second Trimester</option>
                  <option value="Third Trimester">Third Trimester</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Due Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Household Income Bracket</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              >
                <option value="Under ?50,000">Under ?50,000</option>
                <option value="?50,000 - ?150,000">?50,000 - ?150,000</option>
                <option value="?150,000 - ?300,000">?150,000 - ?300,000</option>
                <option value="Above ?300,000">Above ?300,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical History / Symptoms (Optional)</label>
              <textarea
                rows={3}
                placeholder="Mention any prior complications, chronic conditions, or current symptoms..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                value={formData.medicalRiskNotes}
                onChange={(e) => setFormData({ ...formData, medicalRiskNotes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-medium hover:bg-rose-700 transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Triage...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
