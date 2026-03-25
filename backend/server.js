require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.113:3000",
  "http://192.168.0.100:3000",
  "http://192.168.0.102:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

// Health Check Routes
app.get("/", (req, res) => res.send("DineExpress Backend is LIVE v1774468745702 🚀"));
app.get("/test", (req, res) => res.send("Test route working!"));
// --- TEMPORARY DIAGNOSTIC ROUTE ---
app.get("/api/check-raw", (req, res) => {
  const db = require('./config/db');
  db.query("SELECT COUNT(*) as count FROM menu_items", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ table: "menu_items", result });
  });
});


// Basic request logging for debugging missing images
app.use((req, res, next) => {
  if (req.url.includes('/images') || req.url.includes('/uploads')) {
    console.log(`[DEBUG] Image Request: ${req.url}`);
  }
  next();
});

// Serve Images directory statically with CORS
app.use('/images', cors(), express.static(path.join(__dirname, '../frontend/public/images')));

// Serve Models directory statically with strict CORS and MIME types (REQUIRED for model-viewer)
app.use('/models', express.static(path.join(__dirname, '../frontend/public/models'), {
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    if (filePath.endsWith('.glb')) {
      res.set('Content-Type', 'model/gltf-binary');
    }
  }
}));
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/images'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Attach io to request for use in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("callWaiter", (data) => {
    io.emit("callWaiter", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const tableRoutes = require('./routes/tables');
const customerRoutes = require('./routes/customers');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/waiter-requests', require('./routes/waiterRequests'));
app.use('/api/gallery', require('./routes/gallery'));

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} with Socket.io`);
});
