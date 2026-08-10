const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io for WebRTC Signaling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, sdp }) => {
    socket.to(roomId).emit('offer', sdp);
  });

  socket.on('answer', ({ roomId, sdp }) => {
    socket.to(roomId).emit('answer', sdp);
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-disconnected');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes Placeholder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/triage', require('./routes/triage'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/prescriptions', require('./routes/prescriptions'));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hms-mern')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HMS Server running on port ${PORT}`);
});
