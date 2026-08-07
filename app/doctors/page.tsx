"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, Calendar, Clock, CreditCard, Stethoscope, Search, X, Check, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

function DoctorsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [modalDoctor, setModalDoctor] = useState<any>(null);

  // Booking Modal States
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingSlot, setBookingSlot] = useState('10:00');
  const [symptoms, setSymptoms] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Pre-select specialization from URL query if present (e.g., /doctors?specialization=Cardiology)
  useEffect(() => {
    const urlSpec = searchParams.get('specialization') || searchParams.get('spec');
    if (urlSpec) {
      setSelectedSpecs([urlSpec]);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  // Extract all unique specializations from database
  const availableSpecializations = Array.from(
    new Set(doctors.map((d: any) => d.specialization).filter(Boolean))
  );

  // Filter doctors based on selected checkboxes and search query
  const filteredDoctors = doctors.filter((doc: any) => {
    const matchesSearch =
      !searchQuery.trim() ||
      doc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualifications?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpec =
      selectedSpecs.length === 0 ||
      selectedSpecs.some((s) => doc.specialization?.toLowerCase().includes(s.toLowerCase()));

    return matchesSearch && matchesSpec;
  });

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleOpenBookingModal = (doctor: any) => {
    setModalDoctor(doctor);
    setBookingSlot('10:00');
    setSymptoms('');
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async () => {
    if (!modalDoctor) return;
    if (!bookingSlot) {
      alert("Please select an available consultation slot.");
      return;
    }

    setBookingLoading(true);

    try {
      // 1. Initiate mock order
      await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: modalDoctor.consultationFee || 500 }),
      });

      // 2. Create appointment
      const apptRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: modalDoctor.id || modalDoctor.userId,
          scheduledAt: `${bookingDate}T${bookingSlot}:00Z`,
          symptoms: symptoms || 'General Medical Consultation',
          amount: modalDoctor.consultationFee || 500,
        }),
      });

      if (apptRes.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setModalDoctor(null);
          router.push('/dashboard/patient/appointments');
        }, 1800);
      } else {
        const errorData = await apptRes.json();
        alert(errorData.message || 'Please log in as a Patient to book an appointment.');
      }
    } catch (err) {
      console.error(err);
      alert('Booking request failed. Please check your login session.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-24 font-sans selection:bg-cyan-500/30">
      {/* Top Navbar Header */}
      <header className="fixed top-0 w-full z-40 bg-black/60 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Stethoscope className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">MediConnect</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/dashboard/patient" className="text-xs font-bold text-gray-300 hover:text-cyan-400 transition-colors">
            Patient Dashboard
          </a>
          <a href="/dashboard/patient/symptom-check" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            AI Triage Assistant
          </a>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative pt-36 pb-20 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-6 tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Verified Medical Specialists
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            Find & Book the Right Specialist
          </h1>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-base sm:text-lg">
            Filter by medical specialization, search doctors, and launch instant video consultations.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialization, or condition..."
                className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white placeholder-gray-500 shadow-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-4 bg-white/10 text-gray-300 rounded-2xl font-bold hover:bg-white/20 transition-all text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Specialization Filters */}
          <div className="md:col-span-1 space-y-6 bg-white/[0.02] backdrop-blur-2xl p-6 rounded-3xl border border-white/10 h-fit sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h4 className="font-bold text-white tracking-wide text-xs uppercase flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" /> Specializations
              </h4>
              {selectedSpecs.length > 0 && (
                <button
                  onClick={() => setSelectedSpecs([])}
                  className="text-[11px] font-bold text-cyan-400 hover:underline"
                >
                  Reset ({selectedSpecs.length})
                </button>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedSpecs([])}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  selectedSpecs.length === 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                All Specialists ({doctors.length})
              </button>

              {availableSpecializations.map((spec: any) => {
                const count = doctors.filter((d: any) =>
                  d.specialization?.toLowerCase().includes(spec.toLowerCase())
                ).length;
                const isSelected = selectedSpecs.includes(spec);

                return (
                  <label
                    key={spec}
                    onClick={() => toggleSpecialization(spec)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-white/30 bg-white/5'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold">{spec}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {/* Active Filters Summary Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-sm font-bold text-white">
                  Showing {filteredDoctors.length} specialist{filteredDoctors.length === 1 ? '' : 's'}
                </span>
                {selectedSpecs.length > 0 && (
                  <span className="text-xs text-cyan-400 ml-2 font-medium">
                    filtered by [{selectedSpecs.join(', ')}]
                  </span>
                )}
              </div>

              {selectedSpecs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedSpecs.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold flex items-center gap-1.5"
                    >
                      {s}
                      <button onClick={() => toggleSpecialization(s)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-72 bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl">
                <Stethoscope className="w-16 h-16 text-cyan-500/40 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Specialists Found</h3>
                <p className="text-gray-400 text-sm max-w-md text-center mb-6">
                  No doctors currently match your selected specializations or search criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedSpecs([]);
                    setSearchQuery('');
                  }}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredDoctors.map((doc: any) => (
                  <div
                    key={doc.id || doc.userId}
                    className="bg-white/[0.03] rounded-3xl border border-white/10 p-6 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)] hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 text-2xl font-black shadow-[inset_0_0_20px_rgba(34,211,238,0.15)] group-hover:scale-105 transition-transform">
                          {doc.fullName?.[0] || 'D'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {doc.fullName}
                          </h3>
                          <span className="inline-block mt-1 px-3 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-extrabold uppercase tracking-wider rounded-full">
                            {doc.specialization}
                          </span>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-white">{doc.rating || 4.9}</span>
                            <span className="text-[10px] text-gray-500">({doc.totalReviews || 12} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                            Experience
                          </div>
                          <div className="font-bold text-white text-sm">{doc.experience || 8}+ Years</div>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                            Fee
                          </div>
                          <div className="font-bold text-cyan-400 text-sm">₹{doc.consultationFee || 500}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBookingModal(doc)}
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODAL FOR SELECTING & BOOKING SPECIALIST */}
      {modalDoctor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1329] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative overflow-hidden">
            {/* Modal Close Button */}
            <button
              onClick={() => setModalDoctor(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-white">Appointment Confirmed!</h3>
                <p className="text-gray-300 text-sm max-w-xs mx-auto">
                  Your video consultation with <strong className="text-cyan-400">{modalDoctor.fullName}</strong> is booked for {bookingDate} at {bookingSlot}.
                </p>
                <p className="text-xs text-gray-500">Redirecting to your appointments dashboard...</p>
              </div>
            ) : (
              <div>
                {/* Doctor Summary Header inside Popup */}
                <div className="flex items-center gap-4 pb-6 border-b border-white/10 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                    {modalDoctor.fullName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{modalDoctor.fullName}</h3>
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                      {modalDoctor.specialization}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>★ {modalDoctor.rating || 4.9} rating</span>
                      <span>•</span>
                      <span>{modalDoctor.experience || 8} yrs exp</span>
                    </div>
                  </div>
                </div>

                {/* Consultation Fee Badge */}
                <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl mb-6">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Consultation Fee
                  </span>
                  <span className="text-2xl font-black text-white">
                    ₹{modalDoctor.consultationFee || 500}
                  </span>
                </div>

                {/* Date & Slot Picker */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-400" /> Select Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" /> Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBookingSlot(slot.split(' ')[0])}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                            bookingSlot === slot.split(' ')[0]
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
                    <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      Symptoms / Reason for Visit
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. Seeking consultation for chest tightness or fever..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {bookingLoading ? (
                      'Confirming Booking...'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> Confirm & Pay ₹{modalDoctor.consultationFee || 500}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorsList() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712] text-white flex items-center justify-center font-bold">Loading Specialists...</div>}>
      <DoctorsListContent />
    </Suspense>
  );
}

