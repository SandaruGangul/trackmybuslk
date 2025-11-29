const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Socket.io configuration for production
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('joinRoute', (routeId) => {
    socket.join(`route-${routeId}`);
    console.log(`Socket ${socket.id} joined route-${routeId}`);
  });
  
  socket.on('updateBusLocation', (data) => {
    console.log('Broadcasting update to route:', data.routeId);
    io.to(`route-${data.routeId}`).emit('busLocationUpdate', data);
  });
  
  socket.on('busUpdateDeleted', (data) => {
    console.log('Broadcasting deletion:', data);
    io.emit('busUpdateDeleted', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'TrackMyBusLK API is running',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
