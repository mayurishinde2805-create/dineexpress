require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

// 🔌 Socket.io Initialization
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middleware to inject io into requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

// 🚀 DineExpress Production Backend
app.get("/", (req, res) => {
  res.send("DineExpress Backend is LIVE [v1.1.0-Phase-91] 🚀");
});

// 📦 ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const tableRoutes = require('./routes/tables');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customers');
const feedbackRoutes = require('./routes/feedback');
const waiterRoutes = require('./routes/waiterRequests');
const analyticsRoutes = require('./routes/analytics');

// 🔌 ROUTE REGISTRATION
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/waiter', waiterRoutes);
app.use('/api/analytics', analyticsRoutes);

// 📂 STATIC FILES
app.use('/images', cors(), express.static(path.join(__dirname, 'public/images')));
app.use('/models', cors(), express.static(path.join(__dirname, 'public/models')));

// Socket connection feedback
io.on('connection', (socket) => {
  console.log('📡 [SOCKET] Client connected');
  socket.on('disconnect', () => console.log('📡 [SOCKET] Client disconnected'));
});

const PORT = process.env.PORT || 4000;
console.log(`Server started at: ${new Date().toISOString()} (Phase 91 Sync)`);
server.listen(PORT, () => {
  console.log(`🚀 DineExpress Server on port ${PORT}`);
});
