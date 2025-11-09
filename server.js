import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (you can restrict to frontend URL later)
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = "super_secret_dashboard_key";

// Basic test route
app.get("/", (req, res) => {
  res.send(" Backend chal raha hai running successfully");
});

// 🔐 Login route
app.post("/api/login", (req, res) => {
  const { uid, name } = req.body;
  if (!uid || !name) {
    return res.status(400).json({ error: "Kaha jaa rahe ho uid aur username toh enter karo " });
  }

  const token = jwt.sign({ uid, name }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

//  Authenticate Socket.IO connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));
  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`🟢 ${socket.user.name} connected`);

  // Emit random dashboard data every 3 seconds
  const interval = setInterval(() => {
    socket.emit("dashboardData", {
      activeUsers: Math.floor(Math.random() * 100),
      memoryUsage: (Math.random() * 500).toFixed(2),
    });
  }, 3000);

  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.user.name} disconnected`);
    clearInterval(interval);
  });
});

server.listen(4000, () => console.log(" Server running on http://localhost:4000"));
