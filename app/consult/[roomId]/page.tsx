"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, User } from 'lucide-react';

export default function VideoConsultationRoom() {
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [appointment, setAppointment] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Timer
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    
    // Fetch Appointment Details
    fetch(`/api/appointments/${roomId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.message) {
          setAppointment(data);
        }
      })
      .catch(err => console.error("Failed to fetch appointment:", err));

    // Fetch Token
    fetch('/api/video/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
    })
    .then(res => res.json())
    .then(data => {
      setToken(data.token);
      setLoading(false);
    });

    return () => clearInterval(timer);
  }, [roomId]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-[#030712] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Video Area */}
      <div className="flex-1 relative bg-black/50 backdrop-blur-3xl border-r border-white/5">
        <div className="absolute top-8 left-8 z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm">
          Room: {roomId}
        </div>
        <div className="absolute top-8 right-8 z-10 bg-red-500 px-4 py-2 rounded-full text-white font-bold text-sm animate-pulse">
          LIVE {formatTime(duration)}
        </div>

        {/* Remote Video (Mock) */}
        <div className="w-full h-full flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-opacity-20">
          <div className="text-white text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              D
            </div>
            <p className="text-2xl font-bold tracking-tight mb-2">Waiting for doctor to join...</p>
            <p className="text-cyan-400">MediConnect Secure Consultation</p>
          </div>
        </div>

        {/* Local Preview (PIP) */}
        <div className="absolute bottom-32 right-8 w-48 h-32 bg-black/60 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-500 mb-2" />
            <span className="absolute bottom-2 left-3 text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded">You</span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/40 p-4 rounded-full border border-white/10 backdrop-blur-xl">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isCameraOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 h-14 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center gap-2"
          >
            <PhoneOff className="w-5 h-5" /> End Call
          </button>
        </div>
      </div>

      {/* Side Panel (Notes/History) */}
      <aside className="w-full md:w-[400px] bg-[#0a0f1c] flex flex-col border-l border-white/5 relative z-10">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-bold text-white tracking-tight">Consultation Details</h3>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Patient Information</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div>
            {appointment ? (
              <>
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]">
                    {appointment.patient?.fullName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-bold text-white tracking-tight">{appointment.patient?.fullName || 'Patient'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {appointment.patient?.patientProfile?.gender || 'Unknown'} | <span className="text-red-400">{appointment.patient?.patientProfile?.bloodGroup || 'N/A'}</span>
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-sm text-gray-300 leading-relaxed relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/50"></div>
                  <strong className="text-orange-400 block mb-1">Symptoms reported:</strong> 
                  {appointment.symptoms || "No symptoms reported."}
                </div>
              </>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
                <div className="h-24 bg-orange-500/10 rounded-2xl w-full"></div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div> Clinical Notes
            </h4>
            <textarea 
              placeholder="Doctor's notes appear here..."
              className="w-full h-48 p-5 bg-white/5 rounded-2xl border border-white/10 focus:ring-2 focus:ring-cyan-500 text-sm text-white transition-all resize-none placeholder-gray-600 outline-none"
            ></textarea>
            <p className="text-[10px] text-gray-500 mt-3 text-right flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Auto-saving...
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase tracking-wide text-sm">
            Generate E-Prescription
          </button>
        </div>
      </aside>
    </div>
  );
}
