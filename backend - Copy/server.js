const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://192.168.0.101:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

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

server.listen(4000, () => {
  console.log("Backend running on port 4000 with Socket.io");
});
