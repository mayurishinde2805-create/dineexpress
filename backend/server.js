require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// 🚀 DineExpress Production Backend
app.get("/", (req, res) => res.send("DineExpress Backend is LIVE [Asset Sync v1] 🚀"));

// 📦 ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');

// 🔌 ROUTE REGISTRATION
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

// 📂 STATIC FILES (Consolidated in backend/public for Render)
app.use('/images', cors(), express.static(path.join(__dirname, 'public/images')));
app.use('/models', cors(), express.static(path.join(__dirname, 'public/models')));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 DineExpress Server on port ${PORT}`);
});
