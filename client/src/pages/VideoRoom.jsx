import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react';

const VideoRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();
  const socketRef = useRef();

  const servers = {
    iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }]
  };

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');
    
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      pcRef.current = new RTCPeerConnection(servers);
      stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

      pcRef.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', { roomId, candidate: event.candidate });
        }
      };

      socketRef.current.emit('join-room', roomId, user.id);

      socketRef.current.on('user-connected', async () => {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socketRef.current.emit('offer', { roomId, sdp: offer });
      });

      socketRef.current.on('offer', async (sdp) => {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socketRef.current.emit('answer', { roomId, sdp: answer });
      });

      socketRef.current.on('answer', async (sdp) => {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socketRef.current.on('ice-candidate', async (candidate) => {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socketRef.current.on('user-disconnected', () => {
        setRemoteStream(null);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });
    };

    init();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      pcRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const toggleMute = () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    navigate('/');
  };

  return (
    <div style={{ height: '100vh', background: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Remote Video (Full Screen) */}
      {remoteStream ? (
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={48} style={{ marginBottom: '1rem' }} />
          <p>Waiting for other participant...</p>
        </div>
      )}

      {/* Local Video (PIP) */}
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', width: '240px', height: '160px', borderRadius: '1rem', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1.5rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={toggleMute} style={{ background: isMuted ? '#f87171' : 'rgba(255,255,255,0.1)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button onClick={toggleVideo} style={{ background: isVideoOff ? '#f87171' : 'rgba(255,255,255,0.1)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
        <button onClick={endCall} style={{ background: '#ef4444', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoRoom;
