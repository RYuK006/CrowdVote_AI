const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const socketLib = require('./lib/socket');

const app = express();
const server = http.createServer(app);
const io = socketLib.init(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    name: 'CrowdVote AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on http://127.0.0.1:${PORT}`);
});
