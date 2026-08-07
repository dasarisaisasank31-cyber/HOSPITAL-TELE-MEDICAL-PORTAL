"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Calendar, Clock, CreditCard, Stethoscope } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [booking, setBooking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then(res => res.json())
      .then(data => {
        setDoctor(data);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot) return alert('Please select a time slot');
    setBooking(true);
    try {
      // 1. Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: doctor.consultationFee }),
      });
      const order = await orderRes.json();

      // 2. Create appointment
      const apptRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: id,
          scheduledAt: `${selectedDate}T${selectedSlot}:00Z`,
          symptoms,
          amount: doctor.consultationFee,
        }),
      });

      if (apptRes.ok) {
        alert('Appointment booked successfully (Mock Payment Verified)');
        router.push('/dashboard/patient/appointments');
      }
    } catch (err) {
      alert('Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#030712] pb-20 selection:bg-cyan-500/30">
      <div className="relative pt-32 pb-40 px-4 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            {doctor.fullName[0]}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{doctor.fullName}</h1>
            <p className="text-cyan-400 text-lg font-medium">{doctor.specialization}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm flex items-center gap-2 backdrop-blur-md">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {doctor.rating || '4.8'}
              </span>
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm flex items-center gap-2 backdrop-blur-md">
                <Calendar className="w-4 h-4 text-cyan-400" /> {doctor.experience} Yrs Exp
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-400" /> About Doctor
            </h3>
            <p className="text-gray-400 leading-relaxed font-light">{doctor.bio || 'Highly skilled professional dedicated to patient care.'}</p>
            <div className="mt-8">
              <h4 className="font-bold text-white mb-4">Qualifications</h4>
              <p className="text-sm text-gray-500 bg-white/5 p-4 rounded-xl border border-white/5 inline-block">{doctor.qualifications}</p>
            </div>
          </div>
        </div>

        {/* Right: Booking Widget */}
        <div className="md:col-span-1">
          <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl sticky top-24">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
              <span className="text-gray-400 text-sm font-medium">Consultation Fee</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">₹{doctor.consultationFee}</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" /> Select Date
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 text-sm text-white color-scheme-dark"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" /> Available Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(slot => (
                    <button 
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSlot === slot 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Symptoms (Optional)</label>
                <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Tell doctor about your health..."
                  className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 text-sm text-white h-24 resize-none placeholder-gray-600"
                ></textarea>
              </div>

              <button 
                onClick={handleBooking}
                disabled={booking}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {booking ? 'Processing...' : <><CreditCard className="w-5 h-5" /> Confirm & Pay</>}
              </button>
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold flex items-center justify-center gap-1 mt-4">
                Secure Payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
