require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// 🧪 EMERGENCY DIAGNOSTIC ROUTES (TOP PRIORITY)
app.get("/", (req, res) => res.send("DineExpress Emergency Backend v2 🚀"));
app.get("/api/ping", (req, res) => res.json({ status: "alive" }));

// 📦 ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');

// 🔌 ROUTE REGISTRATION (BEFORE MIDDLEWARES)
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

// 📂 STATIC FILES
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
app.use('/models', express.static(path.join(__dirname, '../frontend/public/models')));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Emergency Server on port ${PORT}`);
});
